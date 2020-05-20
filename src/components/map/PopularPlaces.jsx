import { Typography, Button, Card, CardMedia } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import { navigate } from 'gatsby';
import gql from 'graphql-tag';
import React from 'react';
import { useApolloClient, useQuery } from 'react-apollo';
import sq1 from '../../images/raspaai-sq.svg';
import ErrorPage from '../core/ErrorPage';
import SquareElementGridSkeleton from '../skeletons/SquareElementSkeleton';
import Link from '../core/Link';
import { encryptText } from '../core/utils';

export const POPULAR_PLACES = gql`
  query($lat: Float, $lng: Float) {
    popularPlaces(lat: $lat, lng: $lng, first: 20) {
      edges {
        node {
          id
          geometry {
            coordinates
          }
          properties {
            name
            image
          }
        }
      }
    }
  }
`;

export const PopularPlace = ({
  popularPlaceId,
  title,
  coordinates,
  image,
  adminDashboard,
  client,
  ...props
}) => {
  const lat = coordinates[1];
  const lng = coordinates[0];
  let imgSrc = image ? `${process.env.GATSBY_IMG_URL_PRE}/${image}` : sq1;

  const savedLocation = {
    name: title,
    lat,
    lng
  };

  if (image) savedLocation['image'] = image;
  const encSavedLocation = encryptText(JSON.stringify(savedLocation));
  return (
    <Grid item xs={4} sm={3} md={2} lg={2}>
      <Box px={1} my={2}>
        <Box
          onClick={() =>
            localStorage.setItem('lla', encSavedLocation) &
            client.writeData({
              data: { localSavedLocation: encSavedLocation }
            }) &
            navigate('/')
          }
          my={1}>
          <Card>
            <CardMedia
              style={{ paddingTop: '100%' }}
              image={imgSrc}
              title={title}
            />
          </Card>
          <Typography variant='h6'>{title}</Typography>
        </Box>
        {adminDashboard && (
          <>
            <Button
              variant='outlined'
              component={Link}
              to={`/raspaai/dashboard/popular-place/edit/${popularPlaceId}`}>
              Edit
            </Button>
            <br></br>
          </>
        )}
        <a
          href={`${process.env.GATSBY_G_MAP_URL}${lat},${lng}`}
          target='_blank'
          rel='noopener noreferrer'>
          See on map
        </a>
      </Box>
    </Grid>
  );
};

const PopularPlaces = ({ currentLocation, adminDashboard = false }) => {
  const client = useApolloClient();
  const { loading, error, data } = useQuery(
    POPULAR_PLACES
    // {
    // variables: {
    //   lat: currentLocation.lat,
    //   lng: currentLocation.lng
    // }
    // }
  );

  if (loading) return <SquareElementGridSkeleton></SquareElementGridSkeleton>;
  if (error) return <ErrorPage></ErrorPage>;
  if (data && data.popularPlaces) {
    const {
      popularPlaces: { edges: popularPlaces }
    } = data;
    return (
      <Grid container>
        {popularPlaces.map(popularPlaceObj => {
          const {
            id,
            geometry: { coordinates },
            properties: { name, image }
          } = popularPlaceObj.node;
          return (
            <PopularPlace
              key={id}
              popularPlaceId={id}
              adminDashboard={adminDashboard}
              client={client}
              image={image}
              coordinates={coordinates}
              title={name}></PopularPlace>
          );
        })}
      </Grid>
    );
  }
};

export default PopularPlaces;
