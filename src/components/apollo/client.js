import ApolloClient from 'apollo-boost';
import { fetch } from 'isomorphic-fetch';

const client = new ApolloClient({
  // uri: 'https://raspaai-env.peyxbuq9rs.ap-south-1.elasticbeanstalk.com/graphql/',
  uri: 'http://localhost:8000/graphql/',
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
