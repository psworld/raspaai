import React from 'react';
import SEO from '../../seo';
import gql from 'graphql-tag';
import { useQuery } from 'react-apollo';
import ProductGridSkeleton from '../../skeletons/ProductGridSkeleton';
import ErrorPage from '../../core/ErrorPage';
import PaginationWithState from '../../templates/PaginationWithState';

import DashboardBrandProductGrid from '../../templates/dashboard/DashboardBrandProductGrid';
import SearchBar from '../../templates/dashboard/SearchBar';
import { Typography } from '@material-ui/core';

const PRODUCTS = gql`
  query($phrase: String, $endCursor: String, $withBrand: Boolean!) {
    products(first: 20, phrase: $phrase, after: $endCursor) {
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      edges {
        node {
          id
          title
          mrp
          thumb
          brand @include(if: $withBrand) {
            id
            publicUsername
            title
          }
        }
      }
    }
  }
`;

const ProductGrid = ({ phrase, publicShopUsername }) => {
  const { loading, error, data, fetchMore } = useQuery(PRODUCTS, {
    variables: {
      phrase,
      withBrand: true
    }
  });

  if (loading) return <ProductGridSkeleton></ProductGridSkeleton>;
  if (error) return <ErrorPage></ErrorPage>;

  if (data) {
    if (data.products.pageInfo.startCursor) {
      const { edges: products, pageInfo } = data.products;
      return (
        <>
          <DashboardBrandProductGrid
            publicShopUsername={publicShopUsername}
            products={products}
            addShopProduct={true}
            isBrand={false}></DashboardBrandProductGrid>
          <br></br>
          <PaginationWithState
            pageInfo={pageInfo}
            fetchMore={fetchMore}></PaginationWithState>
          <br></br>
          {phrase && (
            <>
              <Typography variant='h6' algin='center'>
                Could not find <b>{phrase}</b> ?
              </Typography>
              <Typography align='center'>
                <a
                  href={`${process.env.GATSBY_WHATSAPP_RASPAAI_URL}text=Add brand product *${phrase}* to raspaai%0aOther information about product:-%0a`}
                  target='_blank'
                  rel='noopener noreferrer'>
                  Click here to send a request to add <b>{phrase}</b> to
                  raspaai.
                </a>
              </Typography>
            </>
          )}
        </>
      );
    }
    if (phrase) {
      return (
        <>
          <Typography align='center' style={{ margin: 4 }} variant='h5'>
            No results found for - <b>{phrase}</b>
          </Typography>
          <br></br>
          <Typography style={{ marginTop: 25 }} align='center'>
            <a
              href={`${process.env.GATSBY_WHATSAPP_RASPAAI_URL}text=Add brand product *${phrase}* to raspaai%0aOther information about product:-%0a`}
              target='_blank'
              rel='noopener noreferrer'>
              Click here to send a request to add <b>{phrase}</b> to raspaai.
            </a>
          </Typography>
        </>
      );
    }
    return (
      <Typography variant='h5' style={{ marginTop: 20 }} align='center'>
        Sorry, no products available at the moment
      </Typography>
    );
  }
};

const AddNewProduct = ({ phrase, shopUsername }) => {
  const [searchPhrase, setSearchPhrase] = React.useState('');

  return (
    <>
      <SEO title='Dashboard Add Products'></SEO>
      <h1>Add new products to your shop.</h1>
      <SearchBar
        searchPhrase={searchPhrase}
        setSearchPhrase={setSearchPhrase}
        publicUsername={shopUsername}
        isAddNewShopProductSearch={true}></SearchBar>
      <ProductGrid
        phrase={phrase}
        publicShopUsername={shopUsername}></ProductGrid>
    </>
  );
};

export default AddNewProduct;
