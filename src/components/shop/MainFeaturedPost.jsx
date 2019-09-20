import React from "react"
import Grid from "@material-ui/core/Grid"
import CardMedia from "@material-ui/core/CardMedia"
import Card from "@material-ui/core/Card"

import { makeStyles } from "@material-ui/core/styles"

import heroBg from "../../images/heroBg.jpg"

const useStyles = makeStyles(theme => ({
  card: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
  },
  cardMedia: {
    // paddingTop: "56.25%", // 16:9
    paddingTop: "28.12%",
  },
  cardContent: {
    flexGrow: 1,
  },
}))

const MainFeaturedPost = () => {
  const classes = useStyles()
  return (
    <Grid item xs={12} sm={12} md={12}>
      <Card className={classes.card}>
        <CardMedia
          className={classes.cardMedia}
          image={heroBg}
          title={"Hero Bg"}
        />
      </Card>
    </Grid>
  )
}

export default MainFeaturedPost
