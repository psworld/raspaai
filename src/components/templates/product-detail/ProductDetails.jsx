import React from 'react';

import Grid from '@material-ui/core/Grid';

import ListItem from '@material-ui/core/ListItem';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';

import Link from '../../core/Link';
import ProductImageCarousel from './ProductImageCarousel';
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Drawer
} from '@material-ui/core';
import gql from 'graphql-tag';
import { useMutation, useQuery } from 'react-apollo';
import { CART_ITEMS } from '../../../pages/cart';
import { VIEWER } from '../../navbar/ToolBarMenu';
import { green } from '@material-ui/core/colors';
import { navigate } from 'gatsby';
import { getJsonFriendlyString } from '../../shop/dashboard/components/ShopReturnRefundPolicy';

const ADD_TO_CART = gql`
  mutation($data: AddItemToCartInput!) {
    addItemToCart(input: $data) {
      cartItem {
        id
        item {
          id
          inStock
          shop {
            id
            properties {
              publicUsername
              title
            }
          }
          product {
            id
            title
            thumb
          }
          offeredPrice
        }
        quantity
      }
    }
  }
`;

const ProductDetails = props => {
  const {
    product,
    shopProduct,
    brandPublicUsername,
    shopPublicUsername,
    isShopProduct = false
  } = props;

  if (isShopProduct) {
    var {
      id: shopProductId,
      offeredPrice,
      inStock,
      shop: {
        geometry: { coordinates },
        properties: {
          title: shopName,
          address,
          contactNumber,
          returnRefundPolicy
        }
      }
    } = shopProduct;
  }

  const lat = isShopProduct && coordinates[1];
  const lng = isShopProduct && coordinates[0];

  const {
    title: productTitle,
    mrp,
    description,
    images: { edges: imagesNodeList },
    category: { name: categoryName },
    type: { name: typeName },
    brand: { title: brandName },
    longDescription,
    isAvailable,
    technicalDetails: technicalDetailsJsonString
  } = product;

  const technicalDetails = JSON.parse(technicalDetailsJsonString);

  const AddItemToCartInput = {
    shopProductId,
    quantity: 1
  };

  const { data: viewerData } = useQuery(VIEWER);
  if (viewerData) {
    var { viewer } = viewerData;
  }

  const [addItemToCart, { called, loading, error, data }] = useMutation(
    ADD_TO_CART,
    {
      variables: { data: AddItemToCartInput },
      onCompleted: () => navigate('/cart'),
      update: (
        store,
        {
          data: {
            addItemToCart: { cartItem: newCartItem }
          }
        }
      ) => {
        const { cartItems } = store.readQuery({ query: CART_ITEMS });

        const existing_cart_items = cartItems.find(
          cartItem => cartItem.id === newCartItem.id
        );
        if (existing_cart_items) {
        } else {
          store.writeQuery({
            query: CART_ITEMS,
            data: { cartItems: cartItems.concat(newCartItem) }
          });
        }
      }
    }
  );

  return (
    <>
      <Drawer open={loading}></Drawer>
      <Grid container>
        <Grid item xs={12} sm={6} md={4}>
          <ProductImageCarousel
            imagesNodeList={imagesNodeList}
            alt={productTitle}></ProductImageCarousel>
        </Grid>
        <Grid
          item
          style={{ paddingLeft: 8, paddingRight: 8 }}
          xs={12}
          sm={6}
          md={6}>
          <ListItem style={{ paddingBottom: 1 }}>
            <Typography variant={'h5'} component='h1'>
              {productTitle}
            </Typography>
          </ListItem>
          <ListItem style={{ marginTop: 0 }}>
            <Grid container>
              <Grid item xs={12} md={6}>
                By&ensp;
                <Link to={`/brand/${brandPublicUsername}`}>{brandName}</Link>
              </Grid>
              {isShopProduct && (
                <Grid item xs={12} md={6}>
                  Sold By&ensp;
                  <Link to={`/shop/${shopPublicUsername}`}>{shopName}</Link>
                </Grid>
              )}
            </Grid>
          </ListItem>
          <ListItem>
            In {categoryName} | {typeName}
          </ListItem>

          <Divider />
          <ListItem style={{ paddingBottom: 0 }}>
            &ensp;&ensp;&ensp;&ensp;&ensp;&ensp;
            <Typography variant='body2'>
              M.R.P:{' '}
              <span
                style={
                  isShopProduct
                    ? {
                        textDecorationLine: 'line-through',
                        color: '#FA8072'
                      }
                    : { color: '#FA8072' }
                }>
                &#x20b9; {mrp}
              </span>
            </Typography>
          </ListItem>
          {isShopProduct && (
            <>
              <ListItem style={{ marginTop: 0, marginBottom: 0 }}>
                <Typography variant='body2'>
                  Offered Price:{' '}
                  <span style={{ color: 'green', fontSize: 'x-large' }}>
                    {' '}
                    &#x20b9; {offeredPrice}
                  </span>
                </Typography>
              </ListItem>
              <ListItem style={{ paddingTop: 0 }}>
                &ensp;&ensp;&ensp;&ensp;
                <Typography variant='body2'>
                  You Save:{' '}
                  <span style={{ color: '#4169E1' }}>
                    &#x20b9; {mrp - offeredPrice} (
                    {Math.round(((mrp - offeredPrice) / mrp) * 100)}%)
                  </span>
                </Typography>
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText
                  style={{ color: inStock ? 'green' : 'red' }}
                  primary={inStock ? 'In stock' : 'Out of stock'}
                />
              </ListItem>
            </>
          )}
          <Divider />
          <ListItem>
            <Typography>{description}</Typography>
          </ListItem>
          <ListItem>
            <Typography>{longDescription}</Typography>
          </ListItem>

          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Technical</TableCell>
                <TableCell>Details</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell component='th' scope='row'>
                  title
                </TableCell>
                <TableCell>{productTitle}</TableCell>
              </TableRow>
              {Object.keys(technicalDetails).map((key, index) => {
                const value = technicalDetails[key];

                return (
                  <TableRow key={index}>
                    <TableCell component='th' scope='row'>
                      {key}
                    </TableCell>
                    <TableCell>{value}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Grid>
        {shopProduct ? (
          <Grid
            style={{ paddingLeft: 8, paddingRight: 8, marginTop: 8 }}
            item
            xs={12}
            sm={12}
            md={2}>
            <Button
              onClick={() =>
                viewer === null
                  ? navigate('/signin')
                  : !called
                  ? addItemToCart()
                  : null
              }
              variant='contained'
              color='primary'
              style={{ width: '100%' }}>
              <Typography align='center'>
                {loading ? 'Adding' : 'Add to cart'}
              </Typography>
            </Button>

            {data && (
              <Typography align='center' style={{ color: green[600] }}>
                Item added successfully to cart
              </Typography>
            )}
            <Divider></Divider>
            <Typography style={{ marginTop: 10 }} align='center' variant='h5'>
              Contact Details
            </Typography>
            <br></br>
            <Typography variant='h6'>Address</Typography>
            <Typography variant='body1'>
              <a
                href={`${process.env.GATSBY_G_MAP_URL}${lat},${lng}`}
                target='_blank'
                rel='noopener noreferrer'
                // style={{ color: 'inherit', textDecorationLine: 'none' }}
              >
                {address}
              </a>
            </Typography>
            <br></br>
            <Typography variant='body1'>
              <a
                href={`${process.env.GATSBY_G_MAP_URL}${lat},${lng}`}
                target='_blank'
                rel='noopener noreferrer'
                // style={{ color: 'inherit', textDecorationLine: 'none' }}
              >
                Click here to see address on map
              </a>
            </Typography>
            <br></br>
            <Typography variant='h6'>Phone</Typography>
            <Typography variant='body1'>
              <a href={`tel: +91${contactNumber}`}>{contactNumber}</a>
            </Typography>

            <br></br>
            <Typography variant='h6'>Share on</Typography>
            <a
              href={`https://wa.me/?text=${productTitle}%0aFor Rs.${offeredPrice}%0aYou save Rs.${mrp -
                offeredPrice}%0a${window.location.href}`}
              target='_blank'
              rel='noopener noreferrer'>
              Whats app
            </a>
            <br></br>
            <br></br>
            <Divider></Divider>
            <Typography style={{ marginTop: 10 }} align='center' variant='h5'>
              Return Refund Policy
            </Typography>
            <br></br>
            {JSON.parse(getJsonFriendlyString(returnRefundPolicy)).map(
              (policy, index) => (
                <ListItem>
                  <Typography variant='body1'>{policy}</Typography>
                </ListItem>
              )
            )}
            <br></br>
          </Grid>
        ) : (
          <></>
        )}
      </Grid>
    </>
  );
};

export default ProductDetails;
