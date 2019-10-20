import React from "react"
import { Router } from "@reach/router"
import DashboardLayout from "../../shop/dashboard/components/DashboardLayout"
import BrandDashboardHomePage from "./BrandDashboardHomePage"
import AddNewBrandProduct from "./AddNewBrandProduct"
import MyProductsPage from "./MyProductsPage"
import EditBrandProduct from "./EditBrandProduct"

const BrandDashboard = props => {
  const { brandUsername } = props
  return (
    <DashboardLayout isBrand={true} publicUsername={brandUsername}>
      <Router>
        <BrandDashboardHomePage
          path="/"
          brandUsername={brandUsername}
        ></BrandDashboardHomePage>
        <EditBrandProduct path="product/edit/:productSlug/:id"></EditBrandProduct>
        <AddNewBrandProduct
          path="product/add"
          brandUsername={brandUsername}
        ></AddNewBrandProduct>
        <MyProductsPage
          path="products"
          brandUsername={brandUsername}
        ></MyProductsPage>
        <MyProductsPage
          brandUsername={brandUsername}
          path="products/search/:phrase"
        ></MyProductsPage>
      </Router>
    </DashboardLayout>
  )
}

export default BrandDashboard
