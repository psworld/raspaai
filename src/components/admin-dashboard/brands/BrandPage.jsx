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

const BRAND = gql`
  query($publicBrandUsername: String!) {
    brand(publicBrandUsername: $publicBrandUsername) {
      id
      owner {
        email
        firstName
        lastName
      }
      publicUsername
      title
      heroImage
      applicationStatus {
        statusCode
        title
        description
      }
    }
  }
`

const REVIEW_APPLICATION = gql`
  mutation(
    $publicUsername: String!
    $hasError: Boolean = false
    $errors: JSONString
    $freeStarter: Boolean = false
  ) {
    reviewBrandApplication(
      input: {
        publicUsername: $publicUsername
        hasError: $hasError
        errors: $errors
        freeStarter: $freeStarter
      }
    ) {
      brand {
        id
        isApplication
        applicationStatus {
          statusCode
          title
        }
      }
    }
  }
`

const BrandPage = ({ brandUsername }) => {
  const classes = useStyles()
  const theme = useTheme()
  const matches = useMediaQuery(theme.breakpoints.up("sm"))

  const [
    review,
    { called, error: reviewError, data: reviewData },
  ] = useMutation(REVIEW_APPLICATION, {
    variables: { publicUsername: brandUsername, freeStarter: true },
  })

  const { loading, error, data } = useQuery(BRAND, {
    variables: { publicBrandUsername: brandUsername },
  })
  if (loading) return <h1>Loading</h1>
  if (error) return <ErrorPage></ErrorPage>
  if (data) {
    const {
      id,
      owner: { email, firstName, lastName },
      publicUsername,
      title: brandName,
      heroImage,
      applicationStatus: { statusCode, title, description },
    } = data.brand
    return (
      <>
        <Card className={classes.card}>
          <CardMedia
            className={matches ? classes.cardMediaTv : classes.cardMediaMobile}
            image={`http://localhost:8000/media/${heroImage}`}
          ></CardMedia>
        </Card>
        <Container maxWidth="md">
          <List>
            <ListItem>
              <ListItemText
                primary="Application Status"
                secondary={<>{title}</>}
              ></ListItemText>
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Brand General Details"
                secondary={
                  <>
                    {publicUsername}
                    <br></br>
                    {brandName}
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

export default BrandPage
