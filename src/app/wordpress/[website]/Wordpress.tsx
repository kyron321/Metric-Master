"use client";

import { gql, useQuery } from "@apollo/client";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
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
      wordpress {
        wordpressUrl
        wordpressUser
        wordpressPass
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
  wordpress: {
    wordpressUrl: string;
    wordpressUser: string;
    wordpressPass: string;
  };
}

interface AnalyticsProps {
  website: string;
}

const Wordpress: React.FC<AnalyticsProps> = ({ website }) => {
  const { data: session, status } = useSession();
  const userId = session?.uid;
  const [wordpressData, setWordpressData] = useState<any>(null);

  const { data, loading, error } = useQuery(GET_WEBSITE, {
    variables: { userId, website },
    skip: !userId || !website, // Skip the query if userId or website is not available
  });

  useEffect(() => {
    if (data?.website?.wordpress) {
      const fetchWordPressData = async () => {
        const { wordpressUrl, wordpressUser, wordpressPass } = data.website.wordpress;
        try {
          const response = await fetch(
            `/api/wordpress?url=${encodeURIComponent(wordpressUrl)}&wpUser=${encodeURIComponent(wordpressUser)}&wpPass=${encodeURIComponent(wordpressPass)}`
          );
          if (!response.ok) {
            throw new Error("Failed to fetch WordPress data");
          }
          const result = await response.json();
          setWordpressData(result);
        } catch (err) {
          console.error("Error fetching WordPress data:", err);
        }
      };

      fetchWordPressData();
    }
  }, [data]);

  if (error) return <p>Error: {error.message}</p>;

  const websiteData = data?.website;
  console.log(websiteData);

  const totalPlugins = wordpressData ? wordpressData.length : 0;
  const activePlugins = wordpressData ? wordpressData.filter((plugin: any) => plugin.status === "active").length : 0;
  const pluginsNeedingUpdate = wordpressData
    ? wordpressData.filter((plugin: any) => typeof plugin.needs_update === "string").length
    : 0;

  return (
    <div className="p-8 bg-gray-900 text-mm-white flex flex-col text-center pt-28">
      {wordpressData ? (
        <>
          <h1 className="text-3xl font-bold mb-8">WordPress Plugins</h1>
          <div className="mb-6">
            <p>Total Plugins: {totalPlugins}</p>
            <p>Active Plugins: {activePlugins}</p>
            <p>Plugins Needing Update: {pluginsNeedingUpdate}</p>
          </div>
          <div className="space-y-6">
            {wordpressData.map((plugin: any) => (
              <div key={plugin.plugin} className="bg-gray-800 p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-2">{plugin.name}</h2>
                <p className="text-gray-300 mb-4" dangerouslySetInnerHTML={{ __html: plugin.description.rendered }}></p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">Status: {plugin.status}</span>
                  <span className="text-sm text-gray-400">Version: {plugin.version}</span>
                  {plugin.needs_update && (
                    <span className="text-sm text-red-400">
                      Update Available: {typeof plugin.needs_update === "string" ? plugin.needs_update : "Yes"}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <Loader />
      )}
    </div>
  );
};

export default Wordpress;