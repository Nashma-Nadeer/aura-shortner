const express = require('express');
const cors = require('cors');
const { nanoid } = require('nanoid');

const app = express();
app.use(cors());
app.use(express.json());

// In-memory "database" for simplicity
const urlDatabase = {};

// Root route
app.get('/', (req, res) => {
    res.send('Aura Shortner API is running! ✨');
});

// Shorten URL endpoint
app.post('/shorten', (req, res) => {
    const { longUrl } = req.body;
    
    if (!longUrl) {
        return res.status(400).json({ error: 'Long URL is required' });
    }

    // Generate a short ID (e.g., "x7y2z1")
    const shortId = nanoid(6);
    urlDatabase[shortId] = longUrl;

    console.log(`Shortened: ${longUrl} -> ${shortId}`);

    res.json({
        shortUrl: `http://localhost:5000/${shortId}`,
        shortId: shortId
    });
});

// Redirection endpoint
app.get('/:shortId', (req, res) => {
    const { shortId } = req.params;
    const longUrl = urlDatabase[shortId];

    if (longUrl) {
        console.log(`Redirecting: ${shortId} -> ${longUrl}`);
        res.redirect(longUrl);
    } else {
        res.status(404).send('<h1>Aura Link Not Found 🌌</h1>');
    }
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Aura Server running on http://localhost:${PORT}`);
});
