import React from "react"
import SEO from "../../seo"
import Dashboard from "../../shop/dashboard/components/Dashboard"

const BrandDashboardHomePage = ({ brandUsername }) => {
  return (
    <>
      <SEO title={`Dashboard ${brandUsername}`}></SEO>
      <Dashboard isBrand={true} publicUsername={brandUsername}></Dashboard>
    </>
  )
}

export default BrandDashboardHomePage
