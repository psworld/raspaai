import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  InputAdornment,
  TextField,
  Typography
} from '@material-ui/core';
import { green, red } from '@material-ui/core/colors';
import { withStyles } from '@material-ui/core/styles';
import { gql } from 'apollo-boost';
import React from 'react';
import { useMutation, useQuery } from 'react-apollo';
import ErrorPage from '../../core/ErrorPage';
import GraphqlErrorMessage from '../../core/GraphqlErrorMessage';
import Link, { MenuItemLink } from '../../core/Link';
import { emptyPageInfo, slugGenerator } from '../../core/utils';
import ProductGridSkeleton from '../../skeletons/ProductGridSkeleton';
import PaginationWithState from '../../templates/PaginationWithState';
import ProductThumb from '../../templates/ProductThumb';
import SearchBar from '../../templates/dashboard/SearchBar';

export const DASHBOARD_SHOP_PRODUCTS = gql`
  query(
    $publicShopUsername: String!
    $phrase: String
    $endCursor: String
    $withBrand: Boolean = false
    $withShop: Boolean = true
    $productType: String
  ) {
    dashboardShopProducts(
      publicShopUsername: $publicShopUsername
      productType: $productType
      phrase: $phrase
      first: 20
      after: $endCursor
    )
      @connection(
        key: "dashboardShopProducts"
        filter: ["phrase", "publicShopUsername", "productType"]
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
          occupiedSpace
          activePlan {
            id
            plan {
              id
              productSpace
            }
          }
        }
      }
      edges {
        node {
          id
          product {
            id
            title
            mrp
            thumb
            isService
            isFood
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

const MODIFY_SHOP_PRODUCT = gql`
  mutation(
    $shopProductId: ID!
    $offeredPrice: Int
    $inStock: Boolean
    $action: String!
  ) {
    modifyShopProduct(
      input: {
        shopProductId: $shopProductId
        offeredPrice: $offeredPrice
        inStock: $inStock
        action: $action
      }
    ) {
      shopProduct {
        id
        offeredPrice
        shop {
          id
          properties {
            occupiedSpace
          }
        }
        inStock
      }
    }
  }
`;

const GreenCheckbox = withStyles({
  root: {
    color: green[400],
    '&$checked': {
      color: green[600]
    }
  },
  checked: {}
})(props => <Checkbox color='default' {...props} />);

const DashboardShopProductGridItem = ({
  shopProductNode,
  shop,
  productType
}) => {
  const {
    id: shopProductId,
    offeredPrice,
    inStock,
    product: {
      title,
      mrp,
      thumb,
      isService,
      isFood,
      brand: { publicUsername: brandUsername, title: brandName }
    }
  } = shopProductNode;
  const {
    properties: { publicUsername: shopUsername }
  } = shop;

  const [values, setValues] = React.useState({
    newInStock: inStock,
    newOfferedPrice: offeredPrice
  });
  const { newInStock, newOfferedPrice } = values;

  const [showMutationResp, setShowMutationResp] = React.useState(true);

  const [modify, { loading, error, data }] = useMutation(MODIFY_SHOP_PRODUCT, {
    variables: {
      shopProductId,
      offeredPrice: newOfferedPrice,
      inStock: newInStock
    },
    onCompleted() {
      setTimeout(() => {
        setShowMutationResp(false);
      }, 5000);
      setShowMutationResp(true);
    }
  });

  const handleChange = e => {
    if (e.target.name === 'newInStock') {
      setValues({ ...values, newInStock: !newInStock });
    } else if (e.target.name === 'newOfferedPrice') {
      let value = e.target.value;
      try {
        value = parseInt(value);
        setValues({ ...values, [e.target.name]: value });
      } catch {}
    } else {
      setValues({ ...values, [e.target.name]: e.target.value });
    }
  };

  const validChanges = () => {
    if (Number.isInteger(newOfferedPrice)) {
      if (isService || isFood) {
        // Do not check for max mrp
        if (newOfferedPrice === offeredPrice && newInStock === inStock) {
          return false;
        }
      } else {
        if (
          (newOfferedPrice === offeredPrice && newInStock === inStock) ||
          newOfferedPrice > mrp
        ) {
          return false;
        }
      }
      return true;
    } else return false;
  };

  const productSlug = slugGenerator(title);
  const shopProduct = `/shop/${shopUsername}/product/${productSlug}/${shopProductId}`;
  return (
    <Grid item xs={6} sm={4} md={3} lg={2}>
      <Box width='100%' px={1} my={2}>
        <Link to={shopProduct}>
          <ProductThumb src={thumb} title={title}></ProductThumb>
          <Typography variant='body2'>{title}</Typography>
        </Link>
        <Typography style={{ paddingTop: 3 }} display='block' variant='caption'>
          <MenuItemLink to={`/brand/${brandUsername}`}>
            By {brandName}
          </MenuItemLink>
        </Typography>
        {!isService ||
          (!isFood && (
            <Typography variant='body2'>
              M.R.P{' '}
              <span
                style={{
                  textDecorationLine: 'line-through',
                  color: '#FA8072'
                }}>
                {' '}
                &#8377; {mrp}
              </span>
            </Typography>
          ))}
        <TextField
          onChange={handleChange}
          placeholder={'Offered Price'}
          id='newOfferedPrice'
          value={newOfferedPrice}
          name='newOfferedPrice'
          type='number'
          margin='dense'
          variant='outlined'
          InputProps={{
            startAdornment: (
              <InputAdornment position='start' style={{ color: 'green' }}>
                &#8377;
              </InputAdornment>
            )
          }}
          InputLabelProps={{
            shrink: true
          }}
        />
        <FormControlLabel
          control={
            <GreenCheckbox
              name='newInStock'
              checked={newInStock}
              value={!newInStock}
              onChange={handleChange}></GreenCheckbox>
          }
          label={
            <span
              style={{
                color: newInStock ? green[500] : red[500]
              }}>
              {newInStock ? 'In stock' : 'Out of stock'}
            </span>
          }
        />
        <br></br>
        {mrp && newOfferedPrice > mrp && (
          <span style={{ color: 'red' }}>
            Offered price can not be greater than M.R.P
          </span>
        )}
        {error && <GraphqlErrorMessage error={error}></GraphqlErrorMessage>}

        <Grid container>
          <Grid item xs={6} sm={6} md={6}>
            <Button
              onClick={() =>
                modify({
                  variables: {
                    action: 'modify'
                  }
                })
              }
              disabled={loading || !validChanges()}
              color='primary'>
              {loading ? <>Saving</> : <>Save</>}
            </Button>
          </Grid>
          <Grid item xs={6} sm={6} md={6}>
            <Button
              onClick={() =>
                modify({
                  variables: {
                    action: 'delete'
                  },
                  update(cache) {
                    const { dashboardShopProducts } = cache.readQuery({
                      query: DASHBOARD_SHOP_PRODUCTS,
                      variables: {
                        publicShopUsername: shopUsername,
                        withBrand: true,
                        productType
                      }
                    });
                    const newShopProductEdges = dashboardShopProducts.edges.filter(
                      e => e.node.id !== shopProductId
                    );
                    if (newShopProductEdges.length > 0) {
                      cache.writeQuery({
                        query: DASHBOARD_SHOP_PRODUCTS,
                        variables: {
                          publicShopUsername: shopUsername,
                          withBrand: true,
                          productType
                        },
                        data: {
                          dashboardShopProducts: {
                            ...dashboardShopProducts,
                            count: newShopProductEdges.length,
                            edges: newShopProductEdges
                          }
                        }
                      });
                    } else if (newShopProductEdges.length === 0) {
                      cache.writeQuery({
                        query: DASHBOARD_SHOP_PRODUCTS,
                        variables: {
                          publicShopUsername: shopUsername,
                          withBrand: true,
                          productType
                        },
                        data: {
                          dashboardShopProducts: {
                            ...dashboardShopProducts,
                            pageInfo: emptyPageInfo,
                            count: 0,
                            edges: []
                          }
                        }
                      });
                    }
                  }
                })
              }
              disabled={loading}
              color='secondary'>
              Delete
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Grid>
  );
};

const DashboardShopProductGrid = ({
  shopProductNodeEdges,
  shop,
  productType
}) => {
  return (
    <Grid container>
      {shopProductNodeEdges.map(shopProduct => {
        return (
          <DashboardShopProductGridItem
            key={shopProduct.node.id}
            shop={shop}
            productType={productType}
            shopProductNode={shopProduct.node}></DashboardShopProductGridItem>
        );
      })}
    </Grid>
  );
};

export const getTypeName = type => {
  switch (type) {
    case 'is_service':
      return 'services';

    case 'is_food':
      return 'food items';

    default:
      return 'products';
  }
};

const RemainingProductSpace = ({ shop }) => {
  const {
    occupiedSpace,
    activePlan: {
      plan: { productSpace }
    }
  } = shop.properties;
  return (
    <Typography align='center' variant='h6'>
      <b>{productSpace - occupiedSpace}</b> product space remaining out of{' '}
      <b>{productSpace}</b>
    </Typography>
  );
};

const MyProductsBase = ({
  baseProps: { shopUsername, phrase },
  productType
}) => {
  const typeName = getTypeName(productType);
  const { loading, error, data, fetchMore } = useQuery(
    DASHBOARD_SHOP_PRODUCTS,
    {
      variables: {
        publicShopUsername: shopUsername,
        phrase,
        withBrand: true,
        productType
      }
    }
  );

  if (loading) return <ProductGridSkeleton></ProductGridSkeleton>;
  if (error) return <ErrorPage></ErrorPage>;

  if (data && data.dashboardShopProducts.pageInfo.startCursor) {
    const {
      edges: dashboardShopProducts,
      pageInfo,
      shop
    } = data.dashboardShopProducts;

    let addNewUrl = `${window.location.pathname}`;
    if (addNewUrl.includes('/search')) {
      addNewUrl = addNewUrl.split('/search')[0];
    }
    return (
      <>
        <br></br>
        <center>
          <Button
            component={Link}
            to={`${addNewUrl}/add`}
            variant='contained'
            color='primary'>
            Add new {typeName}
          </Button>
        </center>
        <br></br>
        <SearchBar
          placeholder={`Search your ${typeName}`}
          defaultPhrase={phrase}
          searchUrlBase={window.location.pathname}></SearchBar>
        <br></br>
        <RemainingProductSpace shop={shop}></RemainingProductSpace>
        <br></br>
        <DashboardShopProductGrid
          productType={productType}
          shopProductNodeEdges={dashboardShopProducts}
          shop={shop}></DashboardShopProductGrid>

        <br></br>
        <br></br>
        <PaginationWithState
          fetchMore={fetchMore}
          pageInfo={pageInfo}></PaginationWithState>
      </>
    );
  }
  if (phrase) {
    return (
      <>
        <br></br>
        <SearchBar
          defaultPhrase={phrase}
          searchUrlBase={window.location.pathname}></SearchBar>
        <br></br>
        <Typography align='center' style={{ margin: 4 }} variant='h5'>
          No results found for - <b>{phrase}</b>
        </Typography>
      </>
    );
  }
  return (
    <>
      <Typography variant='h5' style={{ marginTop: 20 }} align='center'>
        You do not have any {typeName} in your shop
      </Typography>
      <br></br>
      <center>
        <Typography
          variant='h5'
          component={Link}
          to={`${window.location.pathname}/add`}>
          Add {typeName}
        </Typography>
      </center>
    </>
  );
};

export default MyProductsBase;
