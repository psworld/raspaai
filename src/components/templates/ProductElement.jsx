import React from 'react';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

import slugGenerator from '../core/slugGenerator';
import Link from '../core/Link';
import { Button } from '@material-ui/core';
import ProductThumb from './ProductThumb';
import gql from 'graphql-tag';
import { useMutation } from 'react-apollo';
import { BRAND_PRODUCTS } from '../brand/BrandHomePage';

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

const ProductElement = ({
  id,
  title,
  thumb,
  publicUsername,
  offeredPrice,
  shopName,
  brandName,
  mrp,
  isBrand,
  isBrandDashboardProduct = false
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
        <Link to={isBrand ? brandProduct : shopProduct}>
          <ProductThumb src={thumb} title={title} alt={title}></ProductThumb>
          <Typography title={title} variant='body2' color='textPrimary'>
            {title.substring(0, lengthLimit)}
            {title.length > lengthLimit && '...'}
          </Typography>
        </Link>
        <Typography display='block' variant='caption' color='primary'>
          <Link
            to={
              isBrand ? `/brand/${publicUsername}` : `/shop/${publicUsername}`
            }>
            {isBrand ? brandName : shopName}
          </Link>
        </Typography>
        <Typography variant='h6' style={{ color: 'green' }}>
          {isBrand ? <>M.R.P &#8377; {mrp}</> : <>&#8377; {offeredPrice}</>}
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
