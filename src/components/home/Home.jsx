import React from "react"
import Grid from "@material-ui/core/Grid"
import { makeStyles } from "@material-ui/core/styles"
import Container from "@material-ui/core/Container"
import HeroUnit from "./HeroUnit"
import GridElement from "./GridElement"

const useStyles = makeStyles(theme => ({
  icon: {
    marginRight: theme.spacing(2),
  },
  cardGrid: {
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(8),
  },
}))

const cards = [1, 2, 3, 4, 5, 6, 7, 8, 9]

export default function Home(props) {
  const classes = useStyles()
  const { nearbyShopProducts } = props

  return (
    <React.Fragment>
      <HeroUnit></HeroUnit>
      <Container className={classes.cardGrid} maxWidth="md">
        <Grid container spacing={4}>
          {nearbyShopProducts.map(shopProductNode => (
            <GridElement
              key={shopProductNode.id}
              shopProduct={shopProductNode.node}
            ></GridElement>
          ))}
        </Grid>
      </Container>
    </React.Fragment>
  )
}
