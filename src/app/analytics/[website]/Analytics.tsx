"use client";

import { gql, useQuery } from "@apollo/client";
import { useSession } from "next-auth/react";
import React from "react";

const GET_WEBSITE = gql`
  query GetWebsite($userId: String!, $website: String!) {
    website(userId: $userId, website: $website) {
      website
      userId
      pagespeedInsightsMobile {
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
  pagespeedInsightsMobile: {
    accessibility: number;
    bestPractices: number;
    performance: number;
    seo: number;
  };
}

interface AnalyticsProps {
  website: string;
}

const Analytics: React.FC<AnalyticsProps> = ({ website }) => {
  const { data: session, status } = useSession();
  const userId = session?.uid;

  // Debugging: Check userId and website
  console.log("userId:", userId);
  console.log("website:", website);

  const { data, loading, error } = useQuery(GET_WEBSITE, {
    variables: { userId, website },
    skip: !userId || !website, // Skip the query if userId or website is not available
  });

  // Debugging: Check loading, error, and data
  console.log("loading:", loading);
  console.log("error:", error);
  console.log("data:", data);

  if (status === "loading" || loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const websiteData = data?.website;

  return (
    <div className="p-8 bg-gray-900 text-white min-h-screen">
      <h1 className="text-3xl font-bold">Analytics</h1>
      <div className="mt-4">
        {websiteData ? (
          <div className="mb-4 p-4 bg-gray-800 rounded">
            <h2 className="text-xl font-semibold">{websiteData.website}</h2>
            <p>Performance: {websiteData.pagespeedInsightsMobile.performance}</p>
            <p>Accessibility: {websiteData.pagespeedInsightsMobile.accessibility}</p>
            <p>Best Practices: {websiteData.pagespeedInsightsMobile.bestPractices}</p>
            <p>SEO: {websiteData.pagespeedInsightsMobile.seo}</p>
          </div>
        ) : (
          <p>No website found.</p>
        )}
      </div>
    </div>
  );
};

export default Analytics;