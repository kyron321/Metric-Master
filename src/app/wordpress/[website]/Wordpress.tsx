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

  // Sort plugins by those needing an update first
  const sortedPlugins = wordpressData
    ? [...wordpressData].sort((a, b) => (a.needs_update ? -1 : 1))
    : [];

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
            {sortedPlugins.map((plugin: any) => (
              <div
                key={plugin.plugin}
                className={`p-6 rounded-lg ${plugin.status === "inactive" ? "bg-gray-700" : "bg-gray-700"}`}
              >
                <div className="flex flex-row space-x-4 mb-4">
                  <h2 className="text-xl font-semibold text-left w-full max-w-fit">{plugin.name}</h2>
                  <div className="flex flex-row justify-between w-full">
                    <h2 className="text-xl text-gray-300 text-left" dangerouslySetInnerHTML={{ __html: plugin.description.rendered }}></h2>
                    <div className="flex justify-center items-center space-x-4">
                      {plugin.needs_update && (
                        <button className="bg-mm-grey hover:bg-mm-grey-dark transition-colors text-mm-white px-4 py-2 rounded">
                          Update Plugin
                        </button>
                      )}
                      <button className="bg-mm-red hover:bg-mm-red-dark text-mm-white px-4 py-2 rounded transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" className="w-6 h-6 fill-mm-white">
                          <path d="M135.2 17.7L128 32 32 32C14.3 32 0 46.3 0 64S14.3 96 32 96l384 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-96 0-7.2-14.3C307.4 6.8 296.3 0 284.2 0L163.8 0c-12.1 0-23.2 6.8-28.6 17.7zM416 128L32 128 53.2 467c1.6 25.3 22.6 45 47.9 45l245.8 0c25.3 0 46.3-19.7 47.9-45L416 128z"></path>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
                <div className={`space-x-4 flex flex-row justify-between ${plugin.needs_update ? "text-red-500" : "text-green-500"}`}>
                  <span className={`text-sm capitalize ${plugin.status === "inactive" ? "text-red-500" : "text-green-500"}`}>
                    Status: {plugin.status}
                  </span>
                  <div className="space-x-4">
                    <span className="text-sm">
                      Current Version: {plugin.version}
                    </span>
                    {plugin.needs_update ? (
                      <span className="text-sm">
                        Update Available: {typeof plugin.needs_update === "string" ? plugin.needs_update : "Yes"}
                      </span>
                    ) : (
                      <span className="text-sm">Up to Date</span>
                    )}
                  </div>
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