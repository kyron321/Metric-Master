"use client";

import { useState } from "react";
import { gql, useMutation } from "@apollo/client";
import { Session } from "next-auth";

const UPDATE_PAGESPEED = gql`
  mutation UpdatePageSpeed(
    $website: String!
    $userId: String!
    $accessibility: Float!
    $bestPractices: Float!
    $performance: Float!
    $seo: Float!
  ) {
    updatePageSpeed(
      website: $website
      userId: $userId
      accessibility: $accessibility
      bestPractices: $bestPractices
      performance: $performance
      seo: $seo
    ) {
      website
      userId
      pagespeedInsights {
        accessibility
        bestPractices
        performance
        seo
      }
    }
  }
`;

interface WebsitesProps {
  session: Session;
}

const PageSpeed = ({ session }: WebsitesProps) => {
  const userId = session?.uid; 
  const [url, setUrl] = useState('');
  const [data, setData] = useState<{ performance: number; accessibility: number; seo: number; bestPractices: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [updatePageSpeed] = useMutation(UPDATE_PAGESPEED);

  const handleFetchData = async () => {
    setLoading(true);
    setError(null);

    let fullUrl = url;
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      fullUrl = `https://${url}`;
    }

    const websiteName = fullUrl.replace(/^(?:https?:\/\/)?(?:www\.)?([^\/]+).*$/, '$1').split('.')[0];

    try {
      const response = await fetch(`/api/pagespeed?url=${encodeURIComponent(fullUrl)}`);
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const result = await response.json();
      setData(result.scores);

      await updatePageSpeed({
        variables: {
          website: websiteName,
          userId,
          accessibility: result.scores.accessibility,
          bestPractices: result.scores.bestPractices,
          performance: result.scores.performance,
          seo: result.scores.seo,
        },
      });
    } catch (err) {
      setError("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="text-white">
      <input
        type="text"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="Enter URL"
        className="w-full p-2 mb-4 bg-gray-700 text-white rounded"
      />
      <button
        onClick={handleFetchData}
        disabled={loading || !userId}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full"
      >
        {loading ? "Loading..." : "Add Website"}
      </button>
      {error && <p className="text-red-500 mt-4">{error}</p>}
      {data && (
        <div className="mt-4">
          <h2 className="text-xl font-bold mb-2">Scores for {url}</h2>
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