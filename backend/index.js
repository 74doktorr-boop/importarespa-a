require('dotenv').config();
const express = require('express');
const cors = require('cors');
const parseRoutes = require('./routes/parse');
const transportRoutes = require('./routes/transport');
const contactRoutes = require('./routes/contact');
const leadsRoutes = require('./routes/leads');
const subscribeRoutes = require('./routes/subscribe');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/parse', parseRoutes);
app.use('/api/transport', transportRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/submit-lead', leadsRoutes);
app.use('/api/subscribe', subscribeRoutes);

// Health check
app.get('/', (req, res) => {
    res.send('Vehicle Analyzer Backend is running');
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
