// Element for shop, wholesalers, brand or anything with hero image
import React from 'react';
import Link from '../core/Link';
import { Typography, Grid, Box } from '@material-ui/core';

import CardMedia from '@material-ui/core/CardMedia';
import Card from '@material-ui/core/Card';

import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  card: {
    // height: "100%",
    display: 'flex',
    flexDirection: 'column',
    marginBottom: theme.spacing(2)
  },
  cardMedia: {
    // paddingTop: "56.25%", // 16:9
    paddingTop: '75%', // 4:3
    backgroundSize: 'contain',
    [theme.breakpoints.up('md')]: {
      paddingTop: '45%'
    }
  }
}));

export const HeroElementGridItem = ({
  children,
  xs = 6,
  sm = 4,
  md = 3,
  lg = 2,
  px = 1,
  my = 1
}) => {
  return (
    <Grid item xs={xs} sm={sm} md={md} lg={lg}>
      <Box px={px} my={my}>
        {children}
      </Box>
    </Grid>
  );
};

const HeroImage = ({ img, title }) => {
  const classes = useStyles();

  let image = img;
  const preUrl = process.env.GATSBY_IMG_URL_PRE;

  image = `${preUrl}/${img}`;

  return (
    <Card className={classes.card}>
      <CardMedia className={classes.cardMedia} image={image} title={title} />
    </Card>
  );
};

const HeroElement = ({ img, title, toImageSrc, primaryText, primaryLink }) => {
  console.info(primaryLink);
  return (
    <Link to={primaryLink}>
      <HeroImage img={img} title={title} toImageSrc={toImageSrc}></HeroImage>
      <Typography variant='subtitle1' color='textPrimary'>
        {primaryText}
      </Typography>
    </Link>
  );
};

export default HeroElement;

export const WholesalerElement = ({ wholesalerNode, primaryLink }) => {
  const { image, name } = wholesalerNode;
  return (
    <HeroElement
      img={image}
      title={name}
      primaryText={name}
      primaryLink={primaryLink}></HeroElement>
  );
};
