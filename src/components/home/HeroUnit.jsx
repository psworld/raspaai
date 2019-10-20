import React from "react"

import Button from "@material-ui/core/Button"
import Grid from "@material-ui/core/Grid"
import Typography from "@material-ui/core/Typography"
import { makeStyles } from "@material-ui/core/styles"
import Container from "@material-ui/core/Container"

import Link from "../core/Link"

const useStyles = makeStyles(theme => ({
  heroContent: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(8, 0, 6),
  },
  heroButtons: {
    marginTop: theme.spacing(4),
  },
}))

const HeroUnit = ({ location }) => {
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
          Raspaai | Buy anything from local stores
        </Typography>
        <div className={classes.heroButtons}>
          <Grid container spacing={2} justify="center">
            <Grid item>
              <Button variant="contained" color="primary">
                {location.name}
              </Button>
            </Grid>
            <Grid item>
              <Button
                component={Link}
                to="/set-location"
                variant="outlined"
                color="primary"
              >
                set new location
              </Button>
            </Grid>
          </Grid>
        </div>
      </Container>
    </div>
  )
}

export default HeroUnit
