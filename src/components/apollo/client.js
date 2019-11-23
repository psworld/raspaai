import ApolloClient from "apollo-boost"
import { fetch } from "isomorphic-fetch"

const client = new ApolloClient({
  uri: "http://raspaai-env.xyjg76auqq.ap-south-1.elasticbeanstalk.com/graphql",
  credentials: "include",
  fetch,
})

export default client
