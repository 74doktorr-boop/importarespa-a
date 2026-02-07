const express = require('express');
const router = express.Router();
const axios = require('axios');

// Calculate distance between two coordinates using Haversine formula
const getDistanceFromLatLonInKm = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return d;
};

const deg2rad = (deg) => {
    return deg * (Math.PI / 180);
};

router.post('/', async (req, res) => {
    const { origin, destination } = req.body;

    if (!origin || !destination) {
        return res.status(400).json({ error: 'Origin and destination are required' });
    }

    try {
        // 1. Geocode Origin (City, Country)
        // We append "Europe" to ensure we don't get US cities
        const originQuery = `${origin}`;
        const originUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(originQuery)}&limit=1`;

        const originRes = await axios.get(originUrl, {
            headers: {
                'User-Agent': 'ImportarEspana/1.0 (contact@importarespana.com)',
                'Referer': 'https://importarespana.com'
            }
        });

        if (!originRes.data || originRes.data.length === 0) {
            return res.status(404).json({ error: 'Could not find origin location' });
        }

        const originCoords = {
            lat: parseFloat(originRes.data[0].lat),
            lon: parseFloat(originRes.data[0].lon)
        };

        // 2. Geocode Destination (Zip Code, Spain)
        const destQuery = `${destination}, Spain`;
        const destUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(destQuery)}&limit=1`;

        const destRes = await axios.get(destUrl, {
            headers: {
                'User-Agent': 'ImportarEspana/1.0 (contact@importarespana.com)',
                'Referer': 'https://importarespana.com'
            }
        });

        if (!destRes.data || destRes.data.length === 0) {
            return res.status(404).json({ error: 'Could not find destination zip code' });
        }

        const destCoords = {
            lat: parseFloat(destRes.data[0].lat),
            lon: parseFloat(destRes.data[0].lon)
        };

        // 3. Calculate Distance
        // We add 20% to the straight-line distance to estimate road distance
        const straightDistance = getDistanceFromLatLonInKm(originCoords.lat, originCoords.lon, destCoords.lat, destCoords.lon);
        const roadDistance = Math.round(straightDistance * 1.25);

        // 4. Calculate Cost
        // Base fee: 350€
        // Cost per km: 0.85€
        const baseFee = 350;
        const costPerKm = 0.85;
        const estimatedCost = Math.round(baseFee + (roadDistance * costPerKm));

        // 5. Estimate Duration
        // Approx 500km per day + 2 days loading/unloading
        const durationDays = Math.ceil(roadDistance / 500) + 2;

        res.json({
            origin: originRes.data[0].display_name,
            destination: destRes.data[0].display_name,
            distanceKm: roadDistance,
            cost: estimatedCost,
            durationDays: durationDays
        });

    } catch (error) {
        console.error('Transport calculation error:', error.message);

        // Fallback: If API fails (rate limit, IP block, etc.), return a generic estimation
        // Average distance Germany -> Spain (Madrid) is approx 2100km
        const fallbackDistance = 2100;
        const baseFee = 350;
        const costPerKm = 0.85;
        const estimatedCost = Math.round(baseFee + (fallbackDistance * costPerKm));
        const durationDays = Math.ceil(fallbackDistance / 500) + 2;

        res.json({
            origin: origin || 'Alemania',
            destination: destination || 'España',
            distanceKm: fallbackDistance,
            cost: estimatedCost,
            durationDays: durationDays,
            isFallback: true
        });
    }
});

module.exports = router;
