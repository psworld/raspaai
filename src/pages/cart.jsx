import React from 'react';
import Layout from '../components/layout';
import { VIEWER } from '../components/navbar/ToolBarMenu';
import { useQuery, useMutation } from 'react-apollo';
import ErrorPage from '../components/core/ErrorPage';
import Loading from '../components/core/Loading';
import gql from 'graphql-tag';

import {
  Typography,
  Grid,
  Divider,
  FormControl,
  NativeSelect,
  InputAdornment,
  Drawer,
  IconButton,
  Paper,
  Container,
  Button
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import DeleteIcon from '@material-ui/icons/Delete';

import ProductThumb from '../components/templates/ProductThumb';
import { Link, navigate } from 'gatsby';
import slugGenerator from '../components/core/slugGenerator';

import green from '@material-ui/core/colors/green';
import SEO from '../components/seo';
import { blue } from '@material-ui/core/colors';
import UserCheck from '../components/core/UserCheck';

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
    cartItems {
      id
      item {
        id
        inStock
        product {
          id
          title
          thumb
          mrp
        }
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
        offeredPrice
      }
      quantity
      updated
    }
  }
`;

const CHANGE_CART_ITEM_QTY = gql`
  mutation($data: ModifyCartItemInput!) {
    modifyCartItem(input: $data) {
      cartItem {
        id
        quantity
        updated
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

const CartItem = ({ cartItem }) => {
  const {
    id: cartItemId,
    item: {
      id: shopProductId,
      product: { title, thumb, mrp },
      offeredPrice,
      inStock,
      shop: {
        properties: { publicUsername }
      }
    },
    quantity
  } = cartItem;

  const classes = useStyles();

  const [qty, setQty] = React.useState(quantity);
  const [changeQty, { loading }] = useMutation(CHANGE_CART_ITEM_QTY);

  const [deleteCartItem, { loading: deleteCartItemLoading }] = useMutation(
    DELETE_CART_ITEM,
    {
      variables: {
        data: { cartItemId }
      },
      update: (store, { data: { clientMutationId } }) => {
        const { cartItems } = store.readQuery({ query: CART_ITEMS });
        const { viewer } = store.readQuery({ query: VIEWER });

        const newCartItems = cartItems.filter(
          cartItem => cartItem.id !== cartItemId
        );

        store.writeQuery({
          query: CART_ITEMS,
          data: { cartItems: newCartItems }
        });

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
      variables: { data: { cartItemId, newQuantity: event.target.value } }
    });
  };

  const product_slug = slugGenerator(title);

  return (
    <>
      <SEO title='Shopping Cart' description='Shopping Cart'></SEO>
      <Drawer open={loading || deleteCartItemLoading}></Drawer>
      <Grid item xs={3} sm={3} md={2} className={classes.thumb}>
        <Link
          to={`/shop/${publicUsername}/product/${product_slug}/${shopProductId}`}>
          <ProductThumb src={thumb} alt={title} title={title}></ProductThumb>
        </Link>
      </Grid>
      <Grid item xs={9} sm={9} md={10}>
        <div style={{ paddingLeft: 6 }}>
          <Typography
            to={`/shop/${publicUsername}/product/${product_slug}/${shopProductId}`}
            component={Link}
            variant='h6'>
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

  const sortedCartItems = [];

  let shop_ids = [];

  let total = 0;
  let mrpTotal = 0;
  let totalNoOfItems = 0;

  data &&
    data.cartItems.forEach(cartItem => {
      shop_ids.push(cartItem.item.shop.id);
      total += cartItem.item.offeredPrice * cartItem.quantity;
      mrpTotal += cartItem.item.product.mrp * cartItem.quantity;
      totalNoOfItems += cartItem.quantity;
    });

  shop_ids = [...new Set(shop_ids)];

  shop_ids.forEach(shopId => {
    const shopCartItems = data.cartItems.filter(
      cartItem => cartItem.item.shop.id === shopId
    );
    sortedCartItems.push({
      shopId: shopId,
      shopName: shopCartItems[0].item.shop.properties.title,
      publicUsername: shopCartItems[0].item.shop.properties.publicUsername,
      address: shopCartItems[0].item.shop.properties.address,
      lat: shopCartItems[0].item.shop.geometry.coordinates[1],
      lng: shopCartItems[0].item.shop.geometry.coordinates[0],
      shopCartItems
    });
  });

  let noOfShops = shop_ids.length;

  return (
    <Layout>
      <UserCheck withViewerProp={false}>
        {loading && <Loading></Loading>}
        {error && <ErrorPage></ErrorPage>}
        {data && data.cartItems && sortedCartItems.length !== 0 && (
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
                    {sortedCartItems.map(shopCart => {
                      const {
                        shopName,
                        shopId,
                        shopCartItems,
                        publicUsername: shopUsername,
                        address,
                        lat,
                        lng
                      } = shopCart;
                      let mrpSubTotal = 0;
                      let subTotal = 0;
                      let items = 0;
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
                            {shopCartItems.map(cartItem => {
                              subTotal =
                                subTotal +
                                cartItem.item.offeredPrice * cartItem.quantity;
                              mrpSubTotal +=
                                cartItem.item.product.mrp * cartItem.quantity;
                              items = items + cartItem.quantity;
                              return (
                                <CartItem
                                  key={cartItem.id}
                                  cartItem={cartItem}></CartItem>
                              );
                            })}
                          </Grid>
                          <Typography variant='h6' align='right'>
                            Subtotal ({items} items):{' '}
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
                      Total ({totalNoOfItems} items):{' '}
                      <span style={{ textDecoration: 'line-through' }}>
                        &#x20b9;{mrpTotal}
                      </span>{' '}
                      <span style={{ color: 'green' }}>&#x20b9;{total}</span>
                    </Typography>

                    <Typography variant='h6'>From {noOfShops} shops</Typography>
                    <Typography variant='h6'>
                      You save{' '}
                      <span style={{ color: blue[600] }}>
                        &#x20b9;{mrpTotal - total}
                      </span>{' '}
                      ({Math.round((100 / mrpTotal) * (mrpTotal - total))}%)
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
        {data && data.cartItems && sortedCartItems.length === 0 && (
          <Typography variant='h2' align='center'>
            You do not have any item in your cart.
          </Typography>
        )}
      </UserCheck>
    </Layout>
  );
};

export default Cart;
