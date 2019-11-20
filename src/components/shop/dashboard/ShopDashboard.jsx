import React from "react"
import { Router } from "@reach/router"
import ShopDashboardHomePage from "./ShopDashboardHomePage"
import MyProductsPage from "./MyProductsPage"
import DashboardLayout from "./components/DashboardLayout"
import AddNewProduct from "./AddNewProduct"
import OrderRouter from "./components/orders/OrderRouter"

const ShopDashboard = props => {
  const { shopUsername } = props
  const [searchPhrase, setSearchPhrase] = React.useState("")
  return (
    <DashboardLayout
      searchPhrase={searchPhrase}
      setSearchPhrase={setSearchPhrase}
      publicUsername={shopUsername}
    >
      <Router>
        <ShopDashboardHomePage
          path="/"
          shopUsername={shopUsername}
        ></ShopDashboardHomePage>
        <MyProductsPage path="products"></MyProductsPage>
        <AddNewProduct
          shopUsername={shopUsername}
          path="product/add"
        ></AddNewProduct>
        <AddNewProduct
          shopUsername={shopUsername}
          path="product/add/search/:phrase"
        ></AddNewProduct>
        <MyProductsPage
          shopUsername={shopUsername}
          path="products/search/:phrase"
        ></MyProductsPage>
        <OrderRouter shopUsername={shopUsername} path="orders/*"></OrderRouter>
      </Router>
    </DashboardLayout>
  )
}

export default ShopDashboard
