import ApolloClient from 'apollo-boost';
import { fetch } from 'isomorphic-fetch';

const client = new ApolloClient({
  uri: process.env.GATSBY_APOLLO_CLIENT_URI,
  request: operation => {
    const sessionToken = sessionStorage.getItem('token');
    const localToken = localStorage.getItem('token');

    const token = sessionToken ? sessionToken : localToken;
    operation.setContext({
      headers: {
        authorization: token ? `JWT ${token}` : ''
      }
    });
  },
  credentials: 'include',
  fetch
});

export default client;
