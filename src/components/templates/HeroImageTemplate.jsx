import React from "react"
import Skeleton from "@material-ui/lab/Skeleton"
import { makeStyles } from "@material-ui/core/styles"

const useStyles = makeStyles(theme => ({
  cardMedia: {
    // paddingTop: "56.25%", // 16:9
    paddingTop: "28.12%",
  },
}))

const HeroImageTemplate = () => {
  const classes = useStyles()
  return <Skeleton className={classes.cardMedia}></Skeleton>
}

export default HeroImageTemplate
