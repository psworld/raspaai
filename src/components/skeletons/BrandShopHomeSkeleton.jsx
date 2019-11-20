import React from 'react';
import HeroImageSkeleton from './HeroImageSkeleton';
import ProductGridSkeleton from './ProductGridSkeleton';
import Skeleton from '@material-ui/lab/Skeleton';
import { Divider } from '@material-ui/core';

const BrandShopHomeSkeleton = () => {
  return (
    <>
      <HeroImageSkeleton></HeroImageSkeleton>
      <Skeleton height={40}></Skeleton>
      <Divider></Divider>
      <ProductGridSkeleton></ProductGridSkeleton>
    </>
  );
};

export default BrandShopHomeSkeleton;
