import React from 'react';
import Layout from '../../components/layout';
import { Link } from 'gatsby';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import PopularPlaces from '../../components/map/PopularPlaces';
import { useQuery } from 'react-apollo';
import { LOCAL_SAVED_LOCATION } from '..';
import { decryptText } from '../../components/core/utils';

const useStyles = makeStyles(theme => ({
  heroContent: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(8, 0, 6)
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
          variant='h2'
          align='center'
          color='textPrimary'
          gutterBottom>
          Raspaai
        </Typography>
        <Typography variant='h5' align='center' color='textSecondary' paragraph>
          You can also get location automatically.
        </Typography>

        <Typography
          variant='caption'
          align='center'
          color='textSecondary'
          paragraph>
          * Getting accurate location automatically requires GPS.
        </Typography>
        <div className={classes.heroButtons}>
          <Grid container spacing={2} justify='center'>
            <Grid item>
              <Button
                component={Link}
                to='/set-location/automatic'
                variant='outlined'
                color='primary'>
                automatic
              </Button>
            </Grid>
          </Grid>
        </div>
      </Container>
    </div>
  );
};

const SetLocation = () => {
  const { data } = useQuery(LOCAL_SAVED_LOCATION);

  const currentLocation =
    data && JSON.parse(decryptText(data.localSavedLocation));

  return (
    <Layout>
      {/* <HeroUnit></HeroUnit> */}
      <Typography variant='h5' align='center'>
        Click on one of the places below to see what's available there !
      </Typography>
      {data && data.localSavedLocation && (
        <PopularPlaces currentLocation={currentLocation}></PopularPlaces>
      )}
    </Layout>
  );
};

export default SetLocation;
