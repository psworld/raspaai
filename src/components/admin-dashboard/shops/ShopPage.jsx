import React from "react"
import gql from "graphql-tag"
import { useQuery, useMutation } from "react-apollo"
import ErrorPage from "../../core/ErrorPage"
import {
  Card,
  CardMedia,
  useMediaQuery,
  Container,
  List,
  ListItem,
  ListItemText,
  Grid,
  Button,
} from "@material-ui/core"
import { useTheme } from "@material-ui/core/styles"
import { makeStyles } from "@material-ui/core/styles"
import MainFeaturedPost from "../../templates/MainFeaturedPost"

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

  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
}))

const SHOP = gql`
  query($shopUsername: String!) {
    shop(publicShopUsername: $shopUsername) {
      id
      geometry {
        coordinates
      }
      properties {
        publicUsername
        title
        owner {
          email
          firstName
          lastName
        }
        heroImage
        applicationDate
        contactNumber
        applicationStatus {
          statusCode
          title
        }
        address
      }
    }
  }
`

const REVIEW_APPLICATION = gql`
  mutation(
    $shopUsername: String!
    $hasError: Boolean = false
    $errors: JSONString
    $freeStarter: Boolean = false
  ) {
    reviewShopApplication(
      input: {
        publicUsername: $shopUsername
        hasError: $hasError
        errors: $errors
        freeStarter: $freeStarter
      }
    ) {
      shop {
        id
        geometry {
          coordinates
        }
        properties {
          isApplication
          applicationStatus {
            statusCode
            title
          }
        }
      }
    }
  }
`

const ShopPage = ({ shopUsername }) => {
  const classes = useStyles()
  const theme = useTheme()
  const matches = useMediaQuery(theme.breakpoints.up("sm"))

  const [
    review,
    { called, error: reviewError, data: reviewData },
  ] = useMutation(REVIEW_APPLICATION, {
    variables: { shopUsername, freeStarter: true },
  })

  const { loading, error, data } = useQuery(SHOP, {
    variables: { shopUsername },
  })
  if (loading) return <h1>Loading</h1>
  if (error) return <ErrorPage></ErrorPage>
  if (data) {
    const {
      id,
      geometry: { coordinates },
      properties: {
        publicUsername,
        title: shopName,
        owner: { email, firstName, lastName },
        heroImage,
        contactNumber,
        address,
        applicationDate,
        applicationStatus: { statusCode, title, description },
      },
    } = data.shop
    return (
      <>
        <MainFeaturedPost
          img={heroImage}
          title={publicUsername}
        ></MainFeaturedPost>
        <Container maxWidth="md">
          <List>
            <ListItem>
              <ListItemText
                primary="Application Status"
                secondary={
                  <>
                    {title}
                    <br></br>Application Data: {Date(applicationDate)}
                  </>
                }
              ></ListItemText>
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Shop General Details"
                secondary={
                  <>
                    Username: {publicUsername}
                    <br></br>
                    Name: {shopName}
                  </>
                }
              ></ListItemText>
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Owner"
                secondary={
                  <>
                    {email}
                    <br></br>
                    {firstName} {lastName}
                  </>
                }
              ></ListItemText>
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Contact Details"
                secondary={
                  <>
                    Address: {address}
                    <br></br> Phone No: {contactNumber}
                  </>
                }
              ></ListItemText>
            </ListItem>
          </List>
          <Grid container justify="center">
            <Grid item xs={6} sm={4} justify="center">
              <Button onClick={review} color="primary" variant="contained">
                {!called && <>Accept</>}
                {reviewData && <>Done</>}
              </Button>
            </Grid>
            <Grid item xs={6} sm={4}>
              <Button color="secondary" variant="contained">
                Return with error
              </Button>
            </Grid>
            <Grid item xs={6} sm={4}>
              <Button color="secondary" variant="contained">
                Ban
              </Button>
            </Grid>
          </Grid>
        </Container>
      </>
    )
  }
}

export default ShopPage
