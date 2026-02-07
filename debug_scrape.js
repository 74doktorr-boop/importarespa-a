const axios = require('axios');
const cheerio = require('cheerio');

const url = process.argv[2] || 'https://suchen.mobile.de/fahrzeuge/details.html?id=410149021'; // Default to one of the search results if not provided

async function debugScrape() {
    console.log(`Analyzing URL: ${url}`);
    try {
        const headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
            'Accept-Language': 'de-DE,de;q=0.9,en-US;q=0.8,en;q=0.7'
        };

        const response = await axios.get(url, { headers });
        const html = response.data;
        const $ = cheerio.load(html);

        console.log('\n--- JSON-LD Data ---');
        $('script[type="application/ld+json"]').each((i, elem) => {
            try {
                const data = JSON.parse($(elem).html());
                if (data['@type'] === 'Product' || data['@type'] === 'Car' || data['@type'] === 'Vehicle') {
                    console.log('Found Vehicle JSON-LD');
                    if (data.image) console.log('JSON-LD Image:', data.image);
                }
            } catch (e) { }
        });

        console.log('\n--- OpenGraph Data ---');
        console.log('og:image:', $('meta[property="og:image"]').attr('content'));

        console.log('\n--- Gallery Selectors Check ---');
        const gallerySelectors = [
            '#gallery-img-0',
            '.gallery-image',
            '.image-gallery-image',
            'img[data-testid="main-image"]',
            '.cldt-gallery-img',
            '.gallery-component img',
            '.slick-slide img',
            '.image-gallery-slide img',
            'img[class*="gallery"]'
        ];

        gallerySelectors.forEach(selector => {
            const count = $(selector).length;
            console.log(`${selector}: found ${count} elements`);
            if (count > 0) {
                console.log(`   First src: ${$(selector).first().attr('src')}`);
            }
        });

        console.log('\n--- All Images (First 10) ---');
        $('img').each((i, elem) => {
            if (i >= 10) return;
            const src = $(elem).attr('src');
            const alt = $(elem).attr('alt');
            const classes = $(elem).attr('class');
            const parentClasses = $(elem).parent().attr('class');
            const grandParentClasses = $(elem).parent().parent().attr('class');

            console.log(`[${i}] Src: ${src}`);
            console.log(`    Alt: ${alt}`);
            console.log(`    Class: ${classes}`);
            console.log(`    Parent Class: ${parentClasses}`);
            console.log(`    Grandparent Class: ${grandParentClasses}`);

            // Test exclusion logic
            const isExcluded = $(elem).closest('.seller-info, .dealer-info, .contact-box, .seller-box, .vip-seller, .vip-header, .dealer-header, .seller-branding, [data-testid="seller-branding"], .image-gallery-background').length > 0;
            console.log(`    Is Excluded? ${isExcluded}`);
            console.log('---');
        });

    } catch (error) {
        console.error('Error:', error.message);
    }
}

debugScrape();
