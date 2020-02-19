/* eslint-disable no-redeclare */
import {
  Button,
  Container,
  Divider,
  Drawer,
  Grid,
  IconButton,
  MenuItem,
  Paper,
  Typography,
  TextField as MuiTextField
} from '@material-ui/core';
import { blue } from '@material-ui/core/colors';
import green from '@material-ui/core/colors/green';
import ListItem from '@material-ui/core/ListItem';
import { makeStyles } from '@material-ui/core/styles';
import DeleteIcon from '@material-ui/icons/Delete';
import { Formik } from 'formik';
import { TextField } from 'formik-material-ui';
import { Link, navigate } from 'gatsby';
import gql from 'graphql-tag';
import React from 'react';
import { useMutation, useQuery } from 'react-apollo';
import * as yup from 'yup';
import ErrorPage from '../components/core/ErrorPage';
import Loading from '../components/core/Loading';
import UserCheck from '../components/core/UserCheck';
import singularOrPlural, {
  slugGenerator,
  updatedDiff
} from '../components/core/utils';
import Layout from '../components/layout';
import { VIEWER } from '../components/navbar/ToolBarMenu';
import SEO from '../components/seo';
import ProductCollage from '../components/templates/dashboard/ProductCollage';
import ProductThumb from '../components/templates/ProductThumb';

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

export const CART_ITEMS = gql`
  {
    cartLines {
      id
      shop {
        id
        geometry {
          coordinates
        }
        properties {
          title
          publicUsername
          address
          contactNumber
        }
      }
      items {
        edges {
          node {
            id
            totalCost
            offeredPriceTotal
            measurementUnit
            combo {
              id
              offeredPrice
              name
              thumbs
              isAvailable
              totalCost
            }
            shopProduct {
              id
              inStock
              offeredPrice
              product {
                id
                title
                thumb
                mrp
                measurementUnit
              }
            }
            quantity
            isCombo
          }
        }
      }
    }
  }
`;

const CHANGE_CART_ITEM_QTY = gql`
  mutation($data: ModifyCartItemInput!) {
    modifyCartItem(input: $data) {
      cartItem {
        id
        quantity
        totalCost
        offeredPriceTotal
        measurementUnit
      }
    }
  }
`;

const DELETE_CART_ITEM = gql`
  mutation($data: ModifyCartItemInput!) {
    modifyCartItem(input: $data) {
      clientMutationId
    }
  }
`;

const CartItem = ({
  cartItemNode,
  shopUsername,
  shopId,
  cartLineId,
  formik,
  changeQtyProps,
  noSaving
}) => {
  const {
    id: cartItemId,
    shopProduct,
    combo,
    quantity,
    isCombo
  } = cartItemNode;

  const classes = useStyles();

  if (isCombo) {
    var {
      id: comboId,
      offeredPrice,
      name: title,
      thumbs,
      totalCost: mrp,
      isAvailable: inStock
    } = combo;
  } else {
    var {
      id: shopProductId,
      product: { title, thumb, mrp, measurementUnit: baseMeasurementUnit },
      offeredPrice,
      inStock
    } = shopProduct;
  }

  const [deleteCartItem, { loading: deleteCartItemLoading }] = useMutation(
    DELETE_CART_ITEM,
    {
      variables: {
        data: { cartItemId, shopId }
      },
      update: (store, { data: { clientMutationId } }) => {
        const { cartLines } = store.readQuery({ query: CART_ITEMS });
        const { viewer } = store.readQuery({ query: VIEWER });

        const cartLine = cartLines.find(cartLine => cartLine.id === cartLineId);

        const newCartLineItemsEdges = cartLine.items.edges.filter(
          cartItem => cartItem.node.id !== cartItemId
        );

        const newCartLines = cartLines.filter(
          cartLine => cartLine.id !== cartLineId
        );

        const modifiedCartLine = {
          ...cartLine,
          items: { ...cartLine.items, edges: newCartLineItemsEdges }
        };
        if (newCartLineItemsEdges.length > 0) {
          store.writeQuery({
            query: CART_ITEMS,
            data: { cartLines: newCartLines.concat(modifiedCartLine) }
          });
        } else {
          store.writeQuery({
            query: CART_ITEMS,
            data: { cartLines: newCartLines }
          });
        }

        store.writeQuery({
          query: VIEWER,
          data: {
            viewer: {
              ...viewer,
              totalCartItems: viewer.totalCartItems - 1
            }
          }
        });
      }
    }
  );

  const productSlug = slugGenerator(title);

  const productUrl = isCombo
    ? `/shop/${shopUsername}/combo/${productSlug}/${comboId}`
    : `/shop/${shopUsername}/product/${productSlug}/${shopProductId}`;

  const handleBlur = e => {
    formik.handleSubmit(e);
  };

  const measurementUnitPossibilities = unit => {
    const mass = ['g', 'kg'];
    const count = ['piece', 'dozen'];

    if (!unit) return undefined;

    return mass.includes(unit)
      ? mass
      : count.includes(unit)
      ? count
      : undefined;
  };

  return (
    <>
      <SEO title='Shopping Cart' description='Shopping Cart'></SEO>
      <Drawer open={changeQtyProps.loading || deleteCartItemLoading}></Drawer>
      <Grid item xs={3} sm={3} md={2} className={classes.thumb}>
        <Link to={productUrl}>
          {isCombo ? (
            <ProductCollage thumbs={thumbs} title={title}></ProductCollage>
          ) : (
            <ProductThumb src={thumb} title={title}></ProductThumb>
          )}
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
              <MuiTextField
                name='quantity'
                type='number'
                value={formik.values.quantity}
                onChange={formik.handleChange}
                onBlur={handleBlur}></MuiTextField>
            </Grid>
            {formik.values.measurementUnit && (
              <Grid item xs={2} md={2}>
                <MuiTextField
                  value={formik.values.measurementUnit}
                  onChange={e => {
                    formik.handleChange(e);
                    formik.handleSubmit(e);
                  }}
                  onBlur={formik.handleBlur}
                  name='measurementUnit'
                  select>
                  {measurementUnitPossibilities(
                    formik.values.measurementUnit
                  ) &&
                    measurementUnitPossibilities(
                      formik.values.measurementUnit
                    ).map(unit => <MenuItem value={unit}>{unit}</MenuItem>)}
                </MuiTextField>
              </Grid>
            )}

            <Grid item xs={2} md={2}>
              <IconButton
                onClick={() =>
                  deleteCartItem({
                    variables: {
                      data: {
                        cartItemId,
                        shopId,
                        clientMutationId: cartItemId,
                        delete: true
                      }
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
                  {mrp && (
                    <Typography variant='caption'>
                      <span style={{ textDecoration: 'line-through' }}>
                        &#x20b9;{mrp}
                      </span>{' '}
                    </Typography>
                  )}
                  <span style={{ color: green[800] }}>
                    &#x20b9;{offeredPrice}
                  </span>
                  {baseMeasurementUnit && <> Per {baseMeasurementUnit}</>}
                </Typography>
              </ListItem>
            </Grid>
          </Grid>
        </div>
      </Grid>
    </>
  );
};

const Cart = () => {
  const classes = useStyles();

  const { loading, error, data } = useQuery(CART_ITEMS);

  const [changeQty, changeQtyProps] = useMutation(CHANGE_CART_ITEM_QTY);

  let offeredPriceTotal = 0;
  let mrpTotal = 0;
  let totalNoOfItems = 0;

  let allItemsInStock = true;

  data &&
    data.cartLines.forEach(cartLine => {
      totalNoOfItems += cartLine.items.edges.length;
      cartLine.items.edges.forEach(cartItem => {
        const cartItemNode = cartItem.node;

        offeredPriceTotal += cartItemNode.offeredPriceTotal;
        mrpTotal += cartItemNode.totalCost
          ? cartItemNode.totalCost
          : cartItemNode.offeredPriceTotal;
      });
    });

  const noSaving = offeredPriceTotal === mrpTotal;

  const noOfShops = data && data.cartLines && data.cartLines.length;

  return (
    <Layout>
      <SEO title='Shopping Cart' description='Shopping Cart'></SEO>
      <UserCheck nextUrl={`?next=/cart`} withViewerProp={false}>
        {loading && <Loading></Loading>}
        {error && <ErrorPage></ErrorPage>}
        {data && data.cartLines && data.cartLines.length !== 0 && (
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
                    {data.cartLines.map(cartLineNode => {
                      const {
                        id: cartLineId,
                        shop: {
                          id: shopId,
                          geometry: { coordinates },
                          properties: {
                            title: shopName,
                            publicUsername: shopUsername,
                            address
                          }
                        },
                        items: { edges: cartItems }
                      } = cartLineNode;

                      const lat = coordinates[1];
                      const lng = coordinates[0];

                      let mrpSubTotal = 0;
                      let subTotal = 0;
                      let noOfItems = cartItems.length;
                      return (
                        <div key={shopId}>
                          <ListItem>
                            <Typography
                              component={Link}
                              to={`/shop/${shopUsername}`}
                              variant='h6'
                              style={{ paddingBottom: 0, marginBottom: 0 }}>
                              {shopName}
                            </Typography>
                          </ListItem>
                          <ListItem style={{ paddingTop: 0, marginTop: 0 }}>
                            <Typography variant='body1'>
                              Address:{' '}
                              <a
                                href={`${process.env.GATSBY_G_MAP_URL}${lat},${lng}`}
                                target='_blank'
                                rel='noopener noreferrer'>
                                {address}
                              </a>
                            </Typography>
                          </ListItem>
                          <Grid container>
                            {cartItems.map((cartItem, index) => {
                              const cartItemNode = cartItem.node;

                              subTotal += cartItemNode.offeredPriceTotal;
                              mrpSubTotal += cartItemNode.totalCost;

                              if (
                                !cartItemNode.isCombo &&
                                !cartItemNode.shopProduct.inStock
                              ) {
                                allItemsInStock = false;
                              } else if (cartItems.length === index + 1) {
                                allItemsInStock = true;
                              }

                              let formikProps = {};

                              return (
                                <Formik
                                  initialValues={{
                                    quantity: cartItemNode.quantity,
                                    measurementUnit:
                                      cartItemNode.measurementUnit
                                  }}
                                  validationSchema={yup.object().shape({
                                    quantity: yup
                                      .number('Invalid number')
                                      .positive('Invalid quantity')
                                      .max(1000)
                                      .required('Required!'),
                                    measurementUnit: yup
                                      .string()
                                      .max(10)
                                      .nullable()
                                  })}
                                  onSubmit={(values, { setSubmitting }) => {
                                    const changes = updatedDiff(
                                      formikProps.initialValues,
                                      values
                                    );
                                    if (formikProps.dirty) {
                                      changeQty({
                                        variables: {
                                          data: {
                                            cartItemId: cartItemNode.id,
                                            shopId,
                                            ...changes
                                          }
                                        }
                                      });
                                    }
                                    setSubmitting(false);
                                  }}>
                                  {formik => {
                                    formikProps = formik;
                                    return (
                                      <CartItem
                                        key={cartItemNode.id}
                                        shopId={shopId}
                                        cartLineId={cartLineId}
                                        shopUsername={shopUsername}
                                        formik={formik}
                                        cartItemNode={cartItemNode}
                                        changeQtyProps={
                                          changeQtyProps
                                        }></CartItem>
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
                      {!noSaving && (
                        <Typography
                          variant='body1'
                          component='span'
                          style={{ textDecoration: 'line-through' }}>
                          &#x20b9;{mrpTotal}
                        </Typography>
                      )}{' '}
                      <span style={{ color: 'green' }}>
                        <b>&#x20b9;{offeredPriceTotal}</b>
                      </span>
                    </Typography>

                    <Typography variant='h6'>
                      From {noOfShops} shop{singularOrPlural(noOfShops)}
                    </Typography>
                    {!noSaving && (
                      <Typography variant='h6'>
                        You save{' '}
                        <span style={{ color: blue[600] }}>
                          &#x20b9;{mrpTotal - offeredPriceTotal}
                        </span>{' '}
                        (
                        {Math.round(
                          (100 / mrpTotal) * (mrpTotal - offeredPriceTotal)
                        )}
                        %)
                      </Typography>
                    )}
                    <br></br>
                    <Button
                      variant='contained'
                      onClick={() => navigate('/buy/cart')}
                      disabled={loading || !allItemsInStock}
                      style={{
                        backgroundColor: green[700],
                        color: 'white',
                        width: '100%'
                      }}>
                      <Typography>Proceed to buy</Typography>
                    </Button>
                    <br></br>
                    {!allItemsInStock && (
                      <Typography style={{ color: 'red' }}>
                        Remove all items that are out of stock from your cart
                      </Typography>
                    )}
                  </Container>
                </Paper>
              </Grid>
            </Grid>
          </>
        )}
        {data && data.cartLines && data.cartLines.length === 0 && (
          <>
            <Typography style={{ marginTop: 10 }} variant='h5' align='center'>
              You do not have any item in your cart.
            </Typography>
            <br></br>
            <center>
              <Button
                color='primary'
                component={Link}
                to='/'
                variant='contained'>
                Continue Shopping
              </Button>
            </center>
          </>
        )}
      </UserCheck>
    </Layout>
  );
};

export default Cart;
