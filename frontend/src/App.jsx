import { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';

function App() {
  const [longUrl, setLongUrl] = useState('');
  const [customAlias, setCustomAlias] = useState('');
  const [selectedTheme, setSelectedTheme] = useState('purple');
  const [ghostMode, setGhostMode] = useState(false);
  
  const [shortUrl, setShortUrl] = useState('');
  const [clicks, setClicks] = useState(0);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // Sync theme with body class for background animations
  useEffect(() => {
    document.body.className = `theme-${selectedTheme}`;
  }, [selectedTheme]);

  const handleShorten = async (e) => {
    e.preventDefault();
    if (!longUrl) return;

    setLoading(true);
    setCopied(false);

    try {
      const response = await fetch('http://localhost:5000/shorten', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          longUrl, 
          customAlias: customAlias.trim(), 
          theme: selectedTheme,
          ghostMode 
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setShortUrl(data.shortUrl);
        setClicks(0); // Reset clicks for new link
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Aura Server is offline!');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <div className="aura-container">
        <div className="aura-blob"></div>
        <div className="aura-blob secondary"></div>
      </div>

      <div className="glass-card">
        <h1>Aura Shortner</h1>
        <p>Elevate your links with pure aura ✨</p>

        {/* Theme Picker */}
        <div className="theme-picker">
          {['purple', 'blue', 'pink', 'emerald'].map((t) => (
            <div 
              key={t}
              className={`theme-dot active ${t === selectedTheme ? 'active' : ''}`}
              style={{ backgroundColor: `var(--aura-${t})` }}
              onClick={() => setSelectedTheme(t)}
            />
          ))}
        </div>

        <form onSubmit={handleShorten}>
          <div className="input-group" style={{ marginBottom: '12px' }}>
            <input
              className="input-field"
              type="url"
              placeholder="Paste your long link here..."
              value={longUrl}
              onChange={(e) => setLongUrl(e.target.value)}
              required
            />
          </div>

          <div className="options-grid">
            <input
              className="input-field"
              type="text"
              placeholder="Custom Alias (Optional)"
              value={customAlias}
              onChange={(e) => setCustomAlias(e.target.value)}
            />
            <label className="ghost-toggle">
              <input 
                type="checkbox" 
                checked={ghostMode} 
                onChange={(e) => setGhostMode(e.target.checked)} 
              />
              Ghost Mode 👻
            </label>
          </div>

          <button className="main-btn" type="submit" disabled={loading}>
            {loading ? 'Manifesting...' : 'Get Aura Link'}
          </button>
        </form>

        {shortUrl && (
          <div className="result-area">
            <div className="qr-container">
              <QRCodeSVG value={shortUrl} size={120} />
            </div>
            
            <div className="short-link-box">
              <a href={shortUrl} target="_blank" rel="noreferrer">{shortUrl}</a>
              <button className="copy-btn" onClick={copyToClipboard}>
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>

            <div className="stats-badge">
              {ghostMode ? 'Vanishes in 24h' : 'Permanent Link'}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default App;
