import React from "react"
import { Router } from "@reach/router"
import ShopProduct from "../components/shop-product/ShopProduct"
import Layout from "../components/layout"

const ShopRouter = () => {
  return (
    <Layout>
      <Router>
        <ShopProduct path="/shop/:shopUsername/product/:shopProductSlug/:shopProductId"></ShopProduct>
      </Router>
    </Layout>
  )
}

export default ShopRouter
