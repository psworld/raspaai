import React from "react"
import ProductElement from "./ProductElement"

const ShopProductGrid = props => {
  const { shopProducts } = props
  return (
    <>
      {shopProducts.map(shopProductObj => {
        const {
          id,
          shop: {
            properties: { publicUsername },
          },
          offeredPrice,
          product: { title, mrp, thumb },
        } = shopProductObj.node
        return (
          <ProductElement
            key={id}
            id={id}
            title={title}
            thumb={thumb}
            publicUsername={publicUsername}
            offeredPrice={offeredPrice}
            mrp={mrp}
            isBrand={false}
          ></ProductElement>
        )
      })}
    </>
  )
}

export default ShopProductGrid
