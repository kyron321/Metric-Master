"use client";

import { gql, useQuery } from "@apollo/client";

export const HelloWorld = () => {
  const { data } = useQuery(gql`
    query {
      hello
    }
  `);
  return <div>{data?.hello}</div>;
};
