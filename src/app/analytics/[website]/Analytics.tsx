"use client";

import { gql, useQuery } from "@apollo/client";
import { useSession } from "next-auth/react";
import React from "react";
import CircleProgress from "@/components/CircleProgress";
import PagespeedChart from "@/components/PagespeedChart"; // Adjust the import path as necessary
import Loader from "@/components/Loader";

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

  if (status === "loading" || loading) return <><Loader/></>;
  if (error) return <p>Error: {error.message}</p>;

  const websiteData = data?.website;

  return (
    <div className="p-8 bg-gray-900 text-mm-white flex flex-col text-center pt-28">
      <h1 className="text-3xl font-bold text-mm-white pb-4">{websiteData.website}</h1>
      <div className="mt-4">
        {websiteData ? (
          <div className="flex flex-col align-center">
            <div className="flex flex-row mx-auto pb-8">
              <CircleProgress
                score={
                  websiteData.pagespeedInsightsMobile.performance.slice(-1)[0]
                }
                label="Performance"
              />
              <CircleProgress
                score={
                  websiteData.pagespeedInsightsMobile.accessibility.slice(-1)[0]
                }
                label="Accessibility"
              />
              <CircleProgress
                score={
                  websiteData.pagespeedInsightsMobile.bestPractices.slice(-1)[0]
                }
                label="Best Practices"
              />
              <CircleProgress
                score={websiteData.pagespeedInsightsMobile.seo.slice(-1)[0]}
                label="SEO"
              />
            </div>
            <PagespeedChart website={website} />
          </div>
        ) : (
          <p>No website found.</p>
        )}
      </div>
    </div>
  );
};

export default Analytics;
