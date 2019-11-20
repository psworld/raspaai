import React from "react"
import Grid from "@material-ui/core/Grid"
import HeroUnit from "./HeroUnit"
import ShopProductGrid from "../templates/ShopProductGrid"

export default function HomePage(props) {
  const { nearbyShopProducts, location } = props

  return (
    <React.Fragment>
      <HeroUnit location={location}></HeroUnit>
      <Grid container>
        <ShopProductGrid shopProducts={nearbyShopProducts}></ShopProductGrid>
      </Grid>
    </React.Fragment>
  )
}
