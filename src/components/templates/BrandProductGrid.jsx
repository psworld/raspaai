import React from "react"
import ProductElement from "./ProductElement"

const BrandProductGrid = props => {
  const { publicBrandUsername, brandProducts, isBrandDashboardProduct } = props
  return (
    <>
      {brandProducts.map(brandProductObj => {
        const { id, title, mrp, thumb } = brandProductObj.node
        return (
          <ProductElement
            key={id}
            id={id}
            title={title}
            thumb={thumb}
            publicUsername={publicBrandUsername}
            mrp={mrp}
            isBrand={true}
            isBrandDashboardProduct={isBrandDashboardProduct}
          ></ProductElement>
        )
      })}
    </>
  )
}

export default BrandProductGrid
