import React from 'react';

import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';

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
import { Toolbar, Divider } from '@material-ui/core';
import Link from '../core/Link';

import { makeStyles } from '@material-ui/core/styles';
import { navigate } from 'gatsby';
import { SHOP_COMBOS } from './dashboard/MyCombos';
import CombosGrid from '../templates/CombosGrid';

const useStyles = makeStyles(theme => ({
  toolbarSecondary: {
    justifyContent: 'space-between',
    overflowX: 'auto'
  },
  toolbarLink: {
    padding: theme.spacing(1),
    flexShrink: 0
  }
}));

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
    )
      @connection(
        key: "shopProducts"
        filter: ["phrase", "publicShopUsername"]
      ) {
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      count
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
              title
              publicUsername
            }
          }
          inStock
        }
      }
    }
  }
`;

const Combos = ({ shopUsername, phrase }) => {
  const { loading, error, data, fetchMore } = useQuery(SHOP_COMBOS, {
    variables: { shopUsername, phrase, withShop: true }
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

  if (data && data.shopCombos && data.shopCombos.pageInfo.startCursor) {
    const { pageInfo, edges: comboNodeEdges } = data.shopCombos;
    return (
      <>
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

const ShopProducts = ({ shopUsername, phrase }) => {
  const { loading, error, data, fetchMore } = useQuery(SHOP_PRODUCTS, {
    variables: {
      publicShopUsername: shopUsername,
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

  if (phrase) {
    return (
      <Typography align='center' style={{ margin: 4 }} variant='h5'>
        No results found for - <b>{phrase}</b>
      </Typography>
    );
  }
  return (
    <>
      <Typography variant='h5' style={{ marginTop: 20 }} align='center'>
        This shop do not have any product right now.
      </Typography>
    </>
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

const sections = [
  { id: 'About', url: '' },
  { id: 'Address', url: '#address' },
  { id: 'Contact', url: '#contact' },
  { id: 'Return refund policy', url: '#return-refund-policy' }
];

const ShopHomePage = props => {
  const { shopUsername, phrase } = props;
  // The setSearchPhrase will add searchPhrase at the end of the
  // of the url eg. abc/search/${searchPhrase} it will be available
  // as `:phrase` in the props of the component. Then it will be sent to
  // grid.
  const [searchPhrase, setSearchPhrase] = React.useState(phrase ? phrase : '');

  const classes = useStyles();

  const { loading, error, data } = useQuery(SHOP, {
    variables: { publicShopUsername: shopUsername }
  });

  if (loading)
    return (
      <>
        <BrandShopHomeSkeleton></BrandShopHomeSkeleton>
      </>
    );

  if (error) return <ErrorPage></ErrorPage>;

  const handleClearSearch = () => {
    setSearchPhrase('');
    navigate(`/shop/${shopUsername}`);
  };

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
          publicUsername={shopUsername}
          setSearchPhrase={setSearchPhrase}
          handleClearSearch={handleClearSearch}
          lat={lat}
          lng={lng}></TitleAndSearchToolbar>
        <Toolbar
          component='nav'
          variant='dense'
          className={classes.toolbarSecondary}>
          {sections.map(section => (
            <Link
              key={section.id}
              to={`${window.location.pathname}/about/${section.url}`}
              color='inherit'
              noWrap
              variant='body2'
              className={classes.toolbarLink}>
              {section.id}
            </Link>
          ))}
        </Toolbar>
        <Divider></Divider>

        <Combos phrase={phrase} shopUsername={shopUsername}></Combos>
        <ShopProducts
          phrase={phrase}
          shopUsername={shopUsername}></ShopProducts>
      </>
    );
  } else {
    return (
      <>
        <Typography component='h1' variant='h3' align='center'>
          No shop found with username{' '}
          <span style={{ color: 'blue' }}>{shopUsername}</span>
        </Typography>
        <br></br>
        <Typography variant='h4' color='primary' align='center'>
          Check the username and try again.
        </Typography>
      </>
    );
  }
};

export default ShopHomePage;
