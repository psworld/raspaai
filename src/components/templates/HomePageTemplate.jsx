import React from "react"
import Grid from "@material-ui/core/Grid"
import Typography from "@material-ui/core/Typography"
import { makeStyles } from "@material-ui/core/styles"
import Container from "@material-ui/core/Container"
import Skeleton from "@material-ui/lab/Skeleton"

const useStyles = makeStyles(theme => ({
  heroContent: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(8, 0, 8),
  },

  cardGrid: {
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(4),
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
}))

const cards = [1, 2, 3, 4, 5, 6, 7, 8, 9]

export const ProductGridTemplate = () => {
  const classes = useStyles()
  return (
    <Container className={classes.cardGrid} maxWidth="md">
      {/* End hero unit */}
      <Grid container spacing={4}>
        {cards.map(card => (
          <Grid className={classes.card} item key={card} xs={12} sm={6} md={4}>
            <Skeleton className={classes.cardMedia}></Skeleton>
            <Skeleton width="60%"></Skeleton>
            <Skeleton height={50}></Skeleton>
          </Grid>
        ))}
      </Grid>
    </Container>
  )
}

export default function HomePageTemplate() {
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
      <ProductGridTemplate />
    </React.Fragment>
  )
}
