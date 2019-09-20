import React from "react"

import Typography from "@material-ui/core/Typography"
import { makeStyles } from "@material-ui/core/styles"
import Container from "@material-ui/core/Container"

import ProductGridSkeleton from "./ProductGridSkeleton"

const useStyles = makeStyles(theme => ({
  heroContent: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(8, 0, 8),
  },
}))

const HomePageSkeleton = () => {
  const classes = useStyles()
  return (
    <React.Fragment>
      {/* Hero unit */}
      <div className={classes.heroContent}>
        <Container maxWidth="sm">
          <Typography
            component="h1"
            variant="h2"
            align="center"
            color="textPrimary"
            gutterBottom
          >
            Raspaai
          </Typography>
          <Typography
            variant="h5"
            align="center"
            color="textSecondary"
            paragraph
          >
            We are getting the best results please wait...
          </Typography>
        </Container>
      </div>
      <ProductGridSkeleton />
    </React.Fragment>
  )
}

export default HomePageSkeleton
