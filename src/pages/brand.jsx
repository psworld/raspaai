import React from "react"
import { Router } from "@reach/router"
import Layout from "../components/layout"
import BrandHomePage from "../components/brand/BrandHomePage"
import BrandProductPage from "../components/brand/BrandProductPage"

const ShopRouter = () => {
  return (
    <Layout>
      <Router>
        <BrandProductPage path="/brand/:brandUsername/product/:productSlug/:productId"></BrandProductPage>
        <BrandHomePage path="/brand/:brandUsername/search/:phrase"></BrandHomePage>
        <BrandHomePage path="/brand/:brandUsername"></BrandHomePage>
      </Router>
    </Layout>
  )
}

export default ShopRouter
