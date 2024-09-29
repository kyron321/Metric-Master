"use client";

import { gql, useQuery } from "@apollo/client";

export const HelloWorld = () => {
  const { data } = useQuery(gql`
    query {
      websites {
        WebsiteDomain
        WebsiteID
        PagespeedInsights {
          Accessibility
          BestPractices
          Performance
          SEO
        }
      }
    }
  `);
  return <div>{JSON.stringify(data)}</div>;
};
