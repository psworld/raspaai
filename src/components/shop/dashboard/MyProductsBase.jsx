import {
  Box,
  Button,
  Grid,
  InputAdornment,
  Typography
} from '@material-ui/core';
import { green, red } from '@material-ui/core/colors';
import { gql } from 'apollo-boost';
import { Form, useFormik } from 'formik';
import { CheckboxWithLabel, TextField } from 'formik-material-ui';
import React from 'react';
import { useMutation, useQuery } from 'react-apollo';
import * as Yup from 'yup';
import CustomFormik from '../../core/CustomFormik';
import ErrorPage from '../../core/ErrorPage';
import GraphqlErrorMessage from '../../core/GraphqlErrorMessage';
import Link, { MenuItemLink } from '../../core/Link';
import { emptyPageInfo, slugGenerator, updatedDiff } from '../../core/utils';
import ProductGridSkeleton from '../../skeletons/ProductGridSkeleton';
import SearchBar from '../../templates/dashboard/SearchBar';
import PaginationWithState from '../../templates/PaginationWithState';
import ProductThumb from '../../templates/ProductThumb';
import ResponseSnackbar from '../../templates/ResponseSnackbar';

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
            productSpace
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
            thumbOverlayText
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

export const offeredPriceBaseValidationSchema = Yup.number('Invalid price')
  .integer('No decimal places')
  .positive('Invalid price')
  .min(1, 'Offered price can not be zero or less than zero')
  .required('Required!');

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
      thumbOverlayText,
      brand: { publicUsername: brandUsername, title: brandName }
    }
  } = shopProductNode;

  const isService = productType === 'is_service' ? true : false;
  const isFood = productType === 'is_food' ? true : false;

  const {
    properties: { publicUsername: shopUsername }
  } = shop;

  const [openSuccessSnackbar, setOpenSuccessSnackbar] = React.useState(false);

  const handleSnackbarOpen = () => {
    setOpenSuccessSnackbar(true);
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSuccessSnackbar(false);
  };

  const [modify, { loading, error }] = useMutation(MODIFY_SHOP_PRODUCT, {
    onCompleted() {
      handleSnackbarOpen();
    }
  });

  const formik = useFormik({
    initialValues: { offeredPrice, inStock, action: 'modify' },
    validationSchema: Yup.object({
      offeredPrice: mrp
        ? offeredPriceBaseValidationSchema.max(
            mrp,
            'Can not be greater than mrp'
          )
        : offeredPriceBaseValidationSchema,
      inStock: Yup.boolean().required('A value is required'),
      action: Yup.string().oneOf(['modify', 'delete'])
    }),
    onSubmit: (values, { setSubmitting }) => {
      const initialValues = formik.initialValues;
      const action = values.action;
      const changedValues = updatedDiff(initialValues, values);
      setSubmitting(false);
      const dirty = formik.dirty;
      if (dirty) {
        if (action === 'delete') {
          modify({
            variables: {
              shopProductId,
              action: values.action,
              ...changedValues
            },
            update(cache) {
              updateCacheAfterShopProductDelete(cache);
            }
          });
        } else {
          modify({
            variables: {
              shopProductId,
              action: values.action,
              ...changedValues
            }
          });
        }
      }
    }
  });

  const values = formik.values;

  const productSlug = slugGenerator(title);
  const shopProduct = `/shop/${shopUsername}/product/${productSlug}/${shopProductId}`;

  function updateCacheAfterShopProductDelete(cache) {
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

  return (
    <Grid item xs={6} sm={4} md={3} lg={2}>
      <ResponseSnackbar
        open={openSuccessSnackbar}
        handleClose={handleSnackbarClose}
        variant='success'
        message='Changes saved successfully'></ResponseSnackbar>
      <Box width='100%' px={1} my={2}>
        <Link to={shopProduct}>
          <ProductThumb
            src={thumb}
            title={title}
            thumbOverlayText={thumbOverlayText}></ProductThumb>
          <Typography variant='body2'>{title}</Typography>
        </Link>
        <Typography style={{ paddingTop: 3 }} display='block' variant='caption'>
          <MenuItemLink to={`/brand/${brandUsername}`}>
            By {brandName}
          </MenuItemLink>
        </Typography>
        {isService || isFood ? (
          <></>
        ) : (
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
        )}

        <CustomFormik formikBag={formik}>
          {props => (
            <Form>
              <TextField
                placeholder='Offered price'
                name='offeredPrice'
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

              <CheckboxWithLabel
                name='inStock'
                Label={{
                  label: (
                    <span
                      style={{
                        color: values.inStock ? green[500] : red[500]
                      }}>
                      {values.inStock ? 'In stock' : 'Out of stock'}
                    </span>
                  )
                }}></CheckboxWithLabel>
              <br></br>

              {error && (
                <GraphqlErrorMessage error={error}></GraphqlErrorMessage>
              )}

              <Grid container>
                <Grid item xs={6} sm={6} md={6}>
                  <Button
                    onClick={() =>
                      formik.setFieldValue('action', 'modify') &
                      formik.handleSubmit()
                    }
                    disabled={loading || !formik.dirty}
                    color='primary'>
                    {loading ? <>Saving</> : <>Save</>}
                  </Button>
                </Grid>
                <Grid item xs={6} sm={6} md={6}>
                  <Button
                    onClick={() =>
                      formik.setFieldValue('action', 'delete') &
                      formik.handleSubmit()
                    }
                    disabled={loading}
                    color='secondary'>
                    Delete
                  </Button>
                </Grid>
              </Grid>
            </Form>
          )}
        </CustomFormik>
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
    activePlan: { productSpace }
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
