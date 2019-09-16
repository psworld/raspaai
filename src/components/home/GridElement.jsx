import React from "react"
import Button from "@material-ui/core/Button"
import Card from "@material-ui/core/Card"
import CardActions from "@material-ui/core/CardActions"
import CardContent from "@material-ui/core/CardContent"
import CardMedia from "@material-ui/core/CardMedia"
import Grid from "@material-ui/core/Grid"
import Typography from "@material-ui/core/Typography"
import { makeStyles } from "@material-ui/core/styles"
import gatsbyAstronaut from "../../images/gatsby-astronaut.png"
import slugGenerator from "../core/slugGenerator"
import Link from "../core/Link"

const useStyles = makeStyles(theme => ({
  card: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
  },
  cardMedia: {
    // paddingTop: "56.25%", // 16:9
    paddingTop: "80%",
  },
  cardContent: {
    flexGrow: 1,
  },
}))

const GridElement = props => {
  const {
    shopProduct: {
      id,
      product: { title, mrp, description },
    },
  } = props
  const classes = useStyles()
  const shopProductSlug = slugGenerator(title)
  return (
    <Grid item xs={12} sm={6} md={4}>
      <Card className={classes.card}>
        <Link to={`/shop/raspaai/product/${shopProductSlug}/${id}`}>
          <CardMedia
            className={classes.cardMedia}
            image={gatsbyAstronaut}
            title={title}
          />

          <CardContent className={classes.cardContent}>
            <Typography gutterBottom variant="h5" component="h2">
              {title}
            </Typography>
            <Typography>{description}</Typography>
          </CardContent>
        </Link>
        <CardActions>
          <Button size="small" color="primary">
            View
          </Button>
          <Button size="small" color="primary">
            Edit
          </Button>
        </CardActions>
      </Card>
    </Grid>
  )
}

export default GridElement
