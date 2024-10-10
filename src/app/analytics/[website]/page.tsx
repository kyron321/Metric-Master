"use client";

import { gql, useQuery } from "@apollo/client";
import { useSession } from "next-auth/react";
import React from "react";

const GET_WEBSITES = gql`
  query GetWebsites($userId: String!) {
    websites(userId: $userId) {
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

interface Website {
  website: string;
  userId: string;
  pagespeedInsights: {
    accessibility: number;
    bestPractices: number;
    performance: number;
    seo: number;
  };
}

const Analytics = () => {
  const { data: session, status } = useSession();
  const userId = session?.uid;

  const { data, loading, error } = useQuery(GET_WEBSITES, {
    variables: { userId },
    skip: !userId, // Skip the query if userId is not available
  });

  if (status === "loading" || loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const websites = data?.websites || [];

  return (
    <div className="p-8 bg-gray-900 text-white min-h-screen">
      <h1 className="text-3xl font-bold">Analytics</h1>
      <div className="mt-4">
        {websites.length > 0 ? (
          websites.map((website: Website) => (
            <div key={website.website} className="mb-4 p-4 bg-gray-800 rounded">
              <h2 className="text-xl font-semibold">{website.website}</h2>
              <p>Performance: {website.pagespeedInsights.performance}</p>
              <p>Accessibility: {website.pagespeedInsights.accessibility}</p>
              <p>Best Practices: {website.pagespeedInsights.bestPractices}</p>
              <p>SEO: {website.pagespeedInsights.seo}</p>
            </div>
          ))
        ) : (
          <p>No websites found.</p>
        )}
      </div>
    </div>
  );
};

export default Analytics;