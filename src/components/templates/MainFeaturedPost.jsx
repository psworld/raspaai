import React from "react"
import Grid from "@material-ui/core/Grid"
import CardMedia from "@material-ui/core/CardMedia"
import Card from "@material-ui/core/Card"

import { makeStyles } from "@material-ui/core/styles"

import { useTheme } from "@material-ui/core/styles"
import { useMediaQuery } from "@material-ui/core"

const useStyles = makeStyles(theme => ({
  card: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
  },
  cardMediaMobile: {
    // paddingTop: "56.25%", // 16:9
    paddingTop: "75%", // 4:3
  },
  cardMediaTv: {
    // paddingTop: "56.25%", // 16:9
    paddingTop: "37.5%", // 4:3
  },
}))

const MainFeaturedPost = ({ img, title }) => {
  const classes = useStyles()
  const theme = useTheme()
  const matches = useMediaQuery(theme.breakpoints.up("sm"))

  return (
    <Grid item xs={12} sm={12} md={12}>
      <Card className={classes.card}>
        <CardMedia
          className={matches ? classes.cardMediaTv : classes.cardMediaMobile}
          image={`http://localhost:8000/media/${img}`}
          title={title}
        />
      </Card>
    </Grid>
  )
}

export default MainFeaturedPost
