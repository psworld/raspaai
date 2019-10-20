import React from "react"
import { useQuery } from "react-apollo"
import gql from "graphql-tag"
import ErrorPage from "../core/ErrorPage"
import SEO from "../seo"

import ShopProductSkeleton from "../skeletons/ShopProductSkeleton"
import ProductDetails from "../templates/product-detail/ProductDetails"

// const seeThisOnGoogleMaps = "https://www.google.co.in/maps/place/31.708324,76.931868/@31.7082658,76.931412,16z/"

const SHOP_PRODUCT = gql`
  query($shopProductId: ID!) {
    shopProduct(id: $shopProductId) {
      id
      product {
        title
        mrp
        description
        images {
          edges {
            node {
              image
            }
          }
        }
        category {
          name
        }
        type {
          name
        }
        brand {
          publicUsername
        }
        longDescription
        isAvailable
        technicalDetails
      }
      offeredPrice
      inStock
    }
  }
`

const ShopProductPage = props => {
  const { shopProductId, shopUsername } = props

  const { loading, error, data } = useQuery(SHOP_PRODUCT, {
    variables: { shopProductId },
  })
  if (loading) return <ShopProductSkeleton></ShopProductSkeleton>
  if (error) {
    return <ErrorPage></ErrorPage>
  }
  if (data && data.shopProduct) {
    const {
      shopProduct: {
        product,
        offeredPrice,
        inStock,
        product: {
          title: productTitle,
          description,
          brand: { publicUsername: brandPublicUsername },
        },
      },
    } = data

    const shopProduct = {
      offeredPrice,
      inStock,
    }
    return (
      <>
        <SEO
          title={`${productTitle} | ${shopUsername}`}
          description={description}
        ></SEO>
        {/* <Container maxWidth={false} style={{ paddingLeft: 2 }}> */}
        <ProductDetails
          product={product}
          shopProduct={shopProduct}
          brandPublicUsername={brandPublicUsername}
          shopPublicUsername={shopUsername}
          isShopProduct={true}
        ></ProductDetails>
        {/* </Container> */}
      </>
    )
  }
}

export default ShopProductPage
