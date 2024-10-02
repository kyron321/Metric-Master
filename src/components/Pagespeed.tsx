import { useState } from 'react';

const PageSpeed = () => {
  const [url, setUrl] = useState('');
  const [data, setData] = useState<{ performance: number; accessibility: number; seo: number; bestPractices: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFetchData = async () => {
    setLoading(true);
    setError(null);

    let fullUrl = url;
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      fullUrl = `https://${url}`;
    }

    try {
      const response = await fetch(`/api/pagespeed?url=${encodeURIComponent(fullUrl)}`);
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const result = await response.json();
      setData(result.scores);
    } catch (err) {
      setError('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>PageSpeed Insights</h1>
      <input
        type="text"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="Enter URL"
      />
      <button onClick={handleFetchData} disabled={loading}>
        {loading ? 'Loading...' : 'Fetch Data'}
      </button>
      {error && <p>{error}</p>}
      {data && (
        <div>
          <h2>Scores for {url}</h2>
          <p>Performance: {data.performance}</p>
          <p>Accessibility: {data.accessibility}</p>
          <p>SEO: {data.seo}</p>
          <p>Best Practices: {data.bestPractices}</p>
        </div>
      )}
    </div>
  );
};

export default PageSpeed;
