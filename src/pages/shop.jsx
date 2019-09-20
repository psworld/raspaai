import React from "react"
import { Router } from "@reach/router"
import ShopProduct from "../components/shop-product/ShopProduct"
import Layout from "../components/layout"
import Shop from "../components/shop/Shop"
import ShopHome from "../components/shop/ShopHome"

const ShopRouter = () => {
  return (
    <Layout>
      <Router>
        <ShopProduct path="/shop/:shopUsername/product/:shopProductSlug/:shopProductId"></ShopProduct>
        <ShopHome path="/shop/:shopUsername"></ShopHome>
      </Router>
    </Layout>
  )
}

export default ShopRouter
