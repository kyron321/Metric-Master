"use client";

import { apolloClient } from "@/libs/apolloClient";
import { ApolloProvider } from "@apollo/client";
import { PropsWithChildren } from "react";

export const ParentProvider: React.FC<PropsWithChildren> = ({ children }) => {
  return <ApolloProvider client={apolloClient}>{children}</ApolloProvider>;
};
