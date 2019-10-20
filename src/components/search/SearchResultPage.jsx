import React from "react"

import Grid from "@material-ui/core/Grid"
import Typography from "@material-ui/core/Typography"
import Button from "@material-ui/core/Button"

import ErrorPage from "../core/ErrorPage"
import { navigate } from "gatsby"

import gql from "graphql-tag"
import { useQuery } from "react-apollo"

import ProductGridSkeleton from "../skeletons/ProductGridSkeleton"
import ShopProductGrid from "../templates/ShopProductGrid"

const SHOP_PRODUCT_SEARCH = gql`
  query(
    $lat: Float!
    $lng: Float!
    $phrase: String!
    $rangeInKm: Int
    $endCursor: String
  ) {
    productSearch(
      lat: $lat
      lng: $lng
      phrase: $phrase
      rangeInKm: $rangeInKm
      first: 10
      after: $endCursor
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
          isAvailable
        }
      }
    }
  }
`

const SearchResultPage = props => {
  const { phrase, pageNo, endCursor, latitude, longitude } = props
  const lat = parseFloat(latitude)
  const lng = parseFloat(longitude)
  const { loading, error, data } = useQuery(SHOP_PRODUCT_SEARCH, {
    variables: { phrase, endCursor, lat, lng, rangeInKm: 5 },
  })

  if (loading)
    return (
      <>
        <Typography style={{ margin: 6 }} variant="h4">
          Search results for {phrase}
        </Typography>
        <ProductGridSkeleton></ProductGridSkeleton>
      </>
    )
  if (error) return <ErrorPage></ErrorPage>
  if (data && data.productSearch && data.productSearch.pageInfo.startCursor) {
    const {
      pageInfo: { hasNextPage, endCursor },
      edges: nearbyShopProducts,
    } = data.productSearch
    return (
      <>
        <Typography style={{ margin: 6 }} variant="h4">
          Search results for {phrase}
        </Typography>

        <Grid container>
          <ShopProductGrid shopProducts={nearbyShopProducts}></ShopProductGrid>
        </Grid>

        <Button
          disabled={!hasNextPage}
          variant="contained"
          color="secondary"
          title={hasNextPage ? "See next page" : "No more results."}
          onClick={() =>
            navigate(
              `/search/${phrase}/pg/${parseInt(pageNo) +
                1}/@/${lat}/${lng}/${endCursor}`
            )
          }
        >
          Next
        </Button>
        <Button
          variant="contained"
          color="secondary"
          disabled={pageNo === "1"}
          onClick={() => window.history.back(-1)}
        >
          Back
        </Button>
      </>
    )
  }
  return (
    <Typography style={{ margin: 4 }} variant="h2">
      No results found for <code>{phrase}</code>.
    </Typography>
  )
}

export default SearchResultPage
