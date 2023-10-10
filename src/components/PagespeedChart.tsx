"use client";

import * as React from "react";
import { LineChart } from "@mui/x-charts/LineChart";
import { gql, useQuery } from "@apollo/client";
import { useSession } from "next-auth/react";

interface PagespeedChartProps {
  website: string;
}

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

const PagespeedChart: React.FC<PagespeedChartProps> = ({ website }) => {
  const { data: session, status } = useSession();
  const userId = session?.uid;

  const { data, loading, error } = useQuery(GET_WEBSITE, {
    variables: { userId, website },
    skip: !userId || !website, // Skip the query if userId or website is not available
  });

  if (status === "loading" || loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const websiteData = data?.website?.pagespeedInsightsMobile;

  // Generate dynamic x-axis labels based on the length of performance data
  let entriesCount = websiteData?.performance?.length || 0;

  // Adjust the labels and handle the case where we duplicate the first entry
  const xAxisLabels = Array.from({ length: entriesCount + 1 }, (_, i) => entriesCount - i + 1); // Creates [2, 1] or [n, n-1, ..., 2, 1]

  // Duplicate the first data point to mimic its value as the second one
  const duplicateData = (data: number[]) => {
    if (data.length > 0) {
      return [data[0], ...data]; // Add the first entry again at the start
    }
    return [];
  };

  const chartStyle = {
    backgroundColor: "white",
    padding: "10px",
    borderRadius: "8px",
  };

  return (
    <div style={{ color: "white" }}>
      <h2>Pagespeed Insights Over Time</h2>
      <div style={chartStyle}>
        <LineChart
          width={1200}
          height={600}
          series={[
            {
              curve: "linear",
              label: "Performance",
              data: duplicateData(websiteData?.performance || []),
            },
            {
              curve: "linear",
              label: "Accessibility",
              data: duplicateData(websiteData?.accessibility || []),
            },
            {
              curve: "linear",
              label: "Best Practices",
              data: duplicateData(websiteData?.bestPractices || []),
            },
            {
              curve: "linear",
              label: "SEO",
              data: duplicateData(websiteData?.seo || []),
            },
          ]}
          xAxis={[{ scaleType: "point", data: xAxisLabels }]}
          grid={{ vertical: true, horizontal: true }}
        />
      </div>
    </div>
  );
};

export default PagespeedChart;
