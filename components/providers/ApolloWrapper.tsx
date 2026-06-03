"use client";

import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";
import { ApolloProvider } from "@apollo/client/react";
import { setContext } from "@apollo/client/link/context";
import { useAuth } from "@clerk/nextjs";
import { ReactNode, useMemo } from "react";

export const ApolloWrapper = ({ children }: { children: ReactNode }) => {
  const { getToken, userId } = useAuth();

  const client = useMemo(() => {
    const httpLink = createHttpLink({
      uri: `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}/graphql`,
    });

    const authLink = setContext(async (_, { headers }) => {
      try {
        const token = await getToken();
        return {
          headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : "",
          }
        };
      } catch (err) {
        return {
          headers: {
            ...headers,
          }
        };
      }
    });

    return new ApolloClient({
      link: authLink.concat(httpLink),
      cache: new InMemoryCache(),
    });
  }, [getToken, userId]);

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};
