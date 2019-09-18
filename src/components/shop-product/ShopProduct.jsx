import React from "react"
import { useQuery } from "react-apollo"
import gql from "graphql-tag"
import ErrorPage from "../core/ErrorPage"

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
    console.log(error.message)

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
    console.log(id)
    return (
      <>
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
