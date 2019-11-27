import ApolloClient from "apollo-boost"
import { fetch } from "isomorphic-fetch"

const client = new ApolloClient({
 uri: "http://raspaai-env.peyxbuq9rs.ap-south-1.elasticbeanstalk.com/graphql/",
// uri: "http://localhost:8000/graphql",
  credentials: "include",
  fetch,
})

export default client
