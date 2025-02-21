require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');
const cheerio = require('cheerio');

const app = express();
const port = process.env.PORT || 3000;

// Security middleware
app.use(helmet());
app.use(express.json());

// Rate limiting (100 requests per 15 minutes)
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100
});
app.use(limiter);

// Validation middleware for POST requests
const validateRequest = [
    body('html').isString().notEmpty().withMessage('HTML content is required')
];

// Text extraction endpoint
app.post('/extract-text', validateRequest, (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const $ = cheerio.load(req.body.html);
        const bodyText = $('body').text().replace(/\s+/g, ' ').trim();
        res.send(bodyText);
    } catch (error) {
        console.error('Error processing HTML:', error);
        res.status(500).send('Error processing HTML');
    }
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.send('OK');
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
