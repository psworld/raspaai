import React from "react"
import Layout from "../components/layout"
import { Router } from "@reach/router"

const ShopProduct = props => {
  const { shopUsername, shopProductSlug, shopProductId } = props
  return (
    <>
      <h1>Shop: {shopUsername}</h1>
      <h1>Shop product: {shopProductSlug} </h1>
      <h1>shopProductId: {shopProductId}</h1>
    </>
  )
}

const Product = () => {
  return (
    <Layout>
      <h1>THe s page</h1>
      <Router>
        <ShopProduct path="/shop/:shopUsername/product/:shopProductSlug/:shopProductId"></ShopProduct>
      </Router>
    </Layout>
  )
}

export default Product
