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
  Button,
  Typography
} from '@material-ui/core';
import MainFeaturedPost from '../../templates/MainFeaturedPost';
import { navigate } from 'gatsby';
import GraphqlErrorMessage from '../../core/GraphqlErrorMessage';

const BRAND_APPLICATION = gql`
  query($applicationId: ID!) {
    brandApplication(id: $applicationId) {
      id
      brand {
        id
        owner {
          id
          email
          firstName
          lastName
        }
        publicUsername
        title
        heroImage
      }
      submittedAt
      status {
        id
        statusCode
        title
        description
      }
    }
  }
`;

const REVIEW_APPLICATION = gql`
  mutation(
    $applicationId: ID!
    $hasError: Boolean = false
    $errors: JSONString
  ) {
    reviewBrandApplication(
      input: {
        applicationId: $applicationId
        hasError: $hasError
        errors: $errors
      }
    ) {
      brand {
        id
        publicUsername
      }
    }
  }
`;

const BrandPage = ({ brandUsername, applicationId }) => {
  const [
    review,
    { called, error: reviewError, data: reviewData, loading: reviewLoading }
  ] = useMutation(REVIEW_APPLICATION, {
    variables: { applicationId },
    onCompleted: data => {
      const {
        reviewBrandApplication: {
          brand: { publicUsername }
        }
      } = data;
      navigate(`/brand/${publicUsername}`);
    }
  });

  const { loading, error, data } = useQuery(BRAND_APPLICATION, {
    variables: { applicationId }
  });
  if (loading) return <h1>Loading</h1>;
  if (error) return <ErrorPage></ErrorPage>;
  if (data) {
    const {
      brand: {
        owner: { email, firstName, lastName },
        publicUsername,
        title: brandName,
        heroImage
      },
      status: { statusCode, title, description }
    } = data.brandApplication;
    return (
      <>
        <MainFeaturedPost
          img={heroImage}
          title={publicUsername}></MainFeaturedPost>
        <Container maxWidth='md'>
          <List>
            <ListItem>
              <Typography variant='h4'>Application Details</Typography>
            </ListItem>
            <ListItem>
              <ListItemText
                primary='Status'
                secondary={<>{title}</>}></ListItemText>
            </ListItem>
            <ListItem>
              <ListItemText
                primary='Status Code'
                secondary={<>{statusCode}</>}></ListItemText>
            </ListItem>

            <ListItem>
              <Typography variant='h4'>Brand General Details</Typography>
            </ListItem>
            <ListItem>
              <ListItemText
                primary='Username'
                secondary={publicUsername}></ListItemText>
            </ListItem>
            <ListItem>
              <ListItemText primary='Name' secondary={brandName}></ListItemText>
            </ListItem>

            <ListItem>
              <Typography variant='h4'>Owner Details</Typography>
            </ListItem>
            <ListItem>
              <ListItemText primary='Email' secondary={email}></ListItemText>
            </ListItem>
            <ListItem>
              <ListItemText
                primary='Name'
                secondary={`${firstName} ${lastName}`}></ListItemText>
            </ListItem>
            <ListItem>
              {reviewError && (
                <GraphqlErrorMessage error={reviewError}></GraphqlErrorMessage>
              )}
            </ListItem>
          </List>
          <Grid container justify='center'>
            <Grid item xs={6} sm={4} justify='center'>
              <Button
                disabled={reviewLoading}
                onClick={review}
                color='primary'
                variant='contained'>
                {reviewData ? <>Done</> : <>Accept</>}
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

export default BrandPage;
