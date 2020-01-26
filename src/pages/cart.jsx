/* eslint-disable no-redeclare */
import {
  Button,
  Container,
  Divider,
  Drawer,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  NativeSelect,
  Paper,
  Typography
} from '@material-ui/core';
import { blue } from '@material-ui/core/colors';
import green from '@material-ui/core/colors/green';
import ListItem from '@material-ui/core/ListItem';
import { makeStyles } from '@material-ui/core/styles';
import DeleteIcon from '@material-ui/icons/Delete';
import { Link, navigate } from 'gatsby';
import gql from 'graphql-tag';
import React from 'react';
import { useMutation, useQuery } from 'react-apollo';
import ErrorPage from '../components/core/ErrorPage';
import Loading from '../components/core/Loading';
import UserCheck from '../components/core/UserCheck';
import singularOrPlural, { slugGenerator } from '../components/core/utils';
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
        }
      }
      items {
        edges {
          node {
            id
            totalCost
            offeredPriceTotal
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

const CartItem = ({ cartItemNode, shopUsername, shopId, cartLineId }) => {
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
      product: { title, thumb, mrp },
      offeredPrice,
      inStock
    } = shopProduct;
  }

  const [qty, setQty] = React.useState(quantity);
  const [changeQty, { loading }] = useMutation(CHANGE_CART_ITEM_QTY);

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

  const handleChange = event => {
    setQty(event.target.value);
    changeQty({
      variables: {
        data: { cartItemId, newQuantity: event.target.value, shopId }
      }
    });
  };

  const productSlug = slugGenerator(title);

  const productUrl = isCombo
    ? `/shop/${shopUsername}/combo/${productSlug}/${comboId}`
    : `/shop/${shopUsername}/product/${productSlug}/${shopProductId}`;

  return (
    <>
      <SEO title='Shopping Cart' description='Shopping Cart'></SEO>
      <Drawer open={loading || deleteCartItemLoading}></Drawer>
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
            <Grid item xs={4} md={4}>
              <FormControl className={classes.formControl}>
                <NativeSelect
                  value={qty}
                  onChange={handleChange}
                  name='qty'
                  className={classes.selectEmpty}
                  inputProps={{
                    'aria-label': 'qty',
                    'start-adornment': (
                      <InputAdornment position='start'>Qty: </InputAdornment>
                    )
                  }}>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(key => (
                    <option key={key} value={key}>
                      {key}
                    </option>
                  ))}
                </NativeSelect>
              </FormControl>
            </Grid>
            <Grid item xs={4} md={4}>
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
            <Grid item xs={4}>
              <ListItem>
                <Typography variant='h6'>
                  <Typography variant='caption'>
                    <span style={{ textDecoration: 'line-through' }}>
                      &#x20b9;{mrp}
                    </span>{' '}
                  </Typography>
                  <span style={{ color: green[800] }}>
                    &#x20b9;{offeredPrice}
                  </span>
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

  let offeredPriceTotal = 0;
  let mrpTotal = 0;
  let totalNoOfItems = 0;

  data &&
    data.cartLines.forEach(cartLine => {
      cartLine.items.edges.forEach(cartItem => {
        const cartItemNode = cartItem.node;
        // const itemKey = cartItemNode.isCombo ? 'combo' : 'shopProduct';

        offeredPriceTotal += cartItemNode.offeredPriceTotal;
        mrpTotal += cartItemNode.totalCost;

        totalNoOfItems += cartItemNode.quantity;
      });
    });

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
                      let noOfItems = 0;
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
                            {cartItems.map(cartItem => {
                              const cartItemNode = cartItem.node;

                              subTotal += cartItemNode.offeredPriceTotal;
                              mrpSubTotal += cartItemNode.totalCost;
                              noOfItems += cartItemNode.quantity;
                              return (
                                <CartItem
                                  key={cartItemNode.id}
                                  shopId={shopId}
                                  cartLineId={cartLineId}
                                  shopUsername={shopUsername}
                                  cartItemNode={cartItemNode}></CartItem>
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
                      <Typography
                        variant='body1'
                        component='span'
                        style={{ textDecoration: 'line-through' }}>
                        &#x20b9;{mrpTotal}
                      </Typography>{' '}
                      <span style={{ color: 'green' }}>
                        <b>&#x20b9;{offeredPriceTotal}</b>
                      </span>
                    </Typography>

                    <Typography variant='h6'>
                      From {noOfShops} shop{singularOrPlural(noOfShops)}
                    </Typography>
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
                    <br></br>
                    <Button
                      variant='contained'
                      onClick={() => navigate('/buy/cart')}
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
