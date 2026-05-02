import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { getSessionId } from "./session";

const httpLink = createHttpLink({
  uri: `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}/graphql`,
});

const authLink = setContext((_, { headers }) => ({
  headers: {
    ...headers,
    "X-Session-ID": getSessionId(),
  }
}));

export const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});
