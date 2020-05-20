import {
  Button,
  Divider,
  Grid,
  ListItem,
  Typography,
  Drawer,
  IconButton,
  Paper,
  Container,
  TextField
} from '@material-ui/core';
import { gql } from 'apollo-boost';
import { Formik } from 'formik';
import DeleteIcon from '@material-ui/icons/Delete';
import { reverse } from 'named-urls';
import React from 'react';
import { useQuery, useMutation } from 'react-apollo';
import * as yup from 'yup';
import ErrorPage from '../../../core/ErrorPage';
import Link from '../../../core/Link';
import Loading from '../../../core/Loading';
import routes from '../../../core/routes';
import singularOrPlural, { updatedDiff } from '../../../core/utils';
import { makeStyles } from '@material-ui/core/styles';
import ProductThumb from '../../../templates/ProductThumb';
import { green } from '@material-ui/core/colors';
import { navigate } from 'gatsby';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper
  },
  nested: {
    paddingLeft: theme.spacing(6)
  },
  spacing: {
    padding: theme.spacing(2)
  },
  thumb: {
    [theme.breakpoints.down('xs')]: {
      paddingBottom: theme.spacing(4)
    }
  },
  cartSummary: {
    backgroundColor: theme.palette.grey[200],
    minHeight: 100
  }
}));

export const ShopCartQuery = {
  fragments: {
    shopCartLineNode: gql`
      fragment shopCartLine on ShopCartLineNode {
        id
        wholesaler {
          id
          name
        }
        cartItems {
          edges {
            node {
              id
              quantity
              wholesalerProduct {
                id
                offeredPrice
                inStock
                quantity
                brandProduct {
                  id
                  title
                  thumbOverlayText
                  measurementUnit
                  thumb
                }
              }
            }
          }
        }
      }
    `
  }
};

export const SHOP_CART_LINES = gql`
  {
    shopCartLines {
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      edges {
        node {
          ...shopCartLine
        }
      }
    }
  }
  ${ShopCartQuery.fragments.shopCartLineNode}
`;

const MODIFY_SHOP_CART_ITEM = gql`
  mutation($shopCartItemId: ID!, $quantity: Int, $delete: Boolean) {
    modifyShopCartItem(
      input: {
        shopCartItemId: $shopCartItemId
        quantity: $quantity
        delete: $delete
      }
    ) {
      shopCartItem {
        id
        quantity
      }
    }
  }
`;

export const getMeasurementUnit = measurementUnit => {
  return measurementUnit ? measurementUnit : 'pc';
};

const ShopCartItem = ({
  shopCartItemNode,
  formik,
  classes,
  shopUsername,
  wholesalerNode,
  modifyCartItem,
  modifyCartItemProps
}) => {
  const {
    id: shopCartItemId,
    quantity,
    wholesalerProduct: {
      id: wholesalerProductId,
      offeredPrice,
      inStock,
      quantity: baseQuantity,
      brandProduct: { title, thumb, measurementUnit }
    }
  } = shopCartItemNode;

  const { id: wholesalerId } = wholesalerNode;

  const productUrl = reverse(
    `${routes.shop.dashboard.placeOrder.wholesalerProductDetails}`,
    { shopUsername, wholesalerId, wholesalerProductId }
  );

  const handleBlur = e => {
    formik.handleSubmit(e);
  };

  return (
    <>
      <Drawer open={modifyCartItemProps.loading}></Drawer>
      <Grid item xs={3} sm={3} md={2} className={classes.thumb}>
        <Link to={productUrl}>
          <ProductThumb src={thumb} title={title}></ProductThumb>
        </Link>
      </Grid>
      <Grid item xs={9} sm={9} md={10}>
        <div style={{ paddingLeft: 6 }}>
          <Typography to={productUrl} component={Link} variant='h6'>
            {title.substring(0, 60)}
            {title.length > 60 && '...'}
          </Typography>
          <Typography
            style={inStock ? { color: green[900] } : { color: 'red' }}
            // component={"p"}
            variant='subtitle2'>
            {inStock ? 'In stock' : 'Out of stock'}
          </Typography>
          <Grid container>
            <Grid item xs={2} md={2} style={{ paddingRight: 5 }}>
              <TextField
                name='quantity'
                type='number'
                value={formik.values.quantity}
                onChange={formik.handleChange}
                onBlur={handleBlur}></TextField>
            </Grid>

            <Grid item xs={2} md={2}>
              <Typography>{getMeasurementUnit(measurementUnit)}</Typography>
            </Grid>

            <Grid item xs={2} md={2}>
              <IconButton
                onClick={() =>
                  modifyCartItem({
                    variables: {
                      shopCartItemId,
                      delete: true
                    }
                  })
                }
                titleAccess='Delete'
                color='secondary'>
                <DeleteIcon></DeleteIcon>
              </IconButton>
            </Grid>
            <Grid item xs={6}>
              <ListItem>
                <Typography variant='h6'>
                  <span style={{ color: green[800] }}>
                    &#x20b9;{offeredPrice}
                  </span>{' '}
                  Per {baseQuantity} {getMeasurementUnit(measurementUnit)}
                </Typography>
              </ListItem>
            </Grid>
          </Grid>
        </div>
      </Grid>
    </>
  );
};

const Cart = ({ shopUsername }) => {
  const classes = useStyles();

  const { loading, error, data } = useQuery(SHOP_CART_LINES);

  const [modifyCartItem, modifyCartItemProps] = useMutation(
    MODIFY_SHOP_CART_ITEM
  );

  if (loading) return <Loading></Loading>;
  if (error) return <ErrorPage></ErrorPage>;
  if (data && data.shopCartLines && data.shopCartLines.edges.length !== 0) {
    const shopCartLines = data.shopCartLines;

    const noOfWholesalers = shopCartLines.edges.length;
    let offeredPriceTotal = 0;
    let totalNoOfItems = 0;
    return (
      <>
        <Grid container>
          <Grid item xs={12} md={9}>
            <Grid container>
              <Grid item xs={12}>
                <Typography
                  className={classes.spacing}
                  component='h1'
                  variant='h4'>
                  Shopping Cart
                </Typography>
                <Divider></Divider>
              </Grid>

              <Grid item xs={12}>
                {shopCartLines.edges.map(shopCartLine => {
                  const {
                    id: shopCartLineId,
                    wholesaler: { id: wholesalerId, name: wholesalerName },
                    wholesaler,
                    cartItems: { edges: cartItemNodeEdges }
                  } = shopCartLine.node;

                  let subTotal = 0;
                  let noOfItems = cartItemNodeEdges.length;
                  totalNoOfItems += noOfItems;

                  return (
                    <div key={shopCartLineId}>
                      <ListItem>
                        <Typography
                          component={Link}
                          to={reverse(
                            `${routes.shop.dashboard.placeOrder.wholesaler}`,
                            { shopUsername, wholesalerId }
                          )}
                          variant='h6'
                          style={{ paddingBottom: 0, marginBottom: 0 }}>
                          {wholesalerName}
                        </Typography>
                      </ListItem>

                      <Grid container>
                        {cartItemNodeEdges.map((shopCartItem, index) => {
                          const shopCartItemNode = shopCartItem.node;

                          // Measurement units will be same on wholesaler product, brand product, and cart item
                          subTotal +=
                            shopCartItemNode.quantity *
                            (shopCartItemNode.wholesalerProduct.offeredPrice /
                              shopCartItemNode.wholesalerProduct.quantity);

                          if (index + 1 === cartItemNodeEdges.length) {
                            offeredPriceTotal += subTotal;
                          }

                          let formikProps = {};

                          return (
                            <Formik
                              key={shopCartItemNode.id}
                              initialValues={{
                                quantity: shopCartItemNode.quantity
                              }}
                              validationSchema={yup.object().shape({
                                quantity: yup
                                  .number('Invalid number')
                                  .positive('Invalid quantity')
                                  .max(1000)
                                  .required('Required!')
                              })}
                              onSubmit={(values, { setSubmitting }) => {
                                const changes = updatedDiff(
                                  formikProps.initialValues,
                                  values
                                );
                                if (formikProps.dirty) {
                                  modifyCartItem({
                                    variables: {
                                      shopCartItemId: shopCartItemNode.id,
                                      ...changes
                                    }
                                  });
                                }
                                setSubmitting(false);
                              }}>
                              {formik => {
                                formikProps = formik;
                                return (
                                  <ShopCartItem
                                    shopUsername={shopUsername}
                                    formik={formik}
                                    classes={classes}
                                    shopCartItemNode={shopCartItemNode}
                                    wholesalerNode={wholesaler}
                                    modifyCartItem={modifyCartItem}
                                    modifyCartItemProps={
                                      modifyCartItemProps
                                    }></ShopCartItem>
                                );
                              }}
                            </Formik>
                          );
                        })}
                      </Grid>
                      <Typography variant='h6' align='right'>
                        Subtotal ({noOfItems} item
                        {singularOrPlural(noOfItems)}):{' '}
                        <span style={{ color: 'green' }}>
                          &#x20b9; {subTotal}
                        </span>
                      </Typography>
                      <Divider></Divider>
                    </div>
                  );
                })}
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} md={3}>
            <Typography className={classes.spacing} variant='h4'>
              Cart Summary
            </Typography>
            <Paper color='primary' className={classes.cartSummary}>
              <Container maxWidth='sm' className={classes.spacing}>
                <Typography variant='h5'>
                  Total ({totalNoOfItems} item
                  {singularOrPlural(totalNoOfItems)}):{' '}
                  <span style={{ color: 'green' }}>
                    <b>&#x20b9;{offeredPriceTotal}</b>
                  </span>
                </Typography>

                <Typography variant='h6'>
                  From {noOfWholesalers} Wholesalers
                  {singularOrPlural(noOfWholesalers)}
                </Typography>

                <br></br>
                <Button
                  variant='contained'
                  onClick={() =>
                    navigate(
                      reverse(`${routes.shop.dashboard.placeOrder.buyCart}`, {
                        shopUsername
                      })
                    )
                  }
                  disabled={loading}
                  style={{
                    backgroundColor: green[700],
                    color: 'white',
                    width: '100%'
                  }}>
                  <Typography>Proceed to buy</Typography>
                </Button>
              </Container>
            </Paper>
          </Grid>
        </Grid>
      </>
    );
  }
  return (
    <>
      <Typography style={{ marginTop: 10 }} variant='h5' align='center'>
        You do not have any item in your cart.
      </Typography>
      <br></br>
      <center>
        <Button
          color='primary'
          component={Link}
          to={reverse(`${routes.shop.dashboard.placeOrder.self}`, {
            shopUsername
          })}
          variant='contained'>
          Continue Shopping
        </Button>
      </center>
    </>
  );
};

export default Cart;
