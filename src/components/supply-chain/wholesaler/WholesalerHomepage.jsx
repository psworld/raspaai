import { Grid, Typography } from '@material-ui/core';
import { gql } from 'apollo-boost';
import React from 'react';
import { useQuery } from 'react-apollo';
import ErrorPage from '../../core/ErrorPage';
import SEO from '../../seo';
import BrandShopHomeSkeleton from '../../skeletons/BrandShopHomeSkeleton';
import ProductGridSkeleton from '../../skeletons/ProductGridSkeleton';
import MainFeaturedPost from '../../templates/MainFeaturedPost';
import {
  ProductElementGridItem,
  WholesalerProductElement
} from '../../templates/ProductElement';

const WHOLESALER = gql`
  query($wholesalerId: ID!) {
    wholesaler(id: $wholesalerId) {
      id
      name
      image
      isActive
      address
    }
  }
`;

const WHOLESALER_PRODUCTS = gql`
  query($wholesalerId: ID!, $phrase: String) {
    wholesalerProducts(
      wholesalerId: $wholesalerId
      phrase: $phrase
      first: 20
    ) {
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      edges {
        node {
          id
          brandProduct {
            id
            title
            thumb
            measurementUnit
            thumbOverlayText
          }
          offeredPrice
          quantity
        }
      }
    }
  }
`;

const WholesalerProducts = ({ wholesaler, phrase, variant }) => {
  const { loading, error, data } = useQuery(WHOLESALER_PRODUCTS, {
    variables: { wholesalerId: wholesaler.id, phrase }
  });
  if (loading) return <ProductGridSkeleton></ProductGridSkeleton>;
  if (error) return <ErrorPage></ErrorPage>;

  if (data && data.wholesalerProducts.pageInfo.startCursor) {
    const wholesalerProductNodeEdges = data.wholesalerProducts.edges;
    return (
      <Grid container>
        {wholesalerProductNodeEdges.map(wholesalerProduct => {
          return (
            <ProductElementGridItem key={wholesalerProduct.node.id}>
              <WholesalerProductElement
                wholesalerProductNode={wholesalerProduct.node}
                wholesalerId={wholesaler.id}
                wholesaler={wholesaler}
                variant={variant}></WholesalerProductElement>
            </ProductElementGridItem>
          );
        })}
      </Grid>
    );
  }

  if (phrase) {
    return (
      <Typography align='center' style={{ margin: 4 }} variant='h5'>
        No results found for - <b>{phrase}</b>
      </Typography>
    );
  }
  return (
    <div style={{ marginBottom: '10vh' }}>
      <Typography variant='h5' style={{ marginTop: 20 }} align='center'>
        This wholesaler do not have any products right now.
      </Typography>
    </div>
  );
};

const WholesalerHomepage = ({ wholesalerId, variant }) => {
  const { loading, error, data } = useQuery(WHOLESALER, {
    variables: { wholesalerId }
  });
  if (loading) return <BrandShopHomeSkeleton></BrandShopHomeSkeleton>;

  if (error) return <ErrorPage></ErrorPage>;

  if (data && data.wholesaler) {
    const { name, about, image } = data.wholesaler;
    return (
      <>
        <SEO title={name} description={about}></SEO>
        <MainFeaturedPost img={image} title={name}></MainFeaturedPost>
        <Typography
          style={{ margin: (5, 0, 5, 0) }}
          variant='h4'
          align='center'>
          {name}
        </Typography>
        <WholesalerProducts
          wholesaler={data.wholesaler}
          variant={variant}></WholesalerProducts>
      </>
    );
  }
};

export default WholesalerHomepage;
