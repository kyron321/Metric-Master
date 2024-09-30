"use client";

import { gql, useQuery } from "@apollo/client";

export const HelloWebsites = () => {
  const { data } = useQuery(gql`
    query {
      websites {
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
  `);
  return (
    <div>
      {data?.websites?.map((d: any) => {
        return (
          <div className="flex">
            <img
              src={`https://www.google.com/s2/favicons?domain=${d.website}&sz=50`}
            />{" "}
            - {d.website}- {d.userId}- {d.pagespeedInsights.accessibility}-{" "}
            {d.pagespeedInsights.bestPractices}-{" "}
            {d.pagespeedInsights.performance}- {d.pagespeedInsights.seo}
          </div>
        );
      })}
    </div>
  );
};
