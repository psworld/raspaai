import React from 'react';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import ErrorPage from '../core/ErrorPage';

import gql from 'graphql-tag';
import { useQuery } from 'react-apollo';

import ProductGridSkeleton from '../skeletons/ProductGridSkeleton';
import ShopProductGrid from '../templates/ShopProductGrid';
import CombosGrid from '../templates/CombosGrid';
import PaginationWithState from '../templates/PaginationWithState';

const COMBOS_SEARCH = gql`
  query(
    $lat: Float!
    $lng: Float!
    $phrase: String!
    $rangeInKm: Int
    $endCursor: String
  ) {
    comboSearch(
      lat: $lat
      lng: $lng
      phrase: $phrase
      rangeInKm: $rangeInKm
      first: 10
      after: $endCursor
    ) {
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      edges {
        node {
          id
          name
          offeredPrice
          isAvailable
          thumbs
          shop {
            id
            properties {
              title
              publicUsername
            }
          }
        }
      }
    }
  }
`;

const SHOP_PRODUCT_SEARCH = gql`
  query(
    $lat: Float!
    $lng: Float!
    $phrase: String!
    $rangeInKm: Int
    $endCursor: String
  ) {
    productSearch(
      lat: $lat
      lng: $lng
      phrase: $phrase
      rangeInKm: $rangeInKm
      first: 10
      after: $endCursor
    ) {
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
          isAvailable
        }
      }
    }
  }
`;

const ComboSearchResult = ({ lat, lng, phrase }) => {
  const { loading, error, data, fetchMore } = useQuery(COMBOS_SEARCH, {
    variables: { lat, lng, phrase }
  });

  if (loading)
    return (
      <>
        <Typography align='center' style={{ margin: 6 }} variant='h5'>
          Searching combos...
        </Typography>
        <ProductGridSkeleton numberOfProducts={4}></ProductGridSkeleton>
      </>
    );
  if (error) return <ErrorPage></ErrorPage>;

  if (data && data.comboSearch && data.comboSearch.pageInfo.startCursor) {
    const { pageInfo, edges: comboNodeEdges } = data.comboSearch;
    return (
      <>
        <Typography style={{ margin: 6 }} variant='h5'>
          Search results for <b>{phrase}</b> combos
        </Typography>

        <Grid container>
          <CombosGrid comboNodeEdges={comboNodeEdges}></CombosGrid>
        </Grid>

        <PaginationWithState
          pageInfo={pageInfo}
          fetchMore={fetchMore}></PaginationWithState>
      </>
    );
  }

  return <></>;
};

const ShopProductSearchResult = ({ lat, lng, phrase }) => {
  const { loading, error, data, fetchMore } = useQuery(SHOP_PRODUCT_SEARCH, {
    variables: { phrase, lat, lng, rangeInKm: 5 }
  });

  if (loading)
    return (
      <>
        <Typography align='center' style={{ margin: 6 }} variant='h5'>
          Searching ...
        </Typography>
        <ProductGridSkeleton></ProductGridSkeleton>
      </>
    );
  if (error) return <ErrorPage></ErrorPage>;
  if (data && data.productSearch && data.productSearch.pageInfo.startCursor) {
    const { pageInfo, edges: nearbyShopProducts } = data.productSearch;
    return (
      <>
        <Typography style={{ margin: 6 }} variant='h5'>
          Search results for <b>{phrase}</b>
        </Typography>

        <Grid container>
          <ShopProductGrid shopProducts={nearbyShopProducts}></ShopProductGrid>
        </Grid>

        <PaginationWithState
          pageInfo={pageInfo}
          fetchMore={fetchMore}></PaginationWithState>
      </>
    );
  }

  return (
    <div>
      <Typography align='center' style={{ margin: 4 }} variant='h5'>
        No results found for - <b>{phrase}</b>
      </Typography>
      <br></br>
      <Typography style={{ marginTop: 25 }} align='center'>
        <a
          href={`${process.env.GATSBY_WHATSAPP_RASPAAI_URL}text=Add *${phrase}* to raspaai%0aOther information about product:-%0a`}
          target='_blank'
          rel='noopener noreferrer'>
          Click here to send a request to add <b>{phrase}</b> to raspaai.
        </a>
      </Typography>
    </div>
  );
};

const SearchResultPage = props => {
  const { phrase, savedLocation } = props;

  const { lat, lng } = savedLocation;

  return (
    <>
      <ComboSearchResult
        lat={lat}
        lng={lng}
        phrase={phrase}></ComboSearchResult>
      <ShopProductSearchResult
        lat={lat}
        lng={lng}
        phrase={phrase}></ShopProductSearchResult>
    </>
  );
};

export default SearchResultPage;
