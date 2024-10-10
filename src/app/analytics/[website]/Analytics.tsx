"use client";

import { gql, useQuery } from "@apollo/client";
import { useSession } from "next-auth/react";
import React from "react";
import CircleProgress from '@/components/CircleProgress';

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

  const { data, loading, error } = useQuery(GET_WEBSITE, {
    variables: { userId, website },
    skip: !userId || !website, // Skip the query if userId or website is not available
  });

  if (status === "loading" || loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const websiteData = data?.website;

  return (
    <div className="p-8 bg-gray-900 text-white min-h-screen">
      <h1 className="text-3xl font-bold">{websiteData.website}</h1>
      <div className="mt-4">
        {websiteData ? (
          <div className="flex space-x-4 mt-1">
          <CircleProgress
            score={websiteData.pagespeedInsightsMobile.performance.slice(-1)[0]}
            label="Performance"
          />
          <CircleProgress
            score={websiteData.pagespeedInsightsMobile.accessibility.slice(-1)[0]}
            label="Accessibility"
          />
          <CircleProgress
            score={websiteData.pagespeedInsightsMobile.bestPractices.slice(-1)[0]}
            label="Best Practices"
          />
          <CircleProgress
            score={websiteData.pagespeedInsightsMobile.seo.slice(-1)[0]}
            label="SEO"
          />
        </div>
        ) : (
          <p>No website found.</p>
        )}
      </div>
    </div>
  );
};

export default Analytics;
