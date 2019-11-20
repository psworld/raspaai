import React from "react"
import gql from "graphql-tag"
import { useQuery } from "react-apollo"
import Loading from "../core/Loading"
import ErrorPage from "../core/ErrorPage"

import {
  Container,
  Avatar,
  Typography,
  Grid,
  TextField,
  InputAdornment,
  Button,
  List,
  ListItem,
  ListItemText,
} from "@material-ui/core"

import LockOutlinedIcon from "@material-ui/icons/LockOutlined"

import { makeStyles } from "@material-ui/core/styles"
import Link from "../core/Link"
import MainFeaturedPost from "../templates/MainFeaturedPost"

const useStyles = makeStyles(theme => ({
  card: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    marginBottom: theme.spacing(2),
  },
  cardMediaMobile: {
    // paddingTop: "56.25%", // 16:9
    paddingTop: "75%", // 4:3
  },
  cardMediaTv: {
    // paddingTop: "56.25%", // 16:9
    paddingTop: "37.5%", // 4:3
  },
  paper: {
    marginTop: theme.spacing(2),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
}))

const SHOP = gql`
  query($shopUsername: String!) {
    shop(publicShopUsername: $shopUsername) {
      id
      properties {
        publicUsername
        title
        isApplication
        applicationDate
        heroImage
        address
        contactNumber
        applicationStatus {
          statusCode
          title
          description
        }
      }
    }
  }
`

const ShopApplicationStatus = ({ shopUsername }) => {
  const classes = useStyles()

  const { loading, error, data } = useQuery(SHOP, {
    variables: { shopUsername },
  })

  if (loading) return <Loading></Loading>
  if (error) return <ErrorPage></ErrorPage>
  if (data) {
    const {
      id,
      properties: {
        title: shopName,
        contactNumber,
        address,
        applicationData,
        heroImage,
        applicationStatus: { statusCode, title: statusTitle, description },
      },
    } = data.shop

    const inputDisabled = statusCode === "under_review" ? true : false

    return (
      <>
        <Container maxWidth="sm">
          <List>
            <ListItem>
              <ListItemText
                primary={
                  <>
                    Application status :{" "}
                    <span
                      style={
                        statusCode === "under_review" && { color: "#ffd700" }
                      }
                    >
                      {statusTitle}
                    </span>
                  </>
                }
                secondary={description}
              ></ListItemText>
            </ListItem>
          </List>
        </Container>
        <MainFeaturedPost img={heroImage} title={shopName}></MainFeaturedPost>
        <Container maxWidth="md">
          <div className={classes.paper}>
            <Avatar className={classes.avatar}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Shop Registration
            </Typography>
            <form className={classes.form} noValidate>
              <Grid container spacing={2} justify="center">
                <Grid item xs={12} sm={6}>
                  <TextField
                    id="shopName"
                    defaultValue={shopName}
                    // onChange={handleChange}
                    // onBlur={handleBlur}
                    disabled={inputDisabled}
                    label={
                      // touched.shopName && errors.shopName
                      // ? `${errors.shopName}`
                      // :
                      "Your Shop Name"
                    }
                    // error={touched.shopName && errors.shopName && true}
                    margin="none"
                    variant="outlined"
                    placeholder="Shop Name"
                    fullWidth
                  ></TextField>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    id="shopUsername"
                    label={"Shop Username"}
                    defaultValue={shopUsername}
                    disabled={inputDisabled}
                    margin="none"
                    variant="outlined"
                    placeholder="Shop Username"
                    fullWidth
                  ></TextField>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    id="shopAddress"
                    label={"Shop Address"}
                    disabled={inputDisabled}
                    defaultValue={address}
                    margin="none"
                    variant="outlined"
                    placeholder="Shop Address"
                    fullWidth
                    // multiline
                  ></TextField>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    id="shopContactNumber"
                    label={"Shop Contact Number"}
                    disabled={inputDisabled}
                    defaultValue={contactNumber}
                    type="number"
                    margin="none"
                    variant="outlined"
                    placeholder="Shop Contact Number"
                    fullWidth
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">+91</InputAdornment>
                      ),
                    }}
                    // multiline
                  ></TextField>
                </Grid>
                <Grid item justify="center">
                  <Button
                    // onClick={() => setMap(!map)}
                    variant="contained"
                    color="primary"
                  >
                    Show Map
                  </Button>
                </Grid>

                {/* End Location Setting */}
                <Grid item xs={12}>
                  {/* {map && (
                  <Map
                    center={{ lat: 31.818543, lng: 76.936076 }}
                    setLocation={setLocation}
                    noSave={true}
                  ></Map>
                )} */}
                </Grid>

                <Button
                  // type="submit"
                  // onClick={sendApplication}
                  fullWidth
                  variant="contained"
                  color="secondary"
                  className={classes.submit}
                >
                  Delete Application
                </Button>
                <Grid item xs>
                  <Link to="/shop-register" variant="body2">
                    Need Help ?
                  </Link>
                </Grid>
                <Grid item>
                  <a href="/signup" variant="body2">
                    Watch a video on how to register
                  </a>
                </Grid>
              </Grid>
            </form>
          </div>
        </Container>
      </>
    )
  }
}

export default ShopApplicationStatus
