import React from "react"

import { makeStyles } from "@material-ui/core/styles"
import Typography from "@material-ui/core/Typography"
import Container from "@material-ui/core/Container"
import Grid from "@material-ui/core/Grid"
import Skeleton from "@material-ui/lab/Skeleton"

import ProductGridSkeleton from "./ProductGridSkeleton"

const useStyles = makeStyles(theme => ({
  heroContent: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(8, 0, 6),
  },
  heroButtons: {
    marginTop: theme.spacing(4),
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
        <div className={classes.heroButtons}>
          <Grid container justify="center">
            <Grid item>
              <Skeleton width="30%"></Skeleton>
            </Grid>
            <Grid item>
              <Skeleton width="30%"></Skeleton>
            </Grid>
          </Grid>
        </div>
      </div>
      <ProductGridSkeleton />
    </React.Fragment>
  )
}

export default HomePageSkeleton
