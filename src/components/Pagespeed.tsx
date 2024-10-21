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
    $wordpressUrl: String!
    $wordpressUser: String!
    $wordpressPass: String!
  ) {
    updatePageSpeed(
      website: $website
      userId: $userId
      fullUrl: $fullUrl
      accessibility: $accessibility
      bestPractices: $bestPractices
      performance: $performance
      seo: $seo
      wordpressUrl: $wordpressUrl
      wordpressUser: $wordpressUser
      wordpressPass: $wordpressPass
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
      wordpress {
        wordpressUrl
        wordpressUser
        wordpressPass
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
  const [wpurl, setWpUrl] = useState("");
  const [wpPass, setWpPass] = useState("");
  const [wpUser, setWpUser] = useState("");
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
          wordpressUrl: wpurl,
          wordpressUser: wpUser,
          wordpressPass: wpPass,
        },
      });

      const wordpressResponse = await fetch(
        `/api/wordpress?url=${encodeURIComponent(wpurl)}&wpUser=${encodeURIComponent(wpUser)}&wpPass=${encodeURIComponent(wpPass)}`
      );
      if (!wordpressResponse.ok) {
        throw new Error("Failed to fetch WordPress data");
      }

      const wordpressData = await wordpressResponse.json();
      console.log("WordPress API response:", wordpressData);
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
        value={wpurl}
        onChange={(e) => setWpUrl(e.target.value)}
        placeholder="Enter wordpress URL (example.com)"
        className="w-full p-2 mb-4 bg-gray-700 text-mm-white rounded"
      />
      <input
        type="text"
        value={wpUser}
        onChange={(e) => setWpUser(e.target.value)}
        placeholder="Enter wordpress application username"
        className="w-full p-2 mb-4 bg-gray-700 text-mm-white rounded"
      />
      <input
        type="text"
        value={wpPass}
        onChange={(e) => setWpPass(e.target.value)}
        placeholder="Enter wordpress application password"
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
          <h2 className="text-xl font-bold mb-2 text-center">Your website has been successfully added!</h2>
        </div>
      )}
    </div>
  );
};

export default PageSpeed;