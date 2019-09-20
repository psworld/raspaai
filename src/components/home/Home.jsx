import React from "react"
import Grid from "@material-ui/core/Grid"
import HeroUnit from "./HeroUnit"
import GridElement from "./GridElement"
import Box from "@material-ui/core/Box"
import Paper from "@material-ui/core/Paper"

export default function Home(props) {
  const { nearbyShopProducts, location } = props

  return (
    <React.Fragment>
      <HeroUnit location={location}></HeroUnit>
      <Box overflow="hidden" clone>
        <Paper>
          <Box px={1}>
            <Grid container>
              {nearbyShopProducts.map(shopProductNode => (
                <GridElement
                  key={shopProductNode.node.id}
                  shopProduct={shopProductNode.node}
                ></GridElement>
              ))}
            </Grid>
          </Box>
        </Paper>
      </Box>
    </React.Fragment>
  )
}
