const express = require('express');
const cors = require('cors');
const parseRoute = require('./routes/parse');
const transportRoute = require('./routes/transport');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
    origin: '*', // Allow all origins for now to avoid CORS issues
    credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/parse', parseRoute);
app.use('/api/transport', transportRoute);

// Health check
app.get('/', (req, res) => {
    res.send('Vehicle Analyzer Backend is running');
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
