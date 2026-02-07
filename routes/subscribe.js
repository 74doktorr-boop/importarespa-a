const express = require('express');
const router = express.Router();
const axios = require('axios');

router.post('/', async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ error: 'Email is required' });
    }

    const apiKey = process.env.BREVO_API_KEY;
    const listId = parseInt(process.env.BREVO_LIST_ID) || 2; // Default to list 2 if not specified

    if (!apiKey) {
        console.error('BREVO_API_KEY is missing');
        return res.status(500).json({ error: 'Server configuration error' });
    }

    try {
        const response = await axios.post(
            'https://api.brevo.com/v3/contacts',
            {
                email: email,
                listIds: [listId],
                updateEnabled: true // Update if exists
            },
            {
                headers: {
                    'api-key': apiKey,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            }
        );

        console.log('Brevo response:', response.data);
        res.json({ success: true, message: 'Subscribed successfully' });

    } catch (error) {
        console.error('Brevo Error:', error.response?.data || error.message);

        // Handle "Contact already exists" gracefully if updateEnabled didn't catch it
        if (error.response?.data?.code === 'duplicate_parameter') {
            return res.json({ success: true, message: 'Already subscribed' });
        }

        res.status(500).json({ error: 'Failed to subscribe' });
    }
});

module.exports = router;
