import { Card, CardMedia } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import React from 'react';
import { Carousel } from 'react-responsive-carousel';
import styles from 'react-responsive-carousel/lib/styles/carousel.min.css';
import RaspaaiImage from '../../images/shiva1.jpg';

const useStyles = makeStyles(theme => ({
  card: {
    // height: "100%",
    display: 'flex',
    flexDirection: 'column',
    marginBottom: theme.spacing(0)
  },
  cardMedia: {
    paddingTop: '56.25%', // 16:9
    [theme.breakpoints.up('md')]: {
      paddingTop: '35%'
    }
  }
}));

const HeroUnit = ({ location }) => {
  const classes = useStyles();
  return (
    <Carousel showIndicators={false} showStatus={false} showThumbs={false}>
      <div>
        <Card className={classes.card}>
          <CardMedia
            image={RaspaaiImage}
            title='Maha Shivratri'
            className={classes.cardMedia}></CardMedia>
        </Card>
      </div>
    </Carousel>
  );
};

export default HeroUnit;
