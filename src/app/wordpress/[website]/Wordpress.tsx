"use client";

import { gql, useQuery } from "@apollo/client";
import { useSession } from "next-auth/react";
import React from "react";
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

const Wordpress: React.FC<AnalyticsProps> = ({ website }) => {
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
        <h1>Wordpress</h1>
        
    </div>
  );
};

export default Wordpress;
