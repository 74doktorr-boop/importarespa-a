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
            if (src.match(/icon|logo|pixel|tracker|avatar|banner|profile|dealer|haendler|autohaus/i)) return true;
            if (src.endsWith('.svg')) return true;
            return false;
        };

        // ... (JSON-LD and OG strategies remain) ...

        // STRATEGY 4: AGGRESSIVE IMAGE SEARCH
        if (!vehicleData.imageUrl || vehicleData.imageUrl.includes('placeholder')) {
            const gallerySelectors = [
                '.gallery-image',
                '.image-gallery-image',
                'img[data-testid="main-image"]',
                'img[class*="gallery"]',
                '.cldt-gallery-img',
                '#gallery-img-0',
                '.gallery-component img'
            ];

            for (const selector of gallerySelectors) {
                const src = $(selector).first().attr('src');
                if (src && src.startsWith('http') && !isInvalidImage(src)) {
                    vehicleData.imageUrl = src;
                    break;
                }
            }

            if (!vehicleData.imageUrl) {
                $('img').each((i, elem) => {
                    const $elem = $(elem);
                    const src = $elem.attr('src');
                    const alt = $elem.attr('alt') || '';

                    // Skip images inside seller/dealer info containers
                    if ($elem.closest('.seller-info, .dealer-info, .contact-box, .seller-box').length > 0) return;

                    if (src && src.startsWith('http')) {
                        if (isInvalidImage(src)) return;
                        if (src.includes('vehicle') || src.includes('img') || alt.toLowerCase().includes(vehicleData.make.toLowerCase())) {
                            if (!vehicleData.imageUrl) vehicleData.imageUrl = src;
                        }
                    }
                });
            }
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
