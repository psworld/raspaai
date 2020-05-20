import {
  Box,
  Button,
  Grid,
  InputAdornment,
  Typography
} from '@material-ui/core';
import { gql } from 'apollo-boost';
import { Form, Formik } from 'formik';
import { TextField } from 'formik-material-ui';
import React from 'react';
import { useMutation, useQuery } from 'react-apollo';
import * as yup from 'yup';
import ErrorPage from '../../../core/ErrorPage';
import GraphqlErrorMessage from '../../../core/GraphqlErrorMessage';
import { newPageInfo } from '../../../core/utils';
import ProductGridSkeleton from '../../../skeletons/ProductGridSkeleton';
import SearchBar from '../../../templates/dashboard/SearchBar';
import PaginationWithState from '../../../templates/PaginationWithState';
import { BrandProductElement } from '../../../templates/ProductElement';
import { PRODUCTS } from '../../../templates/Queries';
import {
  WholesalerDashboardProductsQuery,
  WHOLESALER_DASHBOARD_PRODUCTS
} from './WholesalerDashboardProducts';

const ADD_WHOLESALER_PRODUCT = gql`
  mutation($data: AddWholesalerProductInput!) {
    addWholesalerProduct(input: $data) {
      wholesalerProduct {
        ...WholesalerProduct
      }
    }
  }
  ${WholesalerDashboardProductsQuery.fragments.productNode}
`;

const AddNewWholesalerProductGridItem = ({
  productNode,
  wholesalerId,
  productType
}) => {
  const { id: brandProductId, title: productName } = productNode;

  const [addWholesalerProduct, { loading, error, data }] = useMutation(
    ADD_WHOLESALER_PRODUCT,
    {
      // refetchQueries: [
      //   {
      //     query: SHOP_PRODUCTS,
      //     variables: { wholesalerId: shopUsername, withBrand: true }
      //   }
      // ],
      update(
        store,
        {
          data: {
            addWholesalerProduct: {
              wholesalerProduct: newWholesalerProductNode
            }
          }
        }
      ) {
        let { wholesalerProducts } = store.readQuery({
          query: WHOLESALER_DASHBOARD_PRODUCTS,
          variables: { wholesalerId }
        });

        if (wholesalerProducts.edges.length === 0) {
          // If the added product is the first product so we do not have
          // previous edges i.e edges = []
          store.writeQuery({
            query: WHOLESALER_DASHBOARD_PRODUCTS,
            variables: {
              wholesalerId,
              withBrand: true,
              productType
            },
            data: {
              wholesalerProducts: {
                pageInfo: newPageInfo,
                count: 1,
                // shop: newWholesalerProductNode.shop,
                edges: [
                  {
                    node: newWholesalerProductNode,
                    __typename: 'WholesalerProductNodeConnectionsEdge'
                  }
                ],
                __typename: 'WholesalerProductNodeConnectionsConnection'
              }
            }
          });
        } else {
          const newEdges = [
            {
              node: newWholesalerProductNode,
              __typename: wholesalerProducts.edges[0]['__typename']
            },
            ...wholesalerProducts.edges
          ];

          store.writeQuery({
            query: WHOLESALER_DASHBOARD_PRODUCTS,
            variables: {
              wholesalerId,
              withBrand: true,
              productType
            },
            data: {
              wholesalerProducts: {
                ...wholesalerProducts,
                count: newEdges.length,
                edges: newEdges
              }
            }
          });
        }
      }
    }
  );

  let quantity;

  return (
    <Grid item xs={6} sm={4} md={3} lg={2}>
      <Box width='100%' px={1} my={2}>
        <Formik
          initialValues={{ offeredPrice: undefined, quantity: 10 }}
          validationSchema={yup.object({
            offeredPrice: yup
              .number('Invalid price')
              .integer('No decimal places')
              .positive('Invalid price')
              .min(1, 'Offered price can not be zero or less than zero')
              .required('Required!'),
            quantity: yup
              .number('Invalid quantity')
              .integer('No decimal places')
              .positive('Invalid quantity')
              .min(1, 'Minimum quantity is 1')
              .required('Required!')
          })}
          onSubmit={(values, { setSubmitting }) => {
            addWholesalerProduct({
              variables: { data: { ...values, brandProductId } }
            });
            setSubmitting(false);
          }}>
          {formik => {
            quantity = formik.values.quantity;
            const dirty = formik.dirty;
            return (
              <Form>
                <BrandProductElement
                  productNode={productNode}
                  quantity={quantity}></BrandProductElement>

                <TextField
                  name='quantity'
                  type='number'
                  margin='dense'
                  variant='outlined'
                  InputProps={{
                    startAdornment: (
                      <InputAdornment
                        position='start'
                        style={{ color: 'green' }}>
                        Qty
                      </InputAdornment>
                    )
                  }}
                  InputLabelProps={{
                    shrink: true
                  }}
                />
                <TextField
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
                  disabled={
                    loading || Boolean(data) || formik.isSubmitting || !dirty
                  }
                  fullWidth
                  variant='contained'
                  color='primary'>
                  Add
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

const AddNewWholesalerProductGrid = ({ productNodeEdges, wholesalerId }) => {
  return (
    <Grid container>
      {productNodeEdges.map(product => {
        return (
          <AddNewWholesalerProductGridItem
            key={product.node.id}
            wholesalerId={wholesalerId}
            productNode={product.node}></AddNewWholesalerProductGridItem>
        );
      })}
    </Grid>
  );
};

const AddNewWholesalerProduct = ({ phrase, wholesalerId }) => {
  const { loading, error, data, fetchMore } = useQuery(PRODUCTS, {
    variables: {
      phrase,
      productType: 'is_food'
    }
  });

  if (loading) return <ProductGridSkeleton></ProductGridSkeleton>;
  if (error) return <ErrorPage></ErrorPage>;
  if (data) {
    if (data.products.pageInfo.startCursor) {
      const { edges, pageInfo } = data.products;
      return (
        <>
          <br></br>
          <Typography variant='h6' align='center'>
            Add new products
          </Typography>
          <br></br>
          <SearchBar
            placeholder={`Search new products`}
            searchUrlBase={window.location.pathname}></SearchBar>
          <AddNewWholesalerProductGrid
            productNodeEdges={edges}
            wholesalerId={wholesalerId}></AddNewWholesalerProductGrid>
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
                  href={`${process.env.GATSBY_WHATSAPP_RASPAAI_URL}text=Add *${phrase}* to raspaai%0aOther information about product:-%0a`}
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
              href={`${process.env.GATSBY_WHATSAPP_RASPAAI_URL}text=Add *${phrase}* to raspaai%0aOther information about product:-%0a`}
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

export default AddNewWholesalerProduct;
