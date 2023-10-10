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

  const chartStyle = {
    backgroundColor: "white",
    padding: "10px",
    borderRadius: "8px",
  };

  const xAxisLabels = [12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1]; // Custom x-axis labels

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
              data: websiteData?.performance || [],
            },
            {
              curve: "linear",
              label: "Accessibility",
              data: websiteData?.accessibility || [],
            },
            {
              curve: "linear",
              label: "Best Practices",
              data: websiteData?.bestPractices || [],
            },
            {
              curve: "linear",
              label: "SEO",
              data: websiteData?.seo || [],
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
