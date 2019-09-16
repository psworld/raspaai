import React from "react"
import { Router } from "@reach/router"
import Layout from "../components/layout"

const ShopProduct = props => {
  const { shopUsername, shopProductSlug, shopProductId } = props
  return (
    <h1>
      <Layout>
        <h1>Shop: {shopUsername}</h1>
        <h1>Shop product: {shopProductSlug} </h1>
        <h1>shopProductId: {shopProductId}</h1>
      </Layout>
    </h1>
  )
}

const ShopProductManager = props => {
  return (
    <Router>
      <ShopProduct path="/shop/:shopUsername/product/:shopProductSlug/:shopProductId"></ShopProduct>
    </Router>
  )
}

export default ShopProductManager
