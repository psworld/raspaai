import {
  Button,
  Drawer,
  List,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow
} from '@material-ui/core';
import { green } from '@material-ui/core/colors';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import { navigate } from 'gatsby';
import gql from 'graphql-tag';
import React from 'react';
import { useMutation, useQuery } from 'react-apollo';
import { CART_ITEMS } from '../../../pages/cart';
import Link, { MenuItemLink } from '../../core/Link';
import { getIsStoreOpenNow, getDateFromHours } from '../../core/utils';
import { VIEWER } from '../../navbar/ToolBarMenu';
import ProductImageCarousel from './ProductImageCarousel';
import { InactiveShop } from '../../shop/ShopHomePage';
import { format } from 'date-fns';
import MainFeaturedPost from '../MainFeaturedPost';

const ADD_TO_CART = gql`
  mutation($data: AddItemToCartInput!) {
    addItemToCart(input: $data) {
      cartLine {
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
  }
`;

export const ReturnRefundPolicy = ({ returnRefundPolicy }) => (
  <List>
    <Typography style={{ marginTop: 10 }} align='center' variant='h5'>
      Return Refund Policy
    </Typography>
    <ListItem style={{ paddingTop: 0, marginTop: 5 }}>
      <Typography variant='body2'>* Not applicable on food items</Typography>
    </ListItem>
    {JSON.parse(returnRefundPolicy).map((policy, index) => (
      <ListItem key={index}>
        <Typography variant='body1'>{policy}</Typography>
      </ListItem>
    ))}
  </List>
);

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
          heroImageThumb,
          heroImage,
          address,
          contactNumber,
          returnRefundPolicy,
          openAt,
          closeAt,
          offDays,
          isOpenToday,
          isActive
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

  // store is open or not
  const isStoreOpenNow =
    isShopProduct && getIsStoreOpenNow(openAt, closeAt, offDays, isOpenToday);

  const storeOpenTime =
    isShopProduct && format(getDateFromHours(openAt), 'h:mm a');
  const storeCloseTime =
    isShopProduct && format(getDateFromHours(closeAt), 'h:mm a');

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
            addItemToCart: { cartLine: newCartLine }
          }
        }
      ) => {
        const { cartLines } = store.readQuery({ query: CART_ITEMS });

        const existingCartLine = cartLines.find(
          cartLine => cartLine.id === newCartLine.id
        );
        if (existingCartLine) {
          // Apollo will automatically update the cache
        } else {
          store.writeQuery({
            query: CART_ITEMS,
            data: { cartLines: cartLines.concat(newCartLine) }
          });
        }
      }
    }
  );

  const offeredPriceUnit = technicalDetails['Offered Price'];

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
            <Typography variant='h5' component='h1'>
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
          {mrp && (
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
          )}
          {isShopProduct && (
            <>
              <ListItem style={{ marginTop: 0, marginBottom: 0 }}>
                <Typography variant='body2'>
                  Offered Price:{' '}
                  <span style={{ color: 'green', fontSize: 'x-large' }}>
                    {' '}
                    &#x20b9;{offeredPrice}
                  </span>{' '}
                  <b> {offeredPriceUnit}</b>
                </Typography>
              </ListItem>
              {mrp && (
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
              )}
              <Divider />
              {isActive ? (
                <>
                  <ListItem>
                    <ListItemText
                      style={{ color: isStoreOpenNow ? 'green' : 'red' }}
                      primary={
                        <MenuItemLink
                          to={`/shop/${shopPublicUsername}/about#active-time`}>
                          {isStoreOpenNow ? 'Store is open' : 'Store is closed'}
                        </MenuItemLink>
                      }
                    />
                  </ListItem>
                  <ListItem>Opens at {storeOpenTime}</ListItem>
                  <ListItem></ListItem>
                  <ListItem>Closes at {storeCloseTime}</ListItem>
                  <ListItem>
                    <ListItemText
                      style={{ color: inStock ? 'green' : 'red' }}
                      primary={inStock ? 'In stock' : 'Out of stock'}
                    />
                  </ListItem>
                </>
              ) : (
                <InactiveShop
                  contactNumber={contactNumber}
                  shopName={shopName}
                  shopUsername={shopPublicUsername}></InactiveShop>
              )}
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
                  Title
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
        {shopProduct && isActive ? (
          <Grid
            style={{ paddingLeft: 8, paddingRight: 8, marginTop: 8 }}
            item
            xs={12}
            sm={12}
            md={2}>
            {mrp && (
              <>
                <Button
                  onClick={() =>
                    viewer === null
                      ? navigate(`/signin/?next=${window.location.pathname}`)
                      : !called
                      ? addItemToCart()
                      : null
                  }
                  disabled={loading || !inStock}
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
                <br></br>
                <Divider></Divider>
                <br></br>
              </>
            )}

            <Typography style={{ marginTop: 10 }} align='center' variant='h5'>
              Shop
            </Typography>
            <MainFeaturedPost
              img={heroImageThumb}
              toImgSrc={heroImage}
              title={shopName}></MainFeaturedPost>
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

            <ReturnRefundPolicy
              returnRefundPolicy={returnRefundPolicy}></ReturnRefundPolicy>
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
