import React from "react"
import Grid from "@material-ui/core/Grid"
import HeroUnit from "./HeroUnit"
import Box from "@material-ui/core/Box"
import Paper from "@material-ui/core/Paper"
import ShopProductGrid from "../templates/ShopProductGrid"

export default function HomePage(props) {
  const { nearbyShopProducts, location } = props

  return (
    <React.Fragment>
      <HeroUnit location={location}></HeroUnit>
      <Box overflow="hidden" clone>
        <Paper>
          <Box px={0}>
            <Grid container>
              <ShopProductGrid
                shopProducts={nearbyShopProducts}
              ></ShopProductGrid>
            </Grid>
          </Box>
        </Paper>
      </Box>
    </React.Fragment>
  )
}
