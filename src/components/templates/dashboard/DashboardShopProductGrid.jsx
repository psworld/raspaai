import React from "react"
import DashboardProductElement from "./DashboardProductElement"
import Grid from "@material-ui/core/Grid"

const DashboardShopProductGrid = ({ shopProducts }) => {
  return (
    <Grid container>
      {shopProducts.map(shopProductObj => {
        const {
          id,
          shop: {
            properties: { publicUsername },
          },
          offeredPrice,
          product: {
            thumb,
            title,
            mrp,
            brand: { publicUsername: brandUsername },
          },
          inStock,
        } = shopProductObj.node

        return (
          <DashboardProductElement
            key={id}
            id={id}
            title={title}
            thumb={thumb}
            publicUsername={publicUsername}
            brandUsername={brandUsername}
            offeredPrice={offeredPrice}
            mrp={mrp}
            action={"modify"}
            isBrand={false}
            inStock={inStock}
          ></DashboardProductElement>
        )
      })}
    </Grid>
  )
}

export default DashboardShopProductGrid
