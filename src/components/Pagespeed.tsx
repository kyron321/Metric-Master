"use client";

import { useState } from "react";
import { gql, useMutation } from "@apollo/client";
import { Session } from "next-auth";

const UPDATE_PAGESPEED = gql`
  mutation UpdatePageSpeed(
    $website: String!
    $userId: String!
    $fullUrl: String!
    $accessibility: [Float!]!
    $bestPractices: [Float!]!
    $performance: [Float!]!
    $seo: [Float!]!
  ) {
    updatePageSpeed(
      website: $website
      userId: $userId
      fullUrl: $fullUrl
      accessibility: $accessibility
      bestPractices: $bestPractices
      performance: $performance
      seo: $seo
    ) {
      website
      userId
      fullUrl
      pagespeedInsightsMobile {
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
  const [url, setUrl] = useState("");
  const [wordpress, setWordpress] = useState("");
  const [data, setData] = useState<{
    performance: number;
    accessibility: number;
    seo: number;
    bestPractices: number;
  } | null>(null);
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
    
    let wordpress = wordpress;

    const websiteName = fullUrl
      .replace(/^(?:https?:\/\/)?(?:www\.)?([^\/]+).*$/, "$1")
      .split(".")[0];

    try {
      const response = await fetch(
        `/api/pagespeed?url=${encodeURIComponent(fullUrl)}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const result = await response.json();
      setData(result.scores);

      await updatePageSpeed({
        variables: {
          website: websiteName,
          userId,
          fullUrl,
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
    <div className="text-mm-white">
      <input
        type="text"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="Enter website URL (example.com)"
        className="w-full p-2 mb-4 bg-gray-700 text-mm-white rounded"
      />
      <input
        type="text"
        value={wordpress}
        onChange={(e) => setWordpress(e.target.value)}
        placeholder="Enter Wordpress Application Password"
        className="w-full p-2 mb-4 bg-gray-700 text-mm-white rounded"
      />
      <button
        onClick={handleFetchData}
        disabled={loading || !userId}
        className="bg-secondary hover:bg-secondary-dark text-mm-white font-bold py-2 px-4 rounded w-full"
      >
        {loading ? "Loading..." : "Add Website"}
      </button>
      {error && <p className="text-red-500 mt-4">{error}</p>}
      {data && (
        <div className="mt-4">
          <h2 className="text-xl font-bold mb-2">Your website has been successfully added!</h2>
        </div>
      )}
    </div>
  );
};

export default PageSpeed;
