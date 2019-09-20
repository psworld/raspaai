import React from "react"
import { Router } from "@reach/router"
import ShopHome from "./ShopHome"

const Shop = () => {
  return (
    <Router>
      <ShopHome path="/shop/:shopUsername"></ShopHome>
    </Router>
  )
}

export default Shop
