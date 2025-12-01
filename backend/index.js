const express = require('express');
const cors = require('cors');
const parseRoute = require('./routes/parse');
const transportRoute = require('./routes/transport');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://importarespaña.com',
    'https://www.importarespaña.com',
    'https://vehicle-analyzer-frontend.vercel.app' // Fallback for Vercel preview
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
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
