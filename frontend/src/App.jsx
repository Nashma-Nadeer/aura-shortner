import { useState } from 'react';

function App() {
  const [longUrl, setLongUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleShorten = async (e) => {
    e.preventDefault();
    if (!longUrl) return;

    setLoading(true);
    setCopied(false);

    try {
      const response = await fetch('http://localhost:5000/shorten', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ longUrl }),
      });

      const data = await response.json();
      if (data.shortUrl) {
        setShortUrl(data.shortUrl);
      }
    } catch (error) {
      console.error('Error shortening URL:', error);
      alert('Aura Server is offline! Make sure to run the backend.');
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
        <div className="aura-blob blue"></div>
        <div className="aura-blob pink"></div>
      </div>

      <div className="glass-card">
        <h1>Aura Shortner</h1>
        <p>Elevate your links with pure aura ✨</p>

        <form onSubmit={handleShorten}>
          <div className="input-group">
            <input
              type="url"
              placeholder="Paste your long link here..."
              value={longUrl}
              onChange={(e) => setLongUrl(e.target.value)}
              required
            />
          </div>
          <button type="submit" disabled={loading}>
            {loading ? 'Manifesting...' : 'Get Aura Link'}
          </button>
        </form>

        {shortUrl && (
          <div className="result-area">
            <p>Your short link is ready:</p>
            <div className="short-link-box">
              <a href={shortUrl} target="_blank" rel="noreferrer">
                {shortUrl}
              </a>
              <button className="copy-btn" onClick={copyToClipboard}>
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default App;
