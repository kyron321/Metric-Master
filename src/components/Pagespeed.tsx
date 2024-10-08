"use client";

import { useState } from "react";
import { gql, useMutation } from "@apollo/client";
import { Session } from "next-auth"; // Assuming you're using NextAuth

// GraphQL Mutation to update the PageSpeed data in DynamoDB
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
  const userId = session?.uid; // Get userId from session
  const [url, setUrl] = useState('');
  const [data, setData] = useState<{ performance: number; accessibility: number; seo: number; bestPractices: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Use the Apollo useMutation hook for the GraphQL mutation
  const [updatePageSpeed] = useMutation(UPDATE_PAGESPEED);

  const handleFetchData = async () => {
    setLoading(true);
    setError(null);

    let fullUrl = url;
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      fullUrl = `https://${url}`;
    }

    try {
      // Fetch PageSpeed data from the API
      const response = await fetch(`/api/pagespeed?url=${encodeURIComponent(fullUrl)}`);
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const result = await response.json();
      setData(result.scores);

      // Call the GraphQL mutation to update the PageSpeed data in DynamoDB
      await updatePageSpeed({
        variables: {
          website: fullUrl,
          userId, // The userId from the session
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