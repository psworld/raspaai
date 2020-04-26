import { Button, Container, Grid, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Link, navigate } from 'gatsby';
import React from 'react';
import { Carousel } from 'react-responsive-carousel';
import styles from 'react-responsive-carousel/lib/styles/carousel.min.css';

const useStyles = makeStyles(theme => ({
  heroContent: {
    backgroundColor: theme.palette.background.paper,
    // background:
    //   'linear-gradient(180deg, #E0E0E0, rgba(250, 250, 250, 0.8) 90%)',
    padding: theme.spacing(8, 0, 6),
    paddingBottom: 'auto',
    height: '100%'
  },
  heroButtons: {
    marginTop: theme.spacing(4)
  }
}));

const HeroUnit = ({ location }) => {
  const classes = useStyles();
  return (
    <Carousel
      showThumbs={false}
      infiniteLoop
      autoPlay
      interval={5000}
      showStatus={false}>
      <div style={{ height: '100%' }}>
        <div className={classes.heroContent}>
          <Container maxWidth='sm'>
            <Typography
              variant='h3'
              align='center'
              color='textPrimary'
              gutterBottom>
              Raspaai
            </Typography>
            <Typography
              variant='h5'
              align='center'
              color='textSecondary'
              paragraph>
              Raspaai | Find everything around you
            </Typography>
            <div className={classes.heroButtons}>
              <Grid container spacing={2} justify='center'>
                <Grid item>
                  <Button variant='contained' color='primary'>
                    {location.name}
                  </Button>
                </Grid>
                <Grid item>
                  <Button
                    component={Link}
                    to='/set-location'
                    variant='outlined'
                    color='primary'>
                    set new location
                  </Button>
                </Grid>
              </Grid>
            </div>
          </Container>
        </div>
      </div>

      <div>
        <div className={classes.heroContent}>
          <Container maxWidth='sm'>
            <Typography
              variant='h3'
              align='center'
              color='textPrimary'
              gutterBottom>
              Do you own a shop ?
            </Typography>
            <Typography
              variant='h5'
              align='center'
              color='textSecondary'
              paragraph>
              Register with us and take your shop online for absolutely free !
            </Typography>
            <div className={classes.heroButtons}>
              <Button
                onClick={() => navigate('/shop/create-shop')}
                variant='contained'
                color='primary'>
                Register
              </Button>
            </div>
          </Container>
        </div>
      </div>
    </Carousel>
  );
};

export default HeroUnit;
