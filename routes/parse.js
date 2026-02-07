const express = require('express');
const router = express.Router();
const axios = require('axios');
const cheerio = require('cheerio');
const { estimateCO2 } = require('../utils/co2Lookup');

router.post('/', async (req, res) => {
    const { url } = req.body;

    if (!url) {
        return res.status(400).json({ error: 'URL is required' });
    }

    try {
        const headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
            'Accept-Language': 'de-DE,de;q=0.9,en-US;q=0.8,en;q=0.7',
            'Accept-Encoding': 'gzip, deflate, br',
            'Upgrade-Insecure-Requests': '1',
            'Sec-Fetch-Dest': 'document',
            'Sec-Fetch-Mode': 'navigate',
            'Sec-Fetch-Site': 'none',
            'Sec-Fetch-User': '?1',
            'Cache-Control': 'max-age=0',
            'Connection': 'keep-alive'
        };

        const response = await axios.get(url, { headers });
        const html = response.data;
        const $ = cheerio.load(html);
        const bodyText = $('body').text();

        let vehicleData = {
            make: 'Unknown',
            model: 'Unknown',
            price: 0,
            year: 0,
            mileage: 0,
            co2: 0,
            location: 'Germany',
            country: 'Germany',
            power: 0,
            transmission: 'Unknown',
            fuelType: '',
            currency: 'EUR',
            imageUrl: '',
            images: [], // Array to store multiple images
            isEstimatedCO2: false
        };

        // --- HELPER: Find value by text label ---
        const findValueByLabel = (labels) => {
            for (const label of labels) {
                const escapedLabel = label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                // Allow spaces/hyphens in the value group
                const regex = new RegExp(`${escapedLabel}[:\\s]*([\\w\\d\\/\\.\\,\\s-]+)`, 'i');
                const match = bodyText.match(regex);
                if (match && match[1]) return match[1].trim();
            }
            return null;
        };

        // --- HELPER: Validate Image URL ---
        const isInvalidImage = (src) => {
            if (!src) return true;
            // Removed risky keywords: static, map, advert, background, hero, seller
            if (src.match(/icon|logo|pixel|tracker|avatar|banner|profile|dealer|haendler|autohaus|vendor/i)) return true;
            if (src.endsWith('.svg')) return true;
            return false;
        };

        // --- HELPER: Check if element is in an excluded container ---
        const isExcluded = ($elem) => {
            return $elem.closest('.seller-info, .dealer-info, .contact-box, .seller-box, .vip-seller, .vip-header, .dealer-header, .seller-branding, [data-testid="seller-branding"], .image-gallery-background').length > 0;
        };

        // STRATEGY 1: JSON-LD (Structured Data)
        let jsonLd = null;
        $('script[type="application/ld+json"]').each((i, elem) => {
            try {
                const data = JSON.parse($(elem).html());
                if (data['@type'] === 'Product' || data['@type'] === 'Car' || data['@type'] === 'Vehicle') {
                    jsonLd = data;
                }
                if (Array.isArray(data)) {
                    const product = data.find(item => item['@type'] === 'Product' || item['@type'] === 'Car');
                    if (product) jsonLd = product;
                }
            } catch (e) { /* ignore */ }
        });

        if (jsonLd) {
            vehicleData.make = jsonLd.brand?.name || jsonLd.manufacturer || vehicleData.make;
            vehicleData.model = jsonLd.model || vehicleData.model;

            // Location Extraction from JSON-LD
            if (jsonLd.offers && jsonLd.offers.availableAtOrFrom && jsonLd.offers.availableAtOrFrom.address) {
                const address = jsonLd.offers.availableAtOrFrom.address;
                if (address.addressLocality) {
                    vehicleData.location = address.addressLocality;
                }
                if (address.addressCountry) {
                    vehicleData.country = address.addressCountry;
                }
            }

            // Handle Image Arrays (Metadata) - We store it but will prioritize gallery later
            let candidateImage = '';
            if (Array.isArray(jsonLd.image)) {
                candidateImage = jsonLd.image[0];
            } else if (jsonLd.image && typeof jsonLd.image === 'object' && jsonLd.image.url) {
                candidateImage = jsonLd.image.url;
            } else {
                candidateImage = jsonLd.image;
            }

            if (!isInvalidImage(candidateImage)) {
                vehicleData.imageUrl = candidateImage;
            }

            if (jsonLd.offers) {
                const offer = Array.isArray(jsonLd.offers) ? jsonLd.offers[0] : jsonLd.offers;
                vehicleData.price = Number(offer.price) || vehicleData.price;
                vehicleData.currency = offer.priceCurrency || vehicleData.currency;
            }

            if (jsonLd.productionDate) {
                vehicleData.year = new Date(jsonLd.productionDate).getFullYear();
            } else if (jsonLd.modelDate) {
                vehicleData.year = new Date(jsonLd.modelDate).getFullYear();
            }

            if (jsonLd.mileageFromOdometer) {
                vehicleData.mileage = Number(jsonLd.mileageFromOdometer.value || jsonLd.mileageFromOdometer);
            }

            if (jsonLd.vehicleEngine && jsonLd.vehicleEngine.enginePower) {
                const powerKw = Number(jsonLd.vehicleEngine.enginePower.value || jsonLd.vehicleEngine.enginePower);
                if (powerKw) vehicleData.power = Math.round(powerKw * 1.36);
            }

            vehicleData.fuelType = jsonLd.fuelType || '';
            vehicleData.transmission = jsonLd.vehicleTransmission || vehicleData.transmission;
        }

        // STRATEGY 2: OpenGraph & Meta Tags (Fallback)
        if (vehicleData.make === 'Unknown') {
            const title = $('meta[property="og:title"]').attr('content') || $('title').text();
            const cleanTitle = title.replace(/\|.*/, '').trim();
            const parts = cleanTitle.split(' ');
            vehicleData.make = parts[0] || 'Unknown';
            vehicleData.model = parts.slice(1).join(' ') || 'Unknown';
        }

        // Location Fallback (HTML Selectors)
        if (vehicleData.location === 'Germany') {
            const locationSelectors = [
                '[data-testid="seller-address"]',
                '.seller-address',
                '.sc-grid-col-12.seller-info',
                '#seller-address'
            ];

            for (const selector of locationSelectors) {
                const text = $(selector).text().trim();
                if (text) {
                    const parts = text.split(',');
                    if (parts.length > 0) {
                        const cityMatch = text.match(/\d{4,5}\s+([a-zA-Z\u00C0-\u00FF\s-]+)/);
                        if (cityMatch) {
                            vehicleData.location = cityMatch[1].trim();
                        } else {
                            vehicleData.location = parts[parts.length - 1].trim();
                        }
                    }
                    break;
                }
            }
        }

        if (!vehicleData.imageUrl) {
            const ogImage = $('meta[property="og:image"]').attr('content');
            if (!isInvalidImage(ogImage)) {
                vehicleData.imageUrl = ogImage;
            }
        }

        // STRATEGY 3: Text-Based & Specific Fallbacks
        if (vehicleData.price === 0) {
            const pageTitle = $('title').text();
            const priceMatch = pageTitle.match(/(\d{1,3}(?:[.,]\d{3})*)\s*€/);
            if (priceMatch) {
                const rawPrice = priceMatch[1].replace(/[.,]/g, '');
                vehicleData.price = parseInt(rawPrice);
            }
        }

        // --- IMPROVED YEAR EXTRACTION (DOM-BASED) ---
        if (vehicleData.year === 0 || !vehicleData.firstRegistration) {
            const dateKeywords = [
                'EZ', 'Erstzulassung', 'First Registration', '1. Reg',
                'Matriculación', 'Année', 'Year', 'Mise en circulation',
                'Fecha de matriculación', 'Inverkehrssetzung', 'Registrazione',
                'Primer registro', 'Primera matriculación'
            ];

            // 1. Search in specific data attributes first (High Precision)
            const specificSelectors = [
                '[data-testid="first-registration"]',
                '[data-testid="vehicle-details-first-registration"]',
                '.vehicle-data__item--first-registration',
                '#firstRegistration'
            ];

            for (const selector of specificSelectors) {
                const text = $(selector).text().trim();
                const match = text.match(/(\d{2})[\/.-](\d{4})/);
                if (match) {
                    vehicleData.firstRegistration = match[0];
                    vehicleData.year = parseInt(match[2]);
                    break;
                }
            }

            // 2. DOM Traversal for Keywords (Medium Precision)
            if (!vehicleData.firstRegistration) {
                // Find elements containing keywords
                $('*').each((i, elem) => {
                    // Skip script/style tags
                    if (elem.tagName === 'script' || elem.tagName === 'style') return;

                    // Check direct text of this element (not children)
                    const ownText = $(elem).clone().children().remove().end().text().trim();

                    for (const keyword of dateKeywords) {
                        if (ownText.includes(keyword)) {
                            // Case A: Date is in the SAME element text (e.g. "First Registration: 07/1996")
                            let match = ownText.match(/(\d{2})[\/.-](\d{4})/);
                            if (match) {
                                vehicleData.firstRegistration = match[0];
                                vehicleData.year = parseInt(match[2]);
                                return false; // Break loop
                            }

                            // Case B: Date is in the NEXT sibling element (common in grids)
                            const nextText = $(elem).next().text().trim();
                            match = nextText.match(/(\d{2})[\/.-](\d{4})/);
                            if (match) {
                                vehicleData.firstRegistration = match[0];
                                vehicleData.year = parseInt(match[2]);
                                return false;
                            }

                            // Case C: Date is in the PARENT's text (if label is a span inside a div)
                            const parentText = $(elem).parent().text().trim();
                            match = parentText.match(/(\d{2})[\/.-](\d{4})/);
                            if (match) {
                                vehicleData.firstRegistration = match[0];
                                vehicleData.year = parseInt(match[2]);
                                return false;
                            }
                        }
                    }
                });
            }

            // 3. Brute Force Regex on Body (Low Precision Fallback)
            if (!vehicleData.firstRegistration) {
                // Look for MM/YYYY pattern surrounded by word boundaries
                const dateMatches = bodyText.matchAll(/\b(0[1-9]|1[0-2])[\/.-](19|20)\d{2}\b/g);
                for (const match of dateMatches) {
                    // Just take the first valid-looking date found in the text
                    // This is risky but better than 0 for "Matriculación"
                    vehicleData.firstRegistration = match[0];
                    const yearPart = match[0].match(/(19|20)\d{2}/);
                    if (yearPart) vehicleData.year = parseInt(yearPart[0]);
                    break;
                }
            }
        }

        // Strategy 5: Data Attributes & Common Classes
        if (vehicleData.year === 0) {
            const specificSelectors = [
                '[data-testid="first-registration"]',
                '[data-testid="vehicle-details-first-registration"]',
                '.vehicle-data__item--first-registration',
                '#firstRegistration',
                '.sc-grid-col-12:contains("First Registration")',
                '.sc-grid-col-12:contains("Erstzulassung")'
            ];

            for (const selector of specificSelectors) {
                const text = $(selector).text();
                if (text) {
                    const match = text.match(/(19|20)\d{2}/);
                    if (match) {
                        vehicleData.year = parseInt(match[0]);
                        break;
                    }
                }
            }
        }

        // Strategy 6: Proximity Search (Find keywords and look for year nearby)
        if (vehicleData.year === 0) {
            const keywords = ['Erstzulassung', 'First Registration', 'Matriculación', 'Année', 'EZ'];
            for (const keyword of keywords) {
                const index = bodyText.indexOf(keyword);
                if (index !== -1) {
                    // Look at the next 50 chars
                    const snippet = bodyText.substring(index, index + 50);
                    const match = snippet.match(/(19|20)\d{2}/);
                    if (match) {
                        vehicleData.year = parseInt(match[0]);
                        break;
                    }
                }
            }
        }

        // Fallback: Search in H1
        if (vehicleData.year === 0) {
            const h1Text = $('h1').text();
            const h1YearMatch = h1Text.match(/(19|20)\d{2}/);
            if (h1YearMatch) {
                vehicleData.year = parseInt(h1YearMatch[0]);
            }
        }

        // Fallback: Search for any MM/YYYY date pattern in the first 3000 chars of body
        if (vehicleData.year === 0) {
            const shortBody = bodyText.substring(0, 3000);
            const datePatternMatch = shortBody.match(/(?:0[1-9]|1[0-2])[\/.-](19|20)\d{2}/);
            if (datePatternMatch) {
                const yearPart = datePatternMatch[0].match(/(19|20)\d{2}/);
                if (yearPart) vehicleData.year = parseInt(yearPart[0]);
            }
        }

        if (vehicleData.mileage === 0) {
            const mileageMatch = bodyText.match(/(\d{1,3}(?:[.,]\d{3})*)\s*km/i);
            if (mileageMatch) {
                const rawMileage = mileageMatch[1].replace(/[.,]/g, '');
                vehicleData.mileage = parseInt(rawMileage);
            }
        }

        if (vehicleData.power === 0) {
            const powerMatch = bodyText.match(/(\d+)\s*kW/i);
            if (powerMatch) vehicleData.power = Math.round(parseInt(powerMatch[1]) * 1.36);
        }

        if (url.includes('mobile.de') || url.includes('autoscout24')) {
            const co2Match = bodyText.match(/(\d{2,3})\s*g\/km/i);
            if (co2Match && vehicleData.co2 === 0) vehicleData.co2 = parseInt(co2Match[1]);

            if (!vehicleData.fuelType) {
                if (bodyText.match(/Benzin|Gasoline|Petrol/i)) vehicleData.fuelType = 'Gasolina';
                else if (bodyText.match(/Diesel/i)) vehicleData.fuelType = 'Diesel';
                else if (bodyText.match(/Hybrid/i)) vehicleData.fuelType = 'Híbrido';
                else if (bodyText.match(/Elektro|Electric/i)) vehicleData.fuelType = 'Eléctrico';
            }

            if (vehicleData.transmission === 'Unknown') {
                if (bodyText.match(/Automatic|Automatik|Automático/i)) vehicleData.transmission = 'Automático';
                else if (bodyText.match(/Manual|Schaltgetriebe|Manuelle/i)) vehicleData.transmission = 'Manual';
            }
        }

        // STRATEGY 4: AGGRESSIVE IMAGE SEARCH (PRIORITY)
        const gallerySelectors = [
            '#gallery-img-0', // Mobile.de specific ID for first image
            '.gallery-image',
            '.image-gallery-image',
            'img[data-testid="main-image"]',
            '.cldt-gallery-img',
            '.gallery-component img',
            '.slick-slide img',
            '.image-gallery-slide img',
            'img[class*="gallery"]' // Broad selector last
        ];

        let galleryImages = new Set();

        // 1. Try to find specific gallery containers first
        const $galleryContainer = $('.gallery-component, .cldt-gallery-data, #gallery-component, .image-gallery');
        if ($galleryContainer.length > 0) {
            $galleryContainer.find('img').each((i, elem) => {
                const src = $(elem).attr('src') || $(elem).attr('data-src') || $(elem).attr('data-lazy');
                if (src && src.startsWith('http') && !isInvalidImage(src) && !isExcluded($(elem))) {
                    galleryImages.add(src);
                }
            });
        }

        // 2. Fallback to individual selectors if container didn't yield results
        if (galleryImages.size === 0) {
            for (const selector of gallerySelectors) {
                $(selector).each((i, elem) => {
                    const $elem = $(elem);
                    const src = $elem.attr('src') || $elem.attr('data-src');
                    if (src && src.startsWith('http') && !isInvalidImage(src) && !isExcluded($elem)) {
                        galleryImages.add(src);
                    }
                });
            }
        }

        // 3. Last resort: Main content images (Restricted Scope)
        if (galleryImages.size === 0) {
            const mainContentSelectors = [
                '.cldt-detail-view',
                '#ad-view',
                'article',
                '.main-content',
                '[data-testid="content-page"]'
            ];

            let $searchContext = $('body');
            for (const selector of mainContentSelectors) {
                if ($(selector).length > 0) {
                    $searchContext = $(selector).first();
                    break;
                }
            }

            $searchContext.find('img').each((i, elem) => {
                const $elem = $(elem);
                const src = $elem.attr('src');
                const alt = $elem.attr('alt') || '';

                if (isExcluded($elem)) return;

                if (src && src.startsWith('http')) {
                    if (isInvalidImage(src)) return;
                    if (src.includes('vehicle') || src.includes('img') || alt.toLowerCase().includes(vehicleData.make.toLowerCase())) {
                        galleryImages.add(src);
                    }
                }
            });
        }

        vehicleData.images = Array.from(galleryImages);
        // Set the main image to the first one found, or keep existing if valid
        if (vehicleData.images.length > 0) {
            vehicleData.imageUrl = vehicleData.images[0];
        }

        // FINAL STEP: CO2 Estimation & Cleanup
        if (!vehicleData.co2 || vehicleData.co2 === 0) {
            vehicleData.co2 = estimateCO2(vehicleData.fuelType, vehicleData.year);
            vehicleData.isEstimatedCO2 = true;
        }

        const currentYear = new Date().getFullYear();
        if (vehicleData.year < 1900 || vehicleData.year > currentYear + 1) {
            const titleYearMatch = $('title').text().match(/(19|20)\d{2}/);
            if (titleYearMatch) {
                vehicleData.year = parseInt(titleYearMatch[0]);
            } else {
                vehicleData.year = 0; // Default to 0 if not found
            }
        }

        if (vehicleData.fuelType.match(/Gasoline|Benzin|Petrol/i)) vehicleData.fuelType = 'Gasolina';
        if (vehicleData.fuelType.match(/Diesel/i)) vehicleData.fuelType = 'Diesel';
        if (vehicleData.fuelType.match(/Hybrid/i)) vehicleData.fuelType = 'Híbrido';
        if (vehicleData.fuelType.match(/Electric|Elektro/i)) vehicleData.fuelType = 'Eléctrico';

        // Clean up Transmission
        if (vehicleData.transmission) {
            if (vehicleData.transmission.match(/Automatic|Automatik/i)) vehicleData.transmission = 'Automático';
            else if (vehicleData.transmission.match(/Manual|Schaltgetriebe/i)) vehicleData.transmission = 'Manual';
        }

        const cleanString = (str) => {
            if (!str) return '';
            return str
                .replace(/para\s+[\d\.,]+\s*€/i, '')
                .replace(/for\s+[\d\.,]+\s*€/i, '')
                .replace(/-\s*[\d\.,]+\s*€/i, '')
                .replace(/\s*€.*/, '')
                .trim();
        };

        vehicleData.make = cleanString(vehicleData.make);
        vehicleData.model = cleanString(vehicleData.model);

        if (vehicleData.model.toLowerCase().startsWith(vehicleData.make.toLowerCase())) {
            vehicleData.model = vehicleData.model.substring(vehicleData.make.length).trim();
        }

        if (vehicleData.make === 'Unknown') vehicleData.make = 'Vehículo';
        if (vehicleData.model === 'Unknown') vehicleData.model = 'Detectado';

        res.json(vehicleData);

    } catch (error) {
        console.error("Scraping error:", error.message);
        res.json({
            make: 'Error',
            model: 'Could not load',
            price: 0,
            year: 2024,
            mileage: 0,
            co2: 0,
            location: 'Unknown',
            country: 'Germany',
            accident: false,
            financing: false,
            currency: 'EUR',
            imageUrl: '',
            error: true
        });
    }
});

module.exports = router;
