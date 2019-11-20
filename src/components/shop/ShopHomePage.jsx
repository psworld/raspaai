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
import PaginationWithState from '../templates/PaginationWithState';
import ShopProductGrid from '../templates/ShopProductGrid';
import MainFeaturedPost from '../templates/MainFeaturedPost';
import BrandShopHomeSkeleton from '../skeletons/BrandShopHomeSkeleton';

// const useStyles = makeStyles(theme => ({
//   toolbarSecondary: {
//     justifyContent: "space-between",
//     overflowX: "auto",
//   },
//   toolbarLink: {
//     padding: theme.spacing(1),
//     flexShrink: 0,
//   },
// }))

export const SHOP_PRODUCTS = gql`
  query(
    $publicShopUsername: String!
    $phrase: String
    $endCursor: String
    $withBrand: Boolean = false
  ) {
    shopProducts(
      publicShopUsername: $publicShopUsername
      phrase: $phrase
      first: 20
      after: $endCursor
    ) @connection(key: "shopProducts") {
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      edges {
        node {
          id
          product {
            id
            title
            mrp
            description
            thumb
            brand @include(if: $withBrand) {
              id
              publicUsername
              title
            }
          }
          offeredPrice
          shop {
            id
            properties {
              publicUsername
            }
          }
          inStock
        }
      }
    }
  }
`;

const ProductGrid = ({ publicShopUsername, phrase }) => {
  const { loading, error, data, fetchMore } = useQuery(SHOP_PRODUCTS, {
    variables: {
      publicShopUsername,
      phrase,
      withBrand: false
    }
  });

  if (loading) return <ProductGridSkeleton></ProductGridSkeleton>;
  if (error) return <ErrorPage></ErrorPage>;

  if (data && data.shopProducts.pageInfo.startCursor) {
    const { edges: shopProducts, pageInfo } = data.shopProducts;
    return (
      <>
        <Grid container>
          <ShopProductGrid shopProducts={shopProducts}></ShopProductGrid>
        </Grid>
        <Grid item>
          <PaginationWithState
            fetchMore={fetchMore}
            pageInfo={pageInfo}></PaginationWithState>
        </Grid>
      </>
    );
  }
  return (
    <Typography style={{ margin: 8 }} variant='h4'>
      We could not find any result for <code>{phrase}</code>
    </Typography>
  );
};

const SHOP = gql`
  query($publicShopUsername: String!) {
    shop(publicShopUsername: $publicShopUsername) {
      id
      geometry {
        coordinates
      }
      properties {
        publicUsername
        title
        heroImage
      }
    }
  }
`;

const ShopHomePage = props => {
  const { shopUsername: publicShopUsername, phrase } = props;
  // The setSearchPhrase will add searchPhrase at the end of the
  // of the url eg. abc/search/${searchPhrase} it will be available
  // as `:phrase` in the props of the component. Then it will be sent to
  // grid.
  const [searchPhrase, setSearchPhrase] = React.useState('');

  const { loading, error, data } = useQuery(SHOP, {
    variables: { publicShopUsername }
  });

  if (loading)
    return (
      <>
        <BrandShopHomeSkeleton></BrandShopHomeSkeleton>
      </>
    );

  if (error) return <ErrorPage></ErrorPage>;

  if (data && data.shop) {
    const {
      geometry: { coordinates },
      properties: { title, heroImage }
    } = data.shop;
    const lat = coordinates[1];
    const lng = coordinates[0];
    return (
      <>
        <SEO title={title}></SEO>
        <MainFeaturedPost img={heroImage} title={title}></MainFeaturedPost>
        <TitleAndSearchToolbar
          title={title}
          searchPhrase={searchPhrase}
          publicUsername={publicShopUsername}
          setSearchPhrase={setSearchPhrase}
          lat={lat}
          lng={lng}></TitleAndSearchToolbar>
        {/* <Toolbar
          component="nav"
          variant="dense"
          className={classes.toolbarSecondary}
        >
          {sections.map(section => (
            <Link
              color="inherit"
              noWrap
              key={section}
              variant="body2"
              className={classes.toolbarLink}
            >
              {section}
            </Link>
          ))}
        </Toolbar> */}
        <Box overflow='hidden' px={0}>
          <ProductGrid
            phrase={phrase}
            publicShopUsername={publicShopUsername}></ProductGrid>
        </Box>
      </>
    );
  } else {
    return (
      <>
        <Typography component='h1' variant='h2' align='center'>
          No shop found with username{' '}
          <span style={{ color: 'blue' }}>{publicShopUsername}</span>
        </Typography>
        <br></br>
        <Typography component='h3' variant='h3' color='primary' align='center'>
          Check the username and try again.
        </Typography>
      </>
    );
  }
};

export default ShopHomePage;
