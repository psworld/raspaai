import { Divider, Toolbar } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { navigate } from 'gatsby';
import gql from 'graphql-tag';
import React from 'react';
import { useQuery } from 'react-apollo';
import ErrorPage from '../core/ErrorPage';
import Link, { MenuItemLink } from '../core/Link';
import { getIsStoreOpenNow } from '../core/utils';
import SEO from '../seo';
import BrandShopHomeSkeleton from '../skeletons/BrandShopHomeSkeleton';
import ProductGridSkeleton from '../skeletons/ProductGridSkeleton';
import CombosGrid from '../templates/CombosGrid';
import MainFeaturedPost from '../templates/MainFeaturedPost';
import PaginationWithState from '../templates/PaginationWithState';
import ShopProductGrid from '../templates/ShopProductGrid';
import TitleAndSearchToolbar from '../templates/TitleAndSearchToolbar';
import { SHOP_COMBOS } from './dashboard/MyCombos';

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
    $withShop: Boolean = true
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
      shop @include(if: $withShop) {
        id
        properties {
          title
          publicUsername
        }
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
          inStock
        }
      }
    }
  }
`;

const Combos = ({ shopUsername, phrase, shop }) => {
  const { loading, error, data, fetchMore } = useQuery(SHOP_COMBOS, {
    variables: { shopUsername, phrase }
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
          <CombosGrid shop={shop} comboNodeEdges={comboNodeEdges}></CombosGrid>
        </Grid>

        <PaginationWithState
          pageInfo={pageInfo}
          fetchMore={fetchMore}></PaginationWithState>
      </>
    );
  }

  return <></>;
};

const ShopProducts = ({ shopUsername, phrase, shop }) => {
  const { loading, error, data, fetchMore } = useQuery(SHOP_PRODUCTS, {
    variables: {
      publicShopUsername: shopUsername,
      phrase,
      withBrand: false,
      withShop: false
    }
  });

  if (loading) return <ProductGridSkeleton></ProductGridSkeleton>;
  if (error) return <ErrorPage></ErrorPage>;

  if (data && data.shopProducts.pageInfo.startCursor) {
    const { edges: shopProducts, pageInfo } = data.shopProducts;
    return (
      <>
        <Grid container>
          <ShopProductGrid
            shopProducts={shopProducts}
            shop={shop}></ShopProductGrid>
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
        openAt
        closeAt
        offDays
        isOpenToday
        isActive
        contactNumber
      }
    }
  }
`;

const sections = [
  { id: 'About', url: '' },
  { id: 'Address', url: '#address' },
  { id: 'Active time', url: '#active-time' },
  { id: 'Contact', url: '#contact' },
  { id: 'Return refund policy', url: '#return-refund-policy' }
];

export const InactiveShop = ({ contactNumber, shopName, shopUsername }) => {
  return (
    <div style={{ marginTop: 20 }}>
      <Typography style={{ color: 'red' }} variant='h5' align='center'>
        This shop is currently inactive
      </Typography>

      <Typography style={{ marginTop: 10 }} align='center'>
        <a
          href={`https://wa.me/91${contactNumber}?text=Hey chief we need your products.%0aKindly reactivate your shop *${shopName}* at ${window.location.origin}/shop/${shopUsername}`}
          target='_blank'
          rel='noopener noreferrer'>
          <b>Send a request to owner to reactivate the shop.</b>
        </a>
      </Typography>
    </div>
  );
};

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
    let {
      geometry: { coordinates },
      properties: {
        title,
        heroImage,
        openAt,
        closeAt,
        isOpenToday,
        offDays,
        isActive,
        contactNumber
      }
    } = data.shop;
    const lat = coordinates[1];
    const lng = coordinates[0];

    const isStoreOpenNow = getIsStoreOpenNow(
      openAt,
      closeAt,
      offDays,
      isOpenToday
    );

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
          lng={lng}
          isActive={isActive}></TitleAndSearchToolbar>
        {isActive ? (
          <>
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
            <Typography align='center' variant='h6'>
              <MenuItemLink
                to={`${window.location.pathname}/about/#active-time`}>
                {isStoreOpenNow ? (
                  <span style={{ color: 'green' }}>Store is open now</span>
                ) : (
                  <span style={{ color: 'red' }}>Store is closed for now</span>
                )}
              </MenuItemLink>
            </Typography>
            <Combos
              shop={data.shop}
              phrase={phrase}
              shopUsername={shopUsername}></Combos>
            <ShopProducts
              shop={data.shop}
              phrase={phrase}
              shopUsername={shopUsername}></ShopProducts>
          </>
        ) : (
          <InactiveShop
            contactNumber={contactNumber}
            shopName={title}
            shopUsername={shopUsername}></InactiveShop>
        )}
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
