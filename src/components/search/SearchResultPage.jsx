import React from 'react';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import ErrorPage from '../core/ErrorPage';
import { navigate } from 'gatsby';

import gql from 'graphql-tag';
import { useQuery } from 'react-apollo';

import ProductGridSkeleton from '../skeletons/ProductGridSkeleton';
import ShopProductGrid from '../templates/ShopProductGrid';

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

const SearchResultPage = props => {
  const { phrase, pageNo, endCursor, savedLocation } = props;

  const { lat, lng } = savedLocation;

  const { loading, error, data } = useQuery(SHOP_PRODUCT_SEARCH, {
    variables: { phrase, endCursor, lat, lng, rangeInKm: 5 }
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
    const {
      pageInfo: { hasNextPage, endCursor },
      edges: nearbyShopProducts
    } = data.productSearch;
    return (
      <>
        <Typography style={{ margin: 6 }} variant='h5'>
          Search results for <b>{phrase}</b>
        </Typography>

        <Grid container>
          <ShopProductGrid shopProducts={nearbyShopProducts}></ShopProductGrid>
        </Grid>

        <Button
          disabled={!hasNextPage}
          variant='contained'
          color='secondary'
          title={hasNextPage ? 'See next page' : 'No more results.'}
          onClick={() =>
            navigate(
              `/search/${phrase}/pg/${parseInt(pageNo) +
                1}/@/${lat}/${lng}/${endCursor}`
            )
          }>
          Next
        </Button>
        <Button
          variant='contained'
          color='secondary'
          disabled={pageNo === '1'}
          onClick={() => window.history.back(-1)}>
          Back
        </Button>
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

export default SearchResultPage;
