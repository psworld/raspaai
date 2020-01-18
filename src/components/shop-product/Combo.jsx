import {
  Button,
  Divider,
  Grid,
  ListItem,
  ListItemText,
  Typography
} from '@material-ui/core';
import { green } from '@material-ui/core/colors';
import { gql } from 'apollo-boost';
import { navigate } from 'gatsby';
import React from 'react';
import { useMutation, useQuery } from 'react-apollo';
import { CART_ITEMS } from '../../pages/cart';
import ErrorPage from '../core/ErrorPage';
import Link, { MenuItemLink } from '../core/Link';
import slugGenerator from '../core/slugGenerator';
import { VIEWER } from '../navbar/ToolBarMenu';
import SEO from '../seo';
import ShopProductSkeleton from '../skeletons/ShopProductSkeleton';
import ProductCollage from '../templates/dashboard/ProductCollage';
import { ReturnRefundPolicy } from '../templates/product-detail/ProductDetails';
import ProductThumb from '../templates/ProductThumb';
import { getIsStoreOpenNow, getDateFromHours } from '../core/utils';
import { format } from 'date-fns';

const COMBO = gql`
  query($comboId: ID!) {
    combo(id: $comboId) {
      id
      shop {
        id
        geometry {
          coordinates
        }
        properties {
          title
          publicUsername
          contactNumber
          address
          returnRefundPolicy
          openAt
          closeAt
          offDays
          isOpenToday
        }
      }
      offeredPrice
      name
      thumbs
      description
      isAvailable
      products {
        edges {
          node {
            id
            quantity
            shopProduct {
              id
              offeredPrice
              inStock
              product {
                id
                title
                mrp
                thumb
              }
            }
          }
        }
      }
    }
  }
`;

const ADD_COMBO_TO_CART = gql`
  mutation($comboId: ID!, $quantity: Int) {
    addComboToCart(input: { comboId: $comboId, quantity: $quantity }) {
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

const ComboItem = ({ shopUsername, comboProductNode }) => {
  const {
    quantity,
    shopProduct: {
      id: shopProductId,
      offeredPrice,
      inStock,
      product: { title: productTitle, mrp, thumb }
    }
  } = comboProductNode;

  const productSlug = slugGenerator(productTitle);

  return (
    <>
      <Grid item xs={3} sm={3} md={2}>
        <Link
          to={`/shop/${shopUsername}/product/${productSlug}/${shopProductId}`}>
          <ProductThumb src={thumb} title={productTitle}></ProductThumb>
        </Link>
      </Grid>
      <Grid item xs={9} sm={9} md={10}>
        <div style={{ paddingLeft: 6 }}>
          <Typography
            to={`/shop/${shopUsername}/product/${productSlug}/${shopProductId}`}
            component={Link}
            variant='h6'>
            {productTitle.substring(0, 60)}
            {productTitle.length > 60 && '...'}
          </Typography>
          <Typography
            style={inStock ? { color: green[900] } : { color: 'red' }}
            // component={"p"}
            variant='subtitle2'>
            {inStock ? 'In stock' : 'Out of stock'}
          </Typography>

          <Grid container>
            <Grid item xs={4} md={4}>
              <Typography>Qty: {quantity}</Typography>
            </Grid>
            {/* <Grid item xs={4} md={4}></Grid> */}
            <Grid item xs={8} md={8}>
              <ListItem>
                <Typography>
                  MRP:
                  <span style={{ color: green[800] }}>
                    &#x20b9;{mrp ? mrp : offeredPrice}
                  </span>
                </Typography>
              </ListItem>
            </Grid>
          </Grid>
        </div>
        <br></br>
      </Grid>
    </>
  );
};

const AddComboToCart = ({ comboId, viewer }) => {
  const [addComboToCart, { loading, error, data, called }] = useMutation(
    ADD_COMBO_TO_CART,
    {
      variables: { comboId, quantity: 1 },
      onCompleted: () => navigate('/cart'),
      update: (
        store,
        {
          data: {
            addComboToCart: { cartLine: newCartLine }
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

  return (
    <>
      <Button
        onClick={() =>
          viewer === null ? navigate('/signin') : addComboToCart()
        }
        disabled={loading}
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
    </>
  );
};

const Combo = ({ comboId }) => {
  const { loading, error, data } = useQuery(COMBO, {
    variables: { comboId }
  });

  // check if user is logged in
  const { data: viewerData } = useQuery(VIEWER);
  if (viewerData) {
    var { viewer } = viewerData;
  }

  if (loading) return <ShopProductSkeleton></ShopProductSkeleton>;
  if (error) {
    return <ErrorPage></ErrorPage>;
  }
  if (data) {
    const {
      name,
      description,
      offeredPrice,
      isAvailable,
      shop: {
        geometry: { coordinates },
        properties: {
          title: shopName,
          publicUsername: shopUsername,
          address,
          contactNumber,
          returnRefundPolicy,
          openAt,
          closeAt,
          offDays,
          isOpenToday
        }
      },
      products
    } = data.combo;

    const lat = coordinates[1];
    const lng = coordinates[0];

    // calculate total cost
    let totalCost = 0;

    products.edges.forEach(comboProduct => {
      const comboNode = comboProduct.node;
      const mrp = comboNode.shopProduct.product.mrp;
      const price = mrp ? mrp : comboNode.shopProduct.offeredPrice;
      totalCost += comboNode.quantity * price;
    });

    // store is open or not
    const isStoreOpenNow = getIsStoreOpenNow(
      openAt,
      closeAt,
      offDays,
      isOpenToday
    );
    const storeOpenTime = format(getDateFromHours(openAt), 'h:mm a');
    const storeCloseTime = format(getDateFromHours(closeAt), 'h:mm a');
    return (
      <Grid container>
        <SEO title={`${name} | ${shopName}`} description={description}></SEO>
        <Grid item xs={12} sm={6} md={4}>
          <ProductCollage
            thumbs={data.combo.thumbs}
            title={name}></ProductCollage>
        </Grid>

        <Grid
          item
          style={{ paddingLeft: 8, paddingRight: 8 }}
          xs={12}
          sm={6}
          md={6}>
          <ListItem style={{ paddingBottom: 1 }}>
            <Typography variant='h5' component='h1'>
              {name}
            </Typography>
          </ListItem>
          <ListItem style={{ marginTop: 0 }}>
            Sold By&ensp;
            <Link to={`/shop/${shopUsername}`}>{shopName}</Link>
          </ListItem>

          <Divider />
          <ListItem style={{ paddingBottom: 0 }}>
            &ensp;&ensp;
            <Typography variant='body2'>
              Total cost *:{' '}
              <span
                style={{
                  textDecorationLine: 'line-through',
                  color: '#FA8072'
                }}>
                &#x20b9; {totalCost}
              </span>
            </Typography>
          </ListItem>
          <ListItem>
            <Typography variant='caption' style={{ paddingBottom: 0 }}>
              *Cost of all the items in combo when bought at MRP
            </Typography>
          </ListItem>

          <ListItem style={{ marginTop: 0, marginBottom: 0, paddingTop: 0 }}>
            <Typography variant='body2'>
              Offered Price:{' '}
              <span style={{ color: 'green', fontSize: 'large' }}>
                {' '}
                <b>&#x20b9; {offeredPrice}</b>
              </span>
            </Typography>
          </ListItem>
          <ListItem style={{ paddingTop: 0 }}>
            &ensp;&ensp;&ensp;
            <Typography variant='body2'>
              You Save:{' '}
              <span style={{ color: '#4169E1' }}>
                &#x20b9; {totalCost - offeredPrice} (
                {Math.round(((totalCost - offeredPrice) / totalCost) * 100)}%)
              </span>
            </Typography>
          </ListItem>
          <Divider />
          <ListItem>
            <ListItemText
              style={{ color: isStoreOpenNow ? 'green' : 'red' }}
              primary={
                <MenuItemLink to={`/shop/${shopUsername}/about#active-time`}>
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
              style={{ color: isAvailable ? 'green' : 'red' }}
              primary={isAvailable ? 'Is available' : 'Not available'}
            />
          </ListItem>
          <Divider />
          <ListItem>
            <Typography>{description}</Typography>
          </ListItem>

          <Divider />
          <ListItem>
            <Typography variant='h6'>Items included in combo</Typography>
          </ListItem>
          <ListItem>
            <Grid container>
              {products.edges.map(comboProduct => {
                return (
                  <ComboItem
                    key={comboProduct.node.id}
                    shopUsername={shopUsername}
                    comboProductNode={comboProduct.node}></ComboItem>
                );
              })}
            </Grid>
          </ListItem>
        </Grid>
        <Grid
          style={{ paddingLeft: 8, paddingRight: 8, marginTop: 8 }}
          item
          xs={12}
          sm={12}
          md={2}>
          <AddComboToCart viewer={viewer} comboId={comboId}></AddComboToCart>

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
            href={`https://wa.me/?text=${name}%0aFor Rs.${offeredPrice}%0aYou save Rs.${totalCost -
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
        </Grid>
      </Grid>
    );
  }
};

export default Combo;
