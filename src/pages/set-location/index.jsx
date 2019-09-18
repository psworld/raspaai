import React from "react"
import Layout from "../../components/layout"
import { Link } from "gatsby"
import Button from "@material-ui/core/Button"
import Grid from "@material-ui/core/Grid"
import Typography from "@material-ui/core/Typography"
import { makeStyles } from "@material-ui/core/styles"
import Container from "@material-ui/core/Container"
import Card from "@material-ui/core/Card"
import CardActions from "@material-ui/core/CardActions"
import CardContent from "@material-ui/core/CardContent"
import CardMedia from "@material-ui/core/CardMedia"
import slugGenerator from "../../components/core/slugGenerator"
import gatsbyAstronaut from "../../images/gatsby-astronaut.png"

const useStyles = makeStyles(theme => ({
  heroContent: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(8, 0, 6),
  },
  heroButtons: {
    marginTop: theme.spacing(4),
  },
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

const HeroUnit = () => {
  const classes = useStyles()
  return (
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
        <Typography variant="h5" align="center" color="textSecondary" paragraph>
          You can either set location manually or get location automatically.
        </Typography>

        <Typography
          variant="caption"
          align="center"
          color="textSecondary"
          paragraph
        >
          * Getting accurate location automatically requires GPS.
        </Typography>
        <div className={classes.heroButtons}>
          <Grid container spacing={2} justify="center">
            <Grid item>
              <Button
                component={Link}
                to="/set-location/manual"
                variant="contained"
                color="primary"
              >
                manual
              </Button>
            </Grid>
            <Grid item>
              <Button
                component={Link}
                to="/set-location/automatic"
                variant="outlined"
                color="primary"
              >
                automatic
              </Button>
            </Grid>
          </Grid>
        </div>
      </Container>
    </div>
  )
}

const PopularPlacesGridItem = props => {
  const {
    shopProduct: {
      id: shopProductId,
      shop: {
        properties: { publicUsername },
      },
      product: { title, mrp, description },
    },
  } = props
  const classes = useStyles()
  const shopProductSlug = slugGenerator(title)
  return (
    <Grid item xs={12} sm={6} md={4}>
      <Card className={classes.card}>
        <Link
          to={`/shop/${publicUsername}/product/${shopProductSlug}/${shopProductId}`}
        >
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

const SetLocation = () => {
  return (
    <Layout>
      <HeroUnit></HeroUnit>
      <Typography variant="h6" align="center">
        You can also choose from one of the popular places below.
      </Typography>
    </Layout>
  )
}

export default SetLocation
