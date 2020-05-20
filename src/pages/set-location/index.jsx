import React from 'react';
import Layout from '../../components/layout';
import { Link } from 'gatsby';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import PopularPlaces, {
  PopularPlace
} from '../../components/map/PopularPlaces';
import { useQuery } from 'react-apollo';
import { LOCAL_SAVED_LOCATION } from '..';
import { decryptText } from '../../components/core/utils';

const useStyles = makeStyles(theme => ({
  heroContent: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(4, 0, 6)
  },
  heroButtons: {
    marginTop: theme.spacing(4)
  },
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column'
  },
  cardMedia: {
    // paddingTop: "56.25%", // 16:9
    paddingTop: '80%'
  },
  cardContent: {
    flexGrow: 1
  }
}));

const HeroUnit = () => {
  const classes = useStyles();
  return (
    <div className={classes.heroContent}>
      <Container maxWidth='sm'>
        <Typography
          component='h1'
          variant='h4'
          align='center'
          color='textPrimary'
          gutterBottom>
          Click on one of the places below to see what's available there !
        </Typography>
        <Typography variant='h5' align='center' color='textSecondary' paragraph>
          You can also use your current location.
        </Typography>

        <Typography
          variant='caption'
          align='center'
          color='textSecondary'
          paragraph>
          * Getting your current accurate location requires GPS.
        </Typography>
        <div className={classes.heroButtons}>
          <Grid container spacing={2} justify='center'>
            <Grid item>
              <Button
                component={Link}
                to='/set-location/automatic'
                variant='outlined'
                color='primary'>
                Use My Current Location
              </Button>
            </Grid>
          </Grid>
        </div>
      </Container>
    </div>
  );
};

const SetLocation = () => {
  const { data, client } = useQuery(LOCAL_SAVED_LOCATION);

  const currentLocation =
    data && JSON.parse(decryptText(data.localSavedLocation));

  return (
    <Layout>
      <HeroUnit></HeroUnit>
      <Typography variant='h5'>Current Location</Typography>

      {data && data.localSavedLocation && (
        <>
          <PopularPlace
            title={currentLocation.name}
            coordinates={[currentLocation.lng, currentLocation.lat]}
            image={currentLocation.image}
            client={client}></PopularPlace>
          <br></br>
          <Typography variant='h5'>Other Locations</Typography>
          <div id='places'>
            <PopularPlaces currentLocation={currentLocation}></PopularPlaces>
          </div>
        </>
      )}
    </Layout>
  );
};

export default SetLocation;
