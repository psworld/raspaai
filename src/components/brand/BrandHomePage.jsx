import React from 'react';

import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';

import gql from 'graphql-tag';
import { useQuery } from 'react-apollo';
import ErrorPage from '../core/ErrorPage';
import SEO from '../seo';

import ProductGridSkeleton from '../skeletons/ProductGridSkeleton';

import TitleAndSearchToolbar from '../templates/TitleAndSearchToolbar';
import MainFeaturedPost from '../templates/MainFeaturedPost';
import PaginationWithState from '../templates/PaginationWithState';
import BrandProductGrid from '../templates/BrandProductGrid';
import BrandShopHomeSkeleton from '../skeletons/BrandShopHomeSkeleton';
import { Button } from '@material-ui/core';
import Link from '../core/Link';
import { navigate } from 'gatsby';

export const BRAND_PRODUCTS = gql`
  query(
    $publicBrandUsername: String!
    $phrase: String
    $endCursor: String
    $withBrand: Boolean!
  ) {
    brandProducts(
      publicBrandUsername: $publicBrandUsername
      phrase: $phrase
      first: 20
      after: $endCursor
    )
      @connection(
        key: "brandProducts"
        filter: ["publicBrandUsername", "phrase"]
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
          title
          mrp
          thumb
          thumbOverlayText
          description
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

export const ProductGrid = props => {
  const { phrase, publicBrandUsername, isBrandDashboardProduct } = props;

  const { loading, error, data, fetchMore } = useQuery(BRAND_PRODUCTS, {
    variables: {
      publicBrandUsername,
      phrase,
      withBrand: false
    }
  });
  if (loading) return <ProductGridSkeleton></ProductGridSkeleton>;
  if (error) return <ErrorPage></ErrorPage>;

  if (data && data.brandProducts.pageInfo.startCursor) {
    const { edges: brandProducts, pageInfo } = data.brandProducts;

    return (
      <>
        <Grid container>
          <BrandProductGrid
            publicBrandUsername={publicBrandUsername}
            brandProducts={brandProducts}
            isBrandDashboardProduct={
              isBrandDashboardProduct
            }></BrandProductGrid>
        </Grid>
        <br></br>
        <PaginationWithState
          pageInfo={pageInfo}
          fetchMore={fetchMore}></PaginationWithState>
      </>
    );
  }
  if (phrase) {
    return (
      <Typography style={{ margin: 8 }} variant='h5'>
        We could not find any result for <b>{phrase}</b>
      </Typography>
    );
  }
  return (
    <>
      <Typography variant='h4' align='center'>
        No products here
      </Typography>
      <br></br>
      {isBrandDashboardProduct && (
        <Button
          component={Link}
          variant='contained'
          to={`/dashboard/brand/${publicBrandUsername}/products/add`}>
          Add products
        </Button>
      )}
    </>
  );
};

const BRAND = gql`
  query($publicBrandUsername: String!) {
    brand(publicBrandUsername: $publicBrandUsername) {
      id
      publicUsername
      title
      heroImage
    }
  }
`;

const BrandHomePage = props => {
  const { brandUsername: publicBrandUsername, phrase } = props;

  const [searchPhrase, setSearchPhrase] = React.useState(phrase ? phrase : '');
  const { loading, error, data } = useQuery(BRAND, {
    variables: { publicBrandUsername }
  });

  const handleClearSearch = () => {
    setSearchPhrase('');
    navigate(`/brand/${publicBrandUsername}`);
  };

  if (loading) return <BrandShopHomeSkeleton></BrandShopHomeSkeleton>;

  if (error) return <ErrorPage></ErrorPage>;

  if (data && data.brand) {
    const {
      brand: { title, heroImage }
    } = data;

    return (
      <>
        <SEO title={title}></SEO>
        <MainFeaturedPost
          img={heroImage}
          title={title}
          alt={title}></MainFeaturedPost>
        <TitleAndSearchToolbar
          title={title}
          searchPhrase={searchPhrase}
          publicUsername={publicBrandUsername}
          setSearchPhrase={setSearchPhrase}
          handleClearSearch={handleClearSearch}
          isBrand={true}></TitleAndSearchToolbar>
        <Box overflow='hidden' px={0}>
          <ProductGrid
            phrase={phrase}
            publicBrandUsername={publicBrandUsername}></ProductGrid>
        </Box>
      </>
    );
  }
  return (
    <Typography variant='h4' align='center'>
      No brand found with username {publicBrandUsername}
    </Typography>
  );
};

export default BrandHomePage;
