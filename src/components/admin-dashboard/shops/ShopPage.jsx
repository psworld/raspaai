import React from 'react';
import gql from 'graphql-tag';
import { useQuery, useMutation } from 'react-apollo';
import ErrorPage from '../../core/ErrorPage';
import {
  Container,
  List,
  ListItem,
  ListItemText,
  Grid,
  Button
} from '@material-ui/core';
import MainFeaturedPost from '../../templates/MainFeaturedPost';

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
`;

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
`;

const ShopPage = ({ shopUsername }) => {
  const [
    review,
    { called, error: reviewError, data: reviewData }
  ] = useMutation(REVIEW_APPLICATION, {
    variables: { shopUsername, freeStarter: true }
  });

  const { loading, error, data } = useQuery(SHOP, {
    variables: { shopUsername }
  });
  if (loading) return <h1>Loading</h1>;
  if (error) return <ErrorPage></ErrorPage>;
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
        application: {
          submittedAt,
          updatedAt,
          status: { statusCode, title, description }
        }
      }
    } = data.shop;

    const lat = coordinates[1];
    const lng = coordinates[0];
    return (
      <>
        <MainFeaturedPost
          img={heroImage}
          title={publicUsername}></MainFeaturedPost>
        <Container maxWidth='md'>
          <List>
            <ListItem>
              <ListItemText
                primary='Application Status'
                secondary={
                  <>
                    {title}
                    <br></br>Application Data: {Date(submittedAt)}
                  </>
                }></ListItemText>
            </ListItem>
            <ListItem>
              <ListItemText
                primary='Shop General Details'
                secondary={
                  <>
                    Username: {publicUsername}
                    <br></br>
                    Name: {shopName}
                  </>
                }></ListItemText>
            </ListItem>
            <ListItem>
              <ListItemText
                primary='Owner'
                secondary={
                  <>
                    {email}
                    <br></br>
                    {firstName} {lastName}
                  </>
                }></ListItemText>
            </ListItem>
            <ListItem>
              <ListItemText
                primary='Contact Details'
                secondary={
                  <>
                    Address:{' '}
                    <a href={`${process.env.GATSBY_G_MAP_URL}${lat}, ${lng}`}>
                      {address}
                    </a>
                    <br></br> Phone No: {contactNumber}
                  </>
                }></ListItemText>
            </ListItem>
          </List>
          <Grid container justify='center'>
            <Grid item xs={6} sm={4} justify='center'>
              <Button onClick={review} color='primary' variant='contained'>
                {!called && <>Accept</>}
                {reviewData && <>Done</>}
              </Button>
            </Grid>
            <Grid item xs={6} sm={4}>
              <Button color='secondary' variant='contained'>
                Return with error
              </Button>
            </Grid>
            <Grid item xs={6} sm={4}>
              <Button color='secondary' variant='contained'>
                Ban
              </Button>
            </Grid>
          </Grid>
        </Container>
      </>
    );
  }
};

export default ShopPage;
