import { Button } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import gql from 'graphql-tag';
import { reverse } from 'named-urls';
import React, { useContext } from 'react';
import { useMutation } from 'react-apollo';
import { BRAND_PRODUCTS } from '../brand/BrandHomePage';
import Link from '../core/Link';
import routes from '../core/routes';
import { slugGenerator } from '../core/utils';
import ProductThumb from './ProductThumb';
import { shopDashboardStateContext } from '../shop/dashboard/ShopDashboardRouter';

const MODIFY_BRAND_PRODUCT = gql`
  mutation($data: ModifyBrandProductInput!) {
    modifyBrandProduct(input: $data) {
      product {
        id
        title
        mrp
        description
        longDescription
      }
    }
  }
`;

export const ProductElementGridItem = ({
  children,
  xs = 6,
  sm = 4,
  md = 3,
  lg = 2,
  px = 1,
  my = 1
}) => {
  return (
    <Grid item xs={xs} sm={sm} md={md} lg={lg}>
      <Box px={px} my={my}>
        {children}
      </Box>
    </Grid>
  );
};

export const SimpleProductElement = ({
  primaryLink,
  thumb,
  primaryText,
  thumbOverlayText,
  quantity,
  secondaryLink,
  secondaryText,
  mrp,
  offeredPrice
}) => {
  return (
    <>
      <Link to={primaryLink}>
        <ProductThumb
          src={thumb}
          title={primaryText}
          thumbOverlayText={thumbOverlayText}
          quantity={quantity}></ProductThumb>
        <Typography variant='subtitle1' color='textPrimary'>
          {primaryText}
        </Typography>
      </Link>
      <Typography display='block' variant='body1' color='primary'>
        <Link to={secondaryLink}>{secondaryText}</Link>
      </Typography>
      {mrp && (
        <Typography variant='body2'>
          M.R.P{' '}
          <span
            style={{
              // textDecorationLine: 'line-through',
              color: '#FA8072'
            }}>
            {' '}
            &#8377; {mrp}
          </span>
        </Typography>
      )}
      {offeredPrice && (
        <Typography variant='h6' style={{ color: 'green' }}>
          <b>&#8377; {offeredPrice}</b>
        </Typography>
      )}
    </>
  );
};

export const WholesalerProductElement = ({
  wholesalerProductNode,
  wholesalerId,
  quantity: newQuantity,
  wholesaler,
  variant = 'default'
}) => {
  const shopContext = useContext(shopDashboardStateContext);

  const getVariantProperties = variant => {
    var {
      id: wholesalerProductId,
      offeredPrice,
      brandProduct: { title: productName, thumb, thumbOverlayText, brand }
    } = wholesalerProductNode;

    const base = {
      primaryText: productName,
      thumb,
      thumbOverlayText,
      offeredPrice
    };

    let variantProperties = {
      ...base,
      primaryLink: reverse(`${routes.wholesaler.home.product}`, {
        wholesalerId,
        productName,
        wholesalerProductId
      }),

      secondaryLink: reverse(`${routes.wholesaler.home}`, { wholesalerId }),
      quantity: wholesalerProductNode.quantity
    };

    if (variant === 'wholesalerDashboard') {
      variantProperties = {
        ...variantProperties,
        secondaryText: (
          <>
            By <span style={{ color: '#5050FF' }}>{brand.title}</span>
          </>
        ),
        secondaryLink: reverse(`${routes.brand.home}`, {
          brandUsername: brand.publicUsername
        }),
        quantity: newQuantity
      };
    }

    if (variant === 'shopDashboard') {
      variantProperties = {
        ...variantProperties,
        primaryLink: reverse(
          `${routes.shop.dashboard.placeOrder.wholesalerProductDetails}`,
          {
            shopUsername: shopContext.shopUsername,
            wholesalerId,
            wholesalerProductId
          }
        ),
        secondaryText: (
          <span style={{ color: '#5050FF' }}>{wholesaler.name}</span>
        ),
        secondaryLink: reverse(
          `${routes.shop.dashboard.placeOrder.wholesaler}`,
          {
            shopUsername: shopContext.shopUsername,
            wholesalerId,
            wholesalerProductId
          }
        )
      };
    }

    return variantProperties;
  };

  const {
    primaryLink,
    primaryText,
    secondaryLink,
    secondaryText,
    quantity,
    offeredPrice,
    thumb,
    thumbOverlayText
  } = getVariantProperties(variant);

  return (
    <SimpleProductElement
      primaryLink={primaryLink}
      primaryText={primaryText}
      thumb={thumb}
      secondaryLink={secondaryLink}
      secondaryText={secondaryText}
      thumbOverlayText={thumbOverlayText}
      quantity={quantity}
      offeredPrice={offeredPrice}></SimpleProductElement>
  );
};

export const BrandProductElement = ({ productNode, quantity }) => {
  const {
    id: productId,
    title: productName,
    thumb,
    thumbOverlayText,
    mrp,
    brand: { title: brandName, publicUsername: brandUsername }
  } = productNode;

  const productSlug = slugGenerator(productName);
  const brandProductLink = `/brand/${brandUsername}/product/${productSlug}/${productId}`;
  const brandLink = `/brand/${brandUsername}`;

  return (
    <SimpleProductElement
      primaryLink={brandProductLink}
      primaryText={productName}
      thumb={thumb}
      secondaryLink={brandLink}
      thumbOverlayText={thumbOverlayText}
      quantity={quantity}
      secondaryText={
        <>
          By <span style={{ color: '#5050FF' }}>{brandName}</span>
        </>
      }
      mrp={mrp}></SimpleProductElement>
  );
};

const ProductElement = ({
  id,
  title,
  thumb,
  thumbOverlayText,
  quantity,
  publicUsername,
  offeredPrice,
  shopName,
  brandName,
  mrp,
  isBrand,
  isBrandDashboardProduct = false,
  to = false,
  byLink = false,
  by = false
}) => {
  const productSlug = slugGenerator(title);

  const shopProduct = `/shop/${publicUsername}/product/${productSlug}/${id}`;
  const brandProduct = `/brand/${publicUsername}/product/${productSlug}/${id}`;

  // modify product
  const [deleteProduct, { loading, error, data }] = useMutation(
    MODIFY_BRAND_PRODUCT,
    {
      variables: {
        data: { productId: id, action: 'delete' }
      },
      update(store) {
        const { brandProducts } = store.readQuery({
          query: BRAND_PRODUCTS,
          variables: { publicBrandUsername: publicUsername, withBrand: false }
        });
        const newEdges = brandProducts.edges.filter(e => e.node.id !== id);

        store.writeQuery({
          query: BRAND_PRODUCTS,
          variables: { publicBrandUsername: publicUsername, withBrand: false },
          data: { brandProducts: { ...brandProducts, edges: newEdges } }
        });
      }
    }
  );

  const lengthLimit = 60;

  return (
    <Grid item xs={6} sm={4} md={3} lg={2}>
      <Box px={1} my={1}>
        <Link to={to ? to : isBrand ? brandProduct : shopProduct}>
          <ProductThumb
            src={thumb}
            title={title}
            thumbOverlayText={thumbOverlayText}
            quantity={quantity}></ProductThumb>
          <Typography title={title} variant='subtitle1' color='textPrimary'>
            {title.substring(0, lengthLimit)}
            {title.length > lengthLimit && '...'}
          </Typography>
        </Link>
        <Typography display='block' variant='body1' color='primary'>
          <Link
            to={
              byLink
                ? byLink
                : isBrand
                ? `/brand/${publicUsername}`
                : `/shop/${publicUsername}`
            }>
            {by ? by : isBrand ? brandName : shopName}
          </Link>
        </Typography>
        <Typography variant='h6' style={{ color: 'green' }}>
          {isBrand ? (
            mrp && <>M.R.P &#8377; {mrp}</>
          ) : (
            <b>&#8377; {offeredPrice}</b>
          )}
        </Typography>
        {isBrandDashboardProduct && (
          <Grid container>
            <Grid item xs={6}>
              <Button
                component={Link}
                to={`/dashboard/brand/${publicUsername}/product/edit/${productSlug}/${id}`}
                color='primary'
                variant='outlined'>
                Edit
              </Button>
            </Grid>
            <Grid item xs={6}>
              <Button
                onClick={deleteProduct}
                disabled={loading}
                color='secondary'
                variant='outlined'>
                Delete
              </Button>
            </Grid>
          </Grid>
        )}
      </Box>
    </Grid>
  );
};

export default ProductElement;
