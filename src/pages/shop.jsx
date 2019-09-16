import React from "react"
import Layout from "../components/layout"
import { Router } from "@reach/router"

const ShopProduct = props => {
  const { shopUsername, shopProductSlug, shopProductId } = props
  return (
    <Layout>
      <h1>Shop: {shopUsername}</h1>
      <h1>Shop product: {shopProductSlug} </h1>
      <h1>shopProductId: {shopProductId}</h1>
    </Layout>
  )
}

const Product = () => {
  return (
    <Router>
      <ShopProduct path="/shop/:shopUsername/product/:shopProductSlug/:shopProductId"></ShopProduct>
    </Router>
  )
}

export default Product
