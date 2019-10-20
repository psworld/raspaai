import React from "react"
import {
  Button,
  Card,
  CardMedia,
  InputLabel,
  Typography,
  Container,
  Grid,
  TextField,
  Avatar,
  InputAdornment,
  useMediaQuery,
} from "@material-ui/core"
import LockOutlinedIcon from "@material-ui/icons/LockOutlined"
import { useTheme } from "@material-ui/core/styles"
import { makeStyles } from "@material-ui/core/styles"

import Link from "../../core/Link"
import Map from "../../map/Map"
import { hasError } from "../../signin/SigninForm"
import gql from "graphql-tag"
import { useMutation } from "react-apollo"

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
  "@global": {
    body: {
      backgroundColor: theme.palette.common.white,
    },
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

const REGISTER_SHOP = gql`
  mutation($data: ShopRegistrationApplicationInput!) {
    shopRegistrationApplication(input: $data) {
      shop {
        properties {
          publicUsername
        }
      }
    }
  }
`

const CreateShopForm = ({ handleBack, formikProps, handleFileChange, img }) => {
  const {
    values: { shopName, shopUsername, shopAddress, shopContactNumber },
    touched,
    errors,
    handleChange,
    handleBlur,
  } = formikProps

  const [location, setLocation] = React.useState(false)
  console.log("location", location)

  console.info("img", img)

  const shopRegisterApplicationInput = {
    publicUsername: shopUsername,
    shopName: shopName,
    address: shopAddress,
    contactNumber: shopContactNumber,
    imgName: img && img.file.name,
    heroImg64: img && img.base64,
    lat: location.lat,
    lng: location.lng,
  }

  const [sendApplication, { loading, error, data }] = useMutation(
    REGISTER_SHOP,
    {
      variables: { data: shopRegisterApplicationInput },
    }
  )

  const classes = useStyles()
  const theme = useTheme()
  const matches = useMediaQuery(theme.breakpoints.up("sm"))
  const [map, setMap] = React.useState(false)

  return (
    <>
      <input
        accept="image/jpeg, image/png"
        onChange={e => handleFileChange(e.target.files)}
        style={{ display: "none" }}
        id="shop-hero-img"
        aria-label="shop-hero-img"
        type="file"
      />

      <InputLabel htmlFor="shop-hero-img">
        <Card component="span" className={classes.card}>
          {img ? (
            <CardMedia
              className={
                matches ? classes.cardMediaTv : classes.cardMediaMobile
              }
              image={img.base64}
              title={img.file.name}
            />
          ) : (
            <Container maxWidth="sm">
              <Typography
                component="h1"
                variant="h3"
                align="center"
                color="textPrimary"
                gutterBottom
              >
                Click here to upload a photo
              </Typography>
              <Typography
                variant="h5"
                align="center"
                color="textSecondary"
                paragraph
              >
                Upload a picture of the shop owner(s)/manager in front of the
                store.
              </Typography>
            </Container>
          )}
        </Card>
      </InputLabel>
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
                  onChange={handleChange}
                  onBlur={handleBlur}
                  label={
                    touched.shopName && errors.shopName
                      ? `${errors.shopName}`
                      : "Your Shop Name"
                  }
                  error={touched.shopName && errors.shopName && true}
                  margin="none"
                  variant="outlined"
                  placeholder="Shop Name"
                  fullWidth
                ></TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  id="shopUsername"
                  label={
                    touched.shopUsername && errors.shopUsername
                      ? `${errors.shopUsername}`
                      : "Shop Username"
                  }
                  error={touched.shopUsername && errors.shopUsername && true}
                  defaultValue={shopUsername}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  margin="none"
                  variant="outlined"
                  placeholder="Shop Username"
                  fullWidth
                ></TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  id="shopAddress"
                  label={
                    touched.shopAddress && errors.shopAddress
                      ? `${errors.shopAddress}`
                      : "Shop Address"
                  }
                  error={touched.shopAddress && errors.shopAddress && true}
                  defaultValue={shopAddress}
                  onChange={handleChange}
                  onBlur={handleBlur}
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
                  label={
                    touched.shopContactNumber && errors.shopContactNumber
                      ? `${errors.shopContactNumber}`
                      : "Shop Contact Number"
                  }
                  error={
                    touched.shopContactNumber &&
                    errors.shopContactNumber &&
                    true
                  }
                  defaultValue={shopContactNumber}
                  onChange={handleChange}
                  onBlur={handleBlur}
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
              <Grid item xs={12} justify="center">
                {/* Location setting */}

                <Typography
                  variant="h6"
                  align="center"
                  color="textSecondary"
                  paragraph
                >
                  Set exact location of your shop. Click the button below to
                  load map and place the marker at your shop location by
                  clicking on it.
                </Typography>
              </Grid>
              <Grid item justify="center">
                <Button
                  onClick={() => setMap(!map)}
                  variant="contained"
                  color="primary"
                >
                  Set Location
                </Button>
              </Grid>

              {/* End Location Setting */}
              <Grid item xs={12}>
                {map && (
                  <Map
                    center={{ lat: 31.818543, lng: 76.936076 }}
                    setLocation={setLocation}
                    noSave={true}
                  ></Map>
                )}
              </Grid>

              <Button
                // type="submit"
                disabled={hasError(errors) || !location}
                onClick={sendApplication}
                fullWidth
                variant="contained"
                color="secondary"
                className={classes.submit}
              >
                Submit Application
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
          <Button
            style={{ marginTop: theme.spacing(1) }}
            onClick={handleBack}
            variant="contained"
            color="primary"
          >
            Back
          </Button>
        </div>
      </Container>
    </>
  )
}

export default CreateShopForm
