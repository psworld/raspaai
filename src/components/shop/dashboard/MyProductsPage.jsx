import React from "react"
import SEO from "../../seo"
import ProductGridSkeleton from "../../skeletons/ProductGridSkeleton"
import ErrorPage from "../../core/ErrorPage"
import { useQuery } from "react-apollo"
import { SHOP_PRODUCTS } from "../ShopHomePage"
import PaginationWithState from "../../templates/PaginationWithState"
import DashboardShopProductGrid from "../../templates/dashboard/DashboardShopProductGrid"

import Grid from "@material-ui/core/Grid"

const ProductGrid = ({ phrase, publicShopUsername }) => {
  const { loading, error, data, fetchMore } = useQuery(SHOP_PRODUCTS, {
    variables: {
      publicShopUsername,
      phrase,
      withBrand: true,
    },
  })

  if (loading) return <ProductGridSkeleton></ProductGridSkeleton>
  if (error) return <ErrorPage></ErrorPage>

  if (data && data.shopProducts.pageInfo.startCursor) {
    const { edges: shopProducts, pageInfo } = data.shopProducts
    return (
      <>
        <DashboardShopProductGrid
          shopProducts={shopProducts}
        ></DashboardShopProductGrid>

        <Grid item>
          <PaginationWithState
            fetchMore={fetchMore}
            pageInfo={pageInfo}
          ></PaginationWithState>
        </Grid>
      </>
    )
  }
  return <h1>You do not have any products in your shop</h1>
}

const MyProductsPage = ({ phrase, shopUsername }) => {
  return (
    <>
      <SEO title={`Dashboard Products`}></SEO>
      <ProductGrid
        phrase={phrase}
        publicShopUsername={shopUsername}
      ></ProductGrid>
    </>
  )
}

export default MyProductsPage
