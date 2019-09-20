import React from "react"
import Grid from "@material-ui/core/Grid"
import { makeStyles } from "@material-ui/core/styles"
import Container from "@material-ui/core/Container"
import Typography from "@material-ui/core/Typography"
import GridElement from "../home/GridElement"
import gql from "graphql-tag"
import { useQuery } from "react-apollo"
import ErrorPage from "../core/ErrorPage"
import { Button } from "@material-ui/core"
import { navigate } from "gatsby"
import ProductGridSkeleton from "../skeletons/ProductGridSkeleton"

const useStyles = makeStyles(theme => ({
  icon: {
    marginRight: theme.spacing(2),
  },
  cardGrid: {
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(8),
  },
}))

const SHOP_PRODUCT_SEARCH = gql`
  query(
    $lat: Float!
    $lng: Float!
    $phrase: String!
    $rangeInKm: Int
    $endCursor: String
  ) {
    shopProductsSearch(
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
  const classes = useStyles()
  const { phrase, pageNo, endCursor, latitude, longitude } = props
  const lat = parseFloat(latitude)
  const lng = parseFloat(longitude)
  const { loading, error, data } = useQuery(SHOP_PRODUCT_SEARCH, {
    variables: { phrase, endCursor, lat, lng, rangeInKm: 5 },
  })

  if (loading) return <ProductGridSkeleton></ProductGridSkeleton>
  if (error) return <ErrorPage></ErrorPage>
  if (
    data &&
    data.shopProductsSearch &&
    data.shopProductsSearch.pageInfo.startCursor
  ) {
    const {
      pageInfo: { hasNextPage, endCursor },
      edges: nearbyShopProducts,
    } = data.shopProductsSearch
    return (
      <Container maxWidth="xl">
        <Typography style={{ margin: 6 }} variant="h4">
          Search results for {phrase}
        </Typography>

        <Grid container>
          {nearbyShopProducts.map(shopProductObj => (
            <GridElement
              key={shopProductObj.node.id}
              shopProduct={shopProductObj.node}
            ></GridElement>
          ))}
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
      </Container>
    )
  }
  return (
    <Typography style={{ margin: 4 }} variant="h2">
      No results found for <code>{phrase}</code>.
    </Typography>
  )
}

export default SearchResultPage
