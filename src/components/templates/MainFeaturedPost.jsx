import React from "react"
import CardMedia from "@material-ui/core/CardMedia"
import Card from "@material-ui/core/Card"

import { makeStyles } from "@material-ui/core/styles"

const useStyles = makeStyles(theme => ({
  card: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    marginBottom: theme.spacing(2),
  },
  cardMedia: {
    // paddingTop: "56.25%", // 16:9
    paddingTop: "75%", // 4:3
    [theme.breakpoints.up("sm")]: {
      paddingTop: "37.5%",
    },
  },
}))

const MainFeaturedPost = ({ img, title }) => {
  const classes = useStyles()

  return (
    // <Grid item xs={12} sm={12} md={12}>
    <Card className={classes.card}>
      <CardMedia
        className={classes.cardMedia}
        image={`${process.env.GATSBY_IMG_URL_PRE}/${img}`}
        title={title}
      />
    </Card>
    // </Grid>
  )
}

export default MainFeaturedPost
