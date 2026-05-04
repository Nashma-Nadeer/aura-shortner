const express = require('express');
const cors = require('cors');
const { nanoid } = require('nanoid');

const app = express();
app.use(cors());
app.use(express.json());

// In-memory "database" with advanced metadata
const urlDatabase = {};

app.get('/', (req, res) => {
    res.send('Aura Shortner Pro API is running! 💎');
});

// Shorten URL endpoint with Pro Features
app.post('/shorten', (req, res) => {
    const { longUrl, customAlias, theme, ghostMode } = req.body;
    
    if (!longUrl) {
        return res.status(400).json({ error: 'Long URL is required' });
    }

    let shortId;
    
    // Custom Alias logic
    if (customAlias) {
        if (urlDatabase[customAlias]) {
            return res.status(400).json({ error: 'Alias already taken! Try another one.' });
        }
        shortId = customAlias;
    } else {
        shortId = nanoid(6);
    }

    // Expiration logic (Ghost Mode)
    let expiresAt = null;
    if (ghostMode) {
        expiresAt = Date.now() + (24 * 60 * 60 * 1000); // 24 hours from now
    }

    urlDatabase[shortId] = {
        longUrl,
        clicks: 0,
        theme: theme || 'purple',
        expiresAt,
        createdAt: Date.now()
    };

    console.log(`[PRO] Shortened: ${longUrl} -> ${shortId} (Theme: ${theme || 'purple'})`);

    res.json({
        shortUrl: `http://localhost:5000/${shortId}`,
        shortId: shortId,
        theme: theme || 'purple'
    });
});

// Stats endpoint
app.get('/stats/:shortId', (req, res) => {
    const { shortId } = req.params;
    const data = urlDatabase[shortId];

    if (data) {
        res.json({
            clicks: data.clicks,
            theme: data.theme,
            isGhost: !!data.expiresAt,
            expiresAt: data.expiresAt
        });
    } else {
        res.status(404).json({ error: 'Not found' });
    }
});

// Redirection endpoint with click tracking and expiration check
app.get('/:shortId', (req, res) => {
    const { shortId } = req.params;
    const data = urlDatabase[shortId];

    if (data) {
        // Check expiration
        if (data.expiresAt && Date.now() > data.expiresAt) {
            delete urlDatabase[shortId]; // Cleanup
            return res.status(410).send('<h1>Link Expired 👻</h1><p>This ghost link has vanished.</p>');
        }

        data.clicks++; // Track click
        console.log(`[TRACK] ${shortId} clicked! Total: ${data.clicks}`);
        res.redirect(data.longUrl);
    } else {
        res.status(404).send('<h1>Aura Link Not Found 🌌</h1>');
    }
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Aura Pro Server running on http://localhost:${PORT}`);
});
