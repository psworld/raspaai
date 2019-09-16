import React from "react"
import Layout from "../components/layout"
import { Router } from "@reach/router"

const ShopProduct = props => {
  const { shopProductSlug, id } = props
  return (
    <>
      <h1>Shop product: {shopProductSlug} </h1>
      <p>Id {id}</p>
    </>
  )
}

const Product = () => {
  return (
    <Layout>
      <Router>
        <ShopProduct path="/product/:shopProductSlug/:id"></ShopProduct>
      </Router>
    </Layout>
  )
}

export default Product
