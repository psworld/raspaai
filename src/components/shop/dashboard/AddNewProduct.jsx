import React from "react"
import SEO from "../../seo"
import gql from "graphql-tag"
import { useQuery } from "react-apollo"
import ProductGridSkeleton from "../../skeletons/ProductGridSkeleton"
import ErrorPage from "../../core/ErrorPage"
import PaginationWithState from "../../templates/PaginationWithState"

import Grid from "@material-ui/core/Grid"
import DashboardBrandProductGrid from "../../templates/dashboard/DashboardBrandProductGrid"
import SearchBar from "../../templates/dashboard/SearchBar"

const PRODUCTS = gql`
  query($phrase: String, $endCursor: String, $withBrand: Boolean!) {
    products(first: 20, phrase: $phrase, after: $endCursor) {
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      edges {
        node {
          id
          title
          mrp
          thumb
          brand @include(if: $withBrand) {
            id
            publicUsername
            title
          }
        }
      }
    }
  }
`

const ProductGrid = ({ phrase, publicShopUsername }) => {
  // Required for pagination
  const [pageInfo, setPageInfo] = React.useState([
    {
      startCursor: null,
    },
  ])
  const [pageNo, setPageNo] = React.useState(1)
  // Pagination requirements end

  const { loading, error, data } = useQuery(PRODUCTS, {
    variables: {
      phrase,
      withBrand: true,
      endCursor: pageInfo[pageNo - 1].startCursor,
    },
  })

  if (loading) return <ProductGridSkeleton></ProductGridSkeleton>
  if (error) return <ErrorPage></ErrorPage>

  if (data) {
    const {
      edges: products,
      pageInfo: { hasNextPage, endCursor: currentPageEndCursor },
    } = data.products
    return (
      <>
        <DashboardBrandProductGrid
          publicShopUsername={publicShopUsername}
          products={products}
          addShopProduct={true}
          isBrand={false}
        ></DashboardBrandProductGrid>

        <Grid item>
          <PaginationWithState
            pageNo={pageNo}
            setPageNo={setPageNo}
            pageInfo={pageInfo}
            setPageInfo={setPageInfo}
            currentPageEndCursor={currentPageEndCursor}
            hasNextPage={hasNextPage}
          ></PaginationWithState>
        </Grid>
      </>
    )
  }
}

const AddNewProduct = ({ phrase, shopUsername }) => {
  const [searchPhrase, setSearchPhrase] = React.useState("")

  return (
    <>
      <SEO title="Dashboard Add Products"></SEO>
      <h1>Add new products to your shop.</h1>
      <SearchBar
        searchPhrase={searchPhrase}
        setSearchPhrase={setSearchPhrase}
        publicUsername={shopUsername}
        isAddNewShopProductSearch={true}
      ></SearchBar>
      <ProductGrid
        phrase={phrase}
        publicShopUsername={shopUsername}
      ></ProductGrid>
    </>
  )
}

export default AddNewProduct
