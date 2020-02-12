import {
  Button,
  Grid,
  InputAdornment,
  Typography,
  Box
} from '@material-ui/core';
import * as Yup from 'yup';
import { gql } from 'apollo-boost';
import React from 'react';
import { useMutation, useQuery } from 'react-apollo';
import ErrorPage from '../../core/ErrorPage';
import Link from '../../core/Link';
import { newPageInfo } from '../../core/utils';
import ProductGridSkeleton from '../../skeletons/ProductGridSkeleton';
import PaginationWithState from '../../templates/PaginationWithState';
import ProductThumb from '../../templates/ProductThumb';
import { DASHBOARD_SHOP_PRODUCTS, getTypeName } from './MyProductsBase';
import GraphqlErrorMessage from '../../core/GraphqlErrorMessage';
import { SHOP_PRODUCTS } from '../ShopHomePage';
import SearchBar from '../../templates/dashboard/SearchBar';
import { Formik, Form } from 'formik';
import { offeredPriceBaseValidationSchema } from './MyProductsBase';
import { TextField } from 'formik-material-ui';

export const PRODUCTS = gql`
  query(
    $phrase: String
    $endCursor: String
    $productType: String
    $withBrand: Boolean = true
  ) {
    products(
      first: 20
      phrase: $phrase
      after: $endCursor
      productType: $productType
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

const ADD_SHOP_PRODUCT = gql`
  mutation($productId: ID!, $offeredPrice: Int!) {
    addShopProduct(
      input: { productId: $productId, offeredPrice: $offeredPrice }
    ) {
      shopProduct {
        id
        product {
          id
          title
          mrp
          description
          thumb
          thumbOverlayText
          isFood
          isService
          brand {
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
            occupiedSpace
          }
        }
        inStock
      }
    }
  }
`;

const AddNewShopProductItem = ({ productNode, shopUsername, productType }) => {
  const {
    id: productId,
    title: productName,
    thumb,
    thumbOverlayText,
    mrp,
    brand: { title: brandName, publicUsername: brandUsername }
  } = productNode;
  // const isService = productType === 'is_service' ? true : false;
  // const isFood = productType === 'is_food' ? true : false;

  const [addShopProduct, { loading, error, data }] = useMutation(
    ADD_SHOP_PRODUCT,
    {
      variables: { productId },
      refetchQueries: [
        {
          query: SHOP_PRODUCTS,
          variables: { publicShopUsername: shopUsername, withBrand: true }
        }
      ],
      update(
        store,
        {
          data: {
            addShopProduct: { shopProduct: newShopProduct }
          }
        }
      ) {
        let { dashboardShopProducts } = store.readQuery({
          query: DASHBOARD_SHOP_PRODUCTS,
          variables: {
            publicShopUsername: shopUsername,
            withBrand: true,
            productType
          }
        });

        if (dashboardShopProducts.edges.length === 0) {
          // If the added product is the first product so we do not have
          // previous edges i.e edges = []
          store.writeQuery({
            query: DASHBOARD_SHOP_PRODUCTS,
            variables: {
              publicShopUsername: shopUsername,
              withBrand: true,
              productType
            },
            data: {
              dashboardShopProducts: {
                pageInfo: newPageInfo,
                count: 1,
                shop: newShopProduct.shop,
                edges: [
                  {
                    node: newShopProduct,
                    __typename: 'ShopProductNodeConnectionsEdge'
                  }
                ],
                __typename: 'ShopProductNodeConnectionsConnection'
              }
            }
          });
        } else {
          const newEdges = dashboardShopProducts.edges.concat({
            node: newShopProduct,
            __typename: dashboardShopProducts.edges[0]['__typename']
          });

          store.writeQuery({
            query: DASHBOARD_SHOP_PRODUCTS,
            variables: {
              publicShopUsername: shopUsername,
              withBrand: true,
              productType
            },
            data: {
              dashboardShopProducts: {
                ...dashboardShopProducts,
                count: newEdges.length,
                edges: newEdges
              }
            }
          });
        }
      }
    }
  );

  return (
    <Grid item xs={6} sm={4} md={3} lg={2}>
      <Box width='100%' px={1} my={2}>
        <Link to={`/`}>
          <ProductThumb
            src={thumb}
            title={productName}
            thumbOverlayText={thumbOverlayText}></ProductThumb>
          <Typography variant='body2'>{productName}</Typography>
        </Link>
        <Typography display='block' variant='caption' color='textSecondary'>
          <Link to={`/brand/${brandUsername}`}>
            By <span style={{ color: '#5050FF' }}>{brandName}</span>
          </Link>
        </Typography>
        {mrp && (
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
        <Formik
          initialValues={{ offeredPrice: null }}
          validationSchema={Yup.object({
            offeredPrice: mrp
              ? offeredPriceBaseValidationSchema.max(
                  mrp,
                  'Can not be greater than mrp'
                )
              : offeredPriceBaseValidationSchema
          })}
          onSubmit={(values, { setSubmitting }) => {
            addShopProduct({ variables: { ...values } });
            setSubmitting(false);
          }}>
          {formik => {
            const dirty = formik.dirty;
            return (
              <Form>
                <TextField
                  id='offeredPrice'
                  name='offeredPrice'
                  type='number'
                  margin='dense'
                  variant='outlined'
                  InputProps={{
                    startAdornment: (
                      <InputAdornment
                        position='start'
                        style={{ color: 'green' }}>
                        &#8377;
                      </InputAdornment>
                    )
                  }}
                  InputLabelProps={{
                    shrink: true
                  }}
                />
                <br></br>

                {error && (
                  <GraphqlErrorMessage error={error}></GraphqlErrorMessage>
                )}
                <Button
                  onClick={formik.handleSubmit}
                  disabled={loading || data || formik.isSubmitting || !dirty}
                  fullWidth
                  variant='contained'
                  color='primary'>
                  Add to shop
                </Button>
                {data && (
                  <span style={{ color: 'green' }}>Saved successfully</span>
                )}
              </Form>
            );
          }}
        </Formik>
      </Box>
    </Grid>
  );
};

const AddNewShopProductGrid = ({
  shopUsername,
  productNodeEdges,
  productType
}) => {
  // A service is just a brand product with is_service = True
  return (
    <Grid container>
      {productNodeEdges.map(product => {
        return (
          <AddNewShopProductItem
            key={product.node.id}
            productType={productType}
            shopUsername={shopUsername}
            productNode={product.node}></AddNewShopProductItem>
        );
      })}
    </Grid>
  );
};

const AddNewProductBase = ({ shopUsername, phrase, productType }) => {
  const { loading, error, data, fetchMore } = useQuery(PRODUCTS, {
    variables: {
      phrase,
      productType
    }
  });

  const typeName = getTypeName(productType);

  if (loading) return <ProductGridSkeleton></ProductGridSkeleton>;
  if (error) return <ErrorPage></ErrorPage>;
  if (data) {
    if (data.products.pageInfo.startCursor) {
      const { edges, pageInfo } = data.products;
      return (
        <>
          <br></br>
          <Typography variant='h6' align='center'>
            Add new {typeName} to your shop
          </Typography>
          <br></br>
          <SearchBar
            placeholder={`Search new ${typeName} to add them to your shop`}
            searchUrlBase={window.location.pathname}></SearchBar>
          <AddNewShopProductGrid
            productType={productType}
            productNodeEdges={edges}
            shopUsername={shopUsername}></AddNewShopProductGrid>
          <br></br>
          <PaginationWithState
            pageInfo={pageInfo}
            fetchMore={fetchMore}></PaginationWithState>
          <br></br>
          {phrase && (
            <>
              <center>
                <Typography
                  style={{ marginTop: '10vh' }}
                  variant='h6'
                  algin='center'>
                  Could not find <b>{phrase}</b> ?
                </Typography>
              </center>
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
              href={`${process.env.GATSBY_WHATSAPP_RASPAAI_URL}text=Add service *${phrase}* to raspaai%0aOther information:-%0a`}
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
        Sorry, no {typeName} available at the moment
      </Typography>
    );
  }
};

export default AddNewProductBase;
