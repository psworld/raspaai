import React from 'react';
import gql from 'graphql-tag';
import { useQuery } from 'react-apollo';
import SEO from '../seo';
import ErrorPage from '../core/ErrorPage';
import ShopProductSkeleton from '../skeletons/ShopProductSkeleton';
import ProductDetails from '../templates/product-detail/ProductDetails';

export const PRODUCT = gql`
  query($productId: ID!) {
    product(id: $productId) {
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
      brand {
        id
        title
      }
      type {
        id
        name
      }
      longDescription
      isAvailable
      technicalDetails
      thumbOverlayText
    }
  }
`;

const BrandProductPage = props => {
  const { productId, brandUsername } = props;
  const { loading, error, data } = useQuery(PRODUCT, {
    variables: { productId }
  });
  if (loading) return <ShopProductSkeleton></ShopProductSkeleton>;
  if (error) {
    return <ErrorPage></ErrorPage>;
  }

  if (data && data.product) {
    const {
      product,
      product: { title, description }
    } = data;

    return (
      <>
        <SEO
          title={`${title} | ${brandUsername}`}
          description={description}></SEO>
        <ProductDetails
          product={product}
          brandPublicUsername={brandUsername}></ProductDetails>
      </>
    );
  }
};

export default BrandProductPage;
