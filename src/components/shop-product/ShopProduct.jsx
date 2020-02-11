import React from 'react';
import { useQuery } from 'react-apollo';
import gql from 'graphql-tag';
import ErrorPage from '../core/ErrorPage';
import SEO from '../seo';

import ShopProductSkeleton from '../skeletons/ShopProductSkeleton';
import ProductDetails from '../templates/product-detail/ProductDetails';
import { Typography } from '@material-ui/core';
import Link from '../core/Link';

// const seeThisOnGoogleMaps = "https://www.google.co.in/maps/place/31.708324,76.931868/@31.7082658,76.931412,16z/"

const SHOP_PRODUCT = gql`
  query($shopProductId: ID!) {
    shopProduct(id: $shopProductId) {
      id
      product {
        id
        title
        mrp
        description
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
        brand {
          id
          title
          publicUsername
        }
        longDescription
        isAvailable
        technicalDetails
      }
      shop {
        id
        geometry {
          coordinates
        }
        properties {
          title
          address
          contactNumber
          heroImageThumb
          heroImage
          about
          returnRefundPolicy
          openAt
          closeAt
          offDays
          isOpenToday
          isActive
        }
      }
      offeredPrice
      inStock
    }
  }
`;

const ShopProductPage = props => {
  const { shopProductId, shopUsername } = props;

  const { loading, error, data } = useQuery(SHOP_PRODUCT, {
    variables: { shopProductId }
  });
  if (loading) return <ShopProductSkeleton></ShopProductSkeleton>;
  if (error) {
    return <ErrorPage></ErrorPage>;
    // return <p>{error.message}</p>;
  }
  if (data && data.shopProduct) {
    const {
      shopProduct: {
        id,
        product,
        offeredPrice,
        inStock,
        product: {
          title: productTitle,
          description,
          brand: { publicUsername: brandPublicUsername }
        },
        shop
      }
    } = data;

    const shopProduct = {
      id,
      offeredPrice,
      inStock,
      shop
    };
    return (
      <>
        <SEO
          title={`${productTitle} | ${shopUsername}`}
          description={description}></SEO>
        {/* <Container maxWidth={false} style={{ paddingLeft: 2 }}> */}
        <ProductDetails
          product={product}
          shopProduct={shopProduct}
          brandPublicUsername={brandPublicUsername}
          shopPublicUsername={shopUsername}
          isShopProduct={true}></ProductDetails>
        {/* </Container> */}
      </>
    );
  }

  return (
    <>
      <Typography variant='h5' align='center' style={{ marginTop: '10vh' }}>
        Sorry, product not found. This product might have been deleted by shop
        owner.
      </Typography>
      <br></br>
      <center>
        <Typography component={Link} to={`/shop/${shopUsername}`} variant='h6'>
          Check other products from {shopUsername}
        </Typography>
      </center>
    </>
  );
};

export default ShopProductPage;
