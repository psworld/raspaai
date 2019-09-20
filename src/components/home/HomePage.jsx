import React from "react"
import { useQuery } from "react-apollo"
import gql from "graphql-tag"
import Home from "./Home"
import ErrorPage from "../core/ErrorPage"
import HomePageSkeleton from "../skeletons/HomePageSkeleton"

const NEARBY_SHOP_PRODUCTS = gql`
  query($lat: Float!, $lng: Float!) {
    nearbyShopProducts(lat: $lat, lng: $lng, first: 10) {
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      edges {
        node {
          id
          shop {
            properties {
              publicUsername
            }
          }
          product {
            title
            mrp
            description
          }
          offeredPrice
          inStock
        }
      }
    }
  }
`

const HomePage = props => {
  const { location } = props
  const { loading, error, data } = useQuery(NEARBY_SHOP_PRODUCTS, {
    variables: { lat: location.lat, lng: location.lng },
  })
  if (loading) return <HomePageSkeleton></HomePageSkeleton>
  if (error) return <ErrorPage></ErrorPage>
  if (data) {
    return (
      <Home
        location={location}
        nearbyShopProducts={data.nearbyShopProducts.edges}
      ></Home>
    )
  }
}

export default HomePage
