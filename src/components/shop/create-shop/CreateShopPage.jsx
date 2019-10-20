import React from "react"
import {
  Typography,
  Container,
  List,
  ListItemText,
  ListItem,
  Grid,
  Button,
} from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles"
import { Link } from "gatsby"
import Image from "../../image"

const useStyles = makeStyles(theme => ({
  heroContent: {
    padding: theme.spacing(4, 0, 4),
  },
  cardHeader: {
    backgroundColor: theme.palette.grey[200],
  },
  cardPricing: {
    display: "flex",
    justifyContent: "center",
    alignItems: "baseline",
    marginBottom: theme.spacing(2),
  },
}))

const CreateShopPage = ({ handleNext }) => {
  const classes = useStyles()

  return (
    <>
      {/* Hero unit */}
      <Container maxWidth="md" className={classes.heroContent}>
        <Typography
          component="h1"
          variant="h2"
          align="center"
          color="textPrimary"
          gutterBottom
        >
          Do you own a shop ?
        </Typography>

        <Typography
          variant="h5"
          align="center"
          color="textSecondary"
          component="p"
        >
          Register with us and enjoy benefits of your own free website.<br></br>
          Get your shop online and make it easy for your customers to discover
          your great products.
        </Typography>
      </Container>
      <Container maxWidth="xl">
        <Typography
          variant="h4"
          align="center"
          color="textPrimary"
          gutterBottom
        >
          How to register.
        </Typography>
        <List>
          <ListItem>
            <ListItemText
              primary={
                <span>
                  1. First you need to <Link to="/signin">sign in</Link> with
                  your raspaai account.
                </span>
              }
              secondary={
                <span>
                  &ensp;&ensp;&ensp;If you do not have a raspaai account you can
                  create one here&ensp;
                  <Link to="/signup">create an account</Link>
                </span>
              }
            ></ListItemText>
          </ListItem>
          <ListItem>
            <ListItemText
              primary={
                <span>
                  2. A picture of the shop owner(s) in front of the store.
                </span>
              }
              secondary={
                <>
                  &ensp;&ensp;&ensp;Picture should be in landscape mode (4:3)
                  and of small size.
                  <br></br>
                  <Typography style={{ color: "green" }}>
                    Good picture examples
                  </Typography>
                  <Grid container>
                    <Grid item xs={12} md={6}>
                      <Image name={"bg16-9.png"}></Image>
                    </Grid>
                  </Grid>
                  <Typography color="secondary">
                    Bad picture examples
                  </Typography>
                  <Grid container>
                    <Grid item xs={4} md={3}>
                      {/* <div style={{ maxWidth: "300px" }}> */}
                      <Image name={"diver.jpg"}></Image>
                      {/* </div> */}
                    </Grid>
                  </Grid>
                </>
              }
            ></ListItemText>
          </ListItem>
          <ListItem>
            <ListItemText primary="3. Your registration proof. A gst invoice or anything else"></ListItemText>
          </ListItem>
          <ListItem>
            <ListItemText primary="4. Now you are ready to go. Click the continue below to proceed."></ListItemText>
          </ListItem>
        </List>
        <Button onClick={handleNext} variant="contained" color="primary">
          Continue
        </Button>
      </Container>
      {/* End hero unit */}
    </>
  )
}
// documents required for the shop.
export default CreateShopPage
