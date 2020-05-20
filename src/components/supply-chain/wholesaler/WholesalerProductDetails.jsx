import {
  Button,
  Divider,
  Drawer,
  Grid,
  ListItem,
  Typography
} from '@material-ui/core';
import { green } from '@material-ui/core/colors';
import { gql } from 'apollo-boost';
import { navigate } from 'gatsby';
import { reverse } from 'named-urls';
import React from 'react';
import { useMutation, useQuery } from 'react-apollo';
import ErrorPage from '../../core/ErrorPage';
import Link from '../../core/Link';
import Loading from '../../core/Loading';
import routes from '../../core/routes';
import { VIEWER } from '../../navbar/ToolBarMenu';
import {
  ShopCartQuery,
  SHOP_CART_LINES
} from '../../shop/dashboard/shop-orders/Cart';
import MainFeaturedPost from '../../templates/MainFeaturedPost';
import {
  InOutStock,
  ProductDescriptions,
  ProductTechnicalDetails
} from '../../templates/product-detail/ProductDetails';
import ProductImageCarousel from '../../templates/product-detail/ProductImageCarousel';

const WHOLESALER_PRODUCT_DETAILS = gql`
  query($wholesalerProductId: ID!) {
    wholesalerProduct(id: $wholesalerProductId) {
      id
      wholesaler {
        id
        name
        contactNumber
        image
        isActive
        address
      }
      offeredPrice
      quantity
      inStock
      brandProduct {
        id
        title
        thumbOverlayText
        measurementUnit
        brand {
          id
          publicUsername
          title
        }
        images {
          edges {
            node {
              id
              image
              position
            }
          }
        }
        category {
          id
          name
        }
        type {
          id
          name
        }
        description
        longDescription
        technicalDetails
      }
    }
  }
`;

const ADD_ITEM_TO_SHOP_CART = gql`
  mutation($data: AddWholesalerProductToShopCartInput!) {
    addWholesalerProductToShopCart(input: $data) {
      shopCartLine {
        ...shopCartLine
      }
    }
  }
  ${ShopCartQuery.fragments.shopCartLineNode}
`;

const WholesalerProductDetails = ({ wholesalerProductId, shopUsername }) => {
  const { loading, error, data } = useQuery(WHOLESALER_PRODUCT_DETAILS, {
    variables: { wholesalerProductId }
  });

  const { data: viewerData } = useQuery(VIEWER);
  if (viewerData) {
    var { viewer } = viewerData;
  }

  const [addItemToCart, addItemToCartProps] = useMutation(
    ADD_ITEM_TO_SHOP_CART,
    {
      variables: { data: { wholesalerProductId } },
      onCompleted: () => {
        const shopCartLink = reverse(`${routes.shop.dashboard.cart}`, {
          shopUsername
        });
        navigate(shopCartLink);
      },
      update: (
        store,
        {
          data: {
            addWholesalerProductToShopCart: {
              shopCartLine: newShopCartLineNode
            }
          }
        }
      ) => {
        const { shopCartLines } = store.readQuery({ query: SHOP_CART_LINES });

        const existingCartLine = shopCartLines.edges.find(
          cartLine => cartLine.node.id === newShopCartLineNode.id
        );
        if (existingCartLine) {
          // Apollo will automatically update the cache
        } else {
          store.writeQuery({
            query: SHOP_CART_LINES,
            data: {
              shopCartLines: {
                ...shopCartLines,
                edges: shopCartLines.edges.concat({ node: newShopCartLineNode })
              }
            }
          });
        }
      }
    }
  );
  if (loading) return <Loading></Loading>;
  if (error) return <ErrorPage></ErrorPage>;

  if (data) {
    const {
      id: wholesalerProductId,
      wholesaler: {
        name: wholesalerName,
        contactNumber,
        image: wholesalerImage,
        isActive,
        address
      },
      offeredPrice,
      quantity,
      inStock,
      brandProduct: {
        id: brandProductId,
        title: productTitle,
        brand: { publicUsername: brandUsername, title: brandName },
        thumbOverlayText,
        measurementUnit,
        images: { edges: imagesNodeList },
        category: { name: categoryName },
        type: { name: typeName },
        description,
        longDescription,
        technicalDetails: technicalDetailsJsonString
      }
    } = data.wholesalerProduct;

    const technicalDetails = JSON.parse(technicalDetailsJsonString);

    return (
      <>
        <Drawer open={addItemToCartProps.loading}></Drawer>
        <Grid container>
          <Grid item xs={12} sm={6} md={4}>
            <ProductImageCarousel
              imagesNodeList={imagesNodeList}
              alt={productTitle}
              thumbOverlayText={thumbOverlayText}></ProductImageCarousel>
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
                  <Link to={`/brand/${brandUsername}`}>{brandName}</Link>
                </Grid>

                <Grid item xs={12} md={6}>
                  Sold By&ensp;{wholesalerName}
                </Grid>
              </Grid>
            </ListItem>
            <ListItem>
              In {categoryName} | {typeName}
            </ListItem>

            <Divider />

            <ListItem style={{ marginTop: 0, marginBottom: 0 }}>
              <Typography variant='h6'>
                Offered Price:{' '}
                <span style={{ color: 'green', fontSize: 'x-large' }}>
                  {' '}
                  &#x20b9;{offeredPrice}
                </span>{' '}
                <b style={{ fontSize: 'large' }}>
                  Per {quantity}
                  {measurementUnit ? measurementUnit : ' pc'}
                </b>
              </Typography>
            </ListItem>

            <Divider />
            <InOutStock inStock={inStock}></InOutStock>
            <Divider />
            {/* {isActive ? (
              <>
                <ShopActiveTime shopProperties={shopProperties}></ShopActiveTime>
              </>
            ) : (
              <InactiveShop
                contactNumber={contactNumber}
                wholesalerName={wholesalerName}
                shopUsername={shopPublicUsername}></InactiveShop>
            )} */}

            <Divider />
            <ProductDescriptions
              description={description}
              longDescription={longDescription}></ProductDescriptions>

            <ProductTechnicalDetails
              productTitle={productTitle}
              technicalDetails={technicalDetails}></ProductTechnicalDetails>
          </Grid>

          <Grid
            style={{ paddingLeft: 8, paddingRight: 8, marginTop: 8 }}
            item
            xs={12}
            sm={12}
            md={2}>
            <Button
              onClick={() =>
                viewer === null
                  ? navigate(`/signin/?next=${window.location.pathname}`)
                  : !addItemToCartProps.called
                  ? addItemToCart()
                  : null
              }
              disabled={addItemToCartProps.loading || !inStock}
              variant='contained'
              color='primary'
              style={{ width: '100%' }}>
              <Typography align='center'>
                {addItemToCartProps.loading ? 'Adding' : 'Add to cart'}
              </Typography>
            </Button>
            {addItemToCartProps.data && (
              <Typography align='center' style={{ color: green[600] }}>
                Item added successfully to cart
              </Typography>
            )}
            <br></br>
            <Divider></Divider>
            <br></br>

            <Typography style={{ marginTop: 10 }} align='center' variant='h5'>
              {/* <Link to={`/shop/${shopPublicUsername}`}>{wholesalerName}</Link> */}
            </Typography>
            <br></br>
            <MainFeaturedPost
              img={wholesalerImage}
              title={wholesalerName}></MainFeaturedPost>
            {/* <Typography>{about}</Typography> */}
            <Typography style={{ marginTop: 10 }} align='center' variant='h5'>
              Contact Details
            </Typography>
            {/* <br></br>
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
            </Typography> */}
            <br></br>
            <Typography variant='h6'>Phone</Typography>
            <Typography variant='body1'>
              <a href={`tel: +91${contactNumber}`}>{contactNumber}</a>
            </Typography>
          </Grid>
        </Grid>
      </>
    );
  }
};

export default WholesalerProductDetails;
