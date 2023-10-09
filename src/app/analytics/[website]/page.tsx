"use client";

import { gql, useQuery, useMutation } from "@apollo/client";
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

const Analytics = () => {
  const { data: session, status } = useSession();
  const userId = session?.uid;

  const { data, loading, error, refetch } = useQuery(GET_WEBSITES, {
    variables: { userId },
    skip: !userId, // Skip the query if userId is not available
  });

  console.log("data", data); 

  return (
    <div className="p-8 bg-gray-900 text-white min-h-screen">
      <h1 className="text-3xl font-bold">Analytics</h1>
      <p>Analytics page content</p>
      <p>User: {session?.user?.email}</p>
    </div>
  );
};

export default Analytics;