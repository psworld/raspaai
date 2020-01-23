import gql from 'graphql-tag';
import React from 'react';
import { useQuery } from 'react-apollo';
import ErrorPage from '../core/ErrorPage';
import HomePageSkeleton from '../skeletons/HomePageSkeleton';
import HomePage from './HomePage';

const NEARBY_COMBOS_AND_SHOP_PRODUCTS = gql`
  query($lat: Float!, $lng: Float!) {
    nearbyShopProducts(lat: $lat, lng: $lng, first: 10) {
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      edges {
        node {
          id
          shop {
            id
            properties {
              title
              publicUsername
            }
          }
          product {
            id
            title
            thumb
            mrp
            description
          }
          offeredPrice
          inStock
        }
      }
    }
    nearbyCombos(lat: $lat, lng: $lng, first: 10) {
      edges {
        node {
          id
          name
          shop {
            id
            properties {
              title
              publicUsername
            }
          }
          thumbs
          offeredPrice
        }
      }
    }
  }
`;

const Home = props => {
  const { location } = props;
  const { loading, error, data } = useQuery(NEARBY_COMBOS_AND_SHOP_PRODUCTS, {
    variables: { lat: location.lat, lng: location.lng }
  });
  if (loading) return <HomePageSkeleton></HomePageSkeleton>;
  if (error) return <ErrorPage></ErrorPage>;
  if (data) {
    return (
      <HomePage
        location={location}
        shopProductNodeEdges={data.nearbyShopProducts.edges}
        comboNodeEdges={data.nearbyCombos.edges}></HomePage>
    );
  }
};

export default Home;
