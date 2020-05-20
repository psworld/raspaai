import { Button, Grid, InputAdornment, Typography } from '@material-ui/core';
import { gql } from 'apollo-boost';
import { Form, Formik } from 'formik';
import { TextField } from 'formik-material-ui';
import { reverse } from 'named-urls';
import React from 'react';
import { useQuery } from 'react-apollo';
import * as yup from 'yup';
import ErrorPage from '../../../core/ErrorPage';
import Link from '../../../core/Link';
import routes from '../../../core/routes';
import ProductGridSkeleton from '../../../skeletons/ProductGridSkeleton';
import SearchBar from '../../../templates/dashboard/SearchBar';
import PaginationWithState from '../../../templates/PaginationWithState';
import {
  ProductElementGridItem,
  WholesalerProductElement
} from '../../../templates/ProductElement';

export const WholesalerDashboardProductsQuery = {};

WholesalerDashboardProductsQuery.fragments = {
  productNode: gql`
    fragment WholesalerProduct on WholesalerProductNode {
      id
      brandProduct {
        id
        title
        thumbOverlayText
        thumb
        brand {
          id
          title
          publicUsername
        }
      }
      offeredPrice
      quantity
    }
  `
};

export const WHOLESALER_DASHBOARD_PRODUCTS = gql`
  query($wholesalerId: ID!, $phrase: String, $after: String) {
    wholesalerProducts(
      wholesalerId: $wholesalerId
      phrase: $phrase
      after: $after
      first: 20
    ) {
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      edges {
        node {
          ...WholesalerProduct
        }
      }
    }
  }
  ${WholesalerDashboardProductsQuery.fragments.productNode}
`;

const WholesalerDashboardProductGrid = ({
  wholesalerProductNodeEdges,
  wholesalerId
}) => {
  return (
    <Grid container>
      {wholesalerProductNodeEdges.map(wholesalerProduct => {
        const wholesalerProductNode = wholesalerProduct.node;
        return (
          <ProductElementGridItem
            key={wholesalerProduct.node.id}
            wholesalerProductNode={wholesalerProduct.node}
            wholesalerId={wholesalerId}>
            <Formik
              initialValues={{
                offeredPrice: wholesalerProductNode.offeredPrice,
                quantity: wholesalerProductNode.quantity
              }}
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
                // addWholesalerProduct({ variables: { ...values } });
                setSubmitting(false);
              }}>
              {formik => {
                const dirty = formik.dirty;
                return (
                  <Form>
                    <WholesalerProductElement
                      wholesalerProductNode={wholesalerProductNode}
                      wholesalerId={wholesalerId}
                      quantity={formik.values.quantity}
                      variant='wholesalerDashboard'></WholesalerProductElement>

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

                    {/* {error && (
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
                )} */}
                  </Form>
                );
              }}
            </Formik>
          </ProductElementGridItem>
        );
      })}
    </Grid>
  );
};

const WholesalerDashboardProducts = ({ wholesalerId, phrase }) => {
  const { loading, error, data, fetchMore } = useQuery(
    WHOLESALER_DASHBOARD_PRODUCTS,
    {
      variables: { wholesalerId }
    }
  );

  if (loading) return <ProductGridSkeleton></ProductGridSkeleton>;
  if (error) return <ErrorPage></ErrorPage>;

  if (data && data.wholesalerProducts.pageInfo.startCursor) {
    const {
      edges: wholesalerProductNodeEdges,
      pageInfo
    } = data.wholesalerProducts;
    return (
      <>
        <br></br>
        <center>
          <Button
            component={Link}
            to={reverse(`${routes.wholesaler.dashboard.addNewProducts}`, {
              wholesalerId
            })}>
            Add new products
          </Button>
        </center>
        <br></br>
        <SearchBar
          placeholder={`Search your products`}
          defaultPhrase={phrase}
          searchUrlBase={window.location.pathname}></SearchBar>
        <br></br>
        <WholesalerDashboardProductGrid
          wholesalerProductNodeEdges={wholesalerProductNodeEdges}
          wholesalerId={wholesalerId}></WholesalerDashboardProductGrid>

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
        You do not have any products.
      </Typography>
      <br></br>
      <center>
        <Typography
          variant='h5'
          component={Link}
          to={reverse(`${routes.wholesaler.dashboard.addNewProducts}`, {
            wholesalerId
          })}>
          Add Products
        </Typography>
      </center>
    </>
  );
};

export default WholesalerDashboardProducts;
