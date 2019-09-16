import ApolloClient from "apollo-boost"
import { fetch } from "isomorphic-fetch"

const client = new ApolloClient({
  uri: "http://localhost:8000/graphql",
  credentials: "include",
  fetch,
})

export default client
