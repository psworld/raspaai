import React from "react"
import { useQuery } from "react-apollo"
import gql from "graphql-tag"
import ErrorPage from "../core/ErrorPage"
import SEO from "../seo"

// const seeThisOnGoogleMaps = "https://www.google.co.in/maps/place/31.708324,76.931868/@31.7082658,76.931412,16z/"

const SHOP_PRODUCT = gql`
  query($shopProductId: ID!) {
    shopProduct(id: $shopProductId) {
      id
      shop {
        properties {
          publicUsername
          title
        }
      }
      product {
        title
        mrp
        description
      }
      offeredPrice
      inStock
      isAvailable
    }
  }
`

const ShopProduct = props => {
  const { shopProductId } = props

  const { loading, error, data } = useQuery(SHOP_PRODUCT, {
    variables: { shopProductId },
  })
  if (loading) return <h1>ShopProductTemplate</h1>
  if (error) {
    return <ErrorPage></ErrorPage>
  }
  if (data && data.shopProduct) {
    const {
      shopProduct: {
        id,
        product: { title: productTitle, mrp, description },
        offeredPrice,
        shop: {
          properties: { publicUsername, title: shopTitle },
        },
      },
    } = data
    return (
      <>
        <SEO
          title={`${productTitle} | ${publicUsername}`}
          description={description}
        ></SEO>
        <h1>{productTitle}</h1>
        <h2>mrp: Rs.{mrp}</h2>
        <h2>offered price: Rs.{offeredPrice}</h2>
        <h3>From {publicUsername}</h3>
        <p>{description} </p>
      </>
    )
  }
}

export default ShopProduct
