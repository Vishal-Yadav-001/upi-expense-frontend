"use client";

import { ApolloProvider } from "@apollo/client/react";
import { client } from "@/lib/apollo-client";
import { ReactNode } from "react";

export const ApolloWrapper = ({ children }: { children: ReactNode }) => {
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};
