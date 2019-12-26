import React from 'react';
import Skeleton from '@material-ui/lab/Skeleton';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';

const ProductSkeleton = () => {
  return (
    <Grid item xs={6} sm={4} md={3} lg={2}>
      <Box width={'100%'} px={1} my={2}>
        <Skeleton width={'100%'} style={{ paddingTop: '125%' }}></Skeleton>

        {/* <Box paddingRight={2}> */}
        <Skeleton></Skeleton>

        <Skeleton width='60%'></Skeleton>
        <Skeleton width='30%'></Skeleton>
      </Box>
    </Grid>
  );
};

const ProductGridSkeleton = ({ numberOfProducts = 10 }) => (
  <Grid container>
    {[...Array(numberOfProducts).keys()].map(index => (
      <ProductSkeleton key={index}></ProductSkeleton>
    ))}
  </Grid>
);

export default ProductGridSkeleton;
