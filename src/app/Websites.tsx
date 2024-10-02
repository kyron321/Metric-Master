"use client";

import { gql, useQuery } from "@apollo/client";
import { Session } from "next-auth"; 

interface WebsitesProps {
  session: Session;
}

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

export const Websites = ({ session }: WebsitesProps) => {
  const userId = session?.uid;

  const { data, loading, error } = useQuery(GET_WEBSITES, {
    variables: { userId },
    skip: !userId, // Skip the query if userId is not available
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      {data?.websites?.map((d: any) => (
        <div key={d.website} className="flex">
          <img
            src={`https://www.google.com/s2/favicons?domain=${d.website}&sz=50`}
            alt={`Favicon for ${d.website}`}
          />{" "}
          - {d.website} - {d.pagespeedInsights.accessibility} -{" "}
          {d.pagespeedInsights.bestPractices} - {d.pagespeedInsights.performance} -{" "}
          {d.pagespeedInsights.seo}
        </div>
      ))}
    </div>
  );
};