import React from "react"
import SEO from "../../seo"

import { ProductGrid } from "../BrandHomePage"

const MyProductsPage = ({ phrase, brandUsername }) => {
  console.info("My Products Page")
  return (
    <>
      <SEO title={`Dashboard Products`}></SEO>
      <ProductGrid
        phrase={phrase}
        publicBrandUsername={brandUsername}
        isBrandDashboardProduct={true}
      ></ProductGrid>
    </>
  )
}

export default MyProductsPage
