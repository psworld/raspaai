import React from 'react';
import CardMedia from '@material-ui/core/CardMedia';
import Card from '@material-ui/core/Card';

import { makeStyles } from '@material-ui/core/styles';
import Link from '../core/Link';

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

const MainFeaturedPost = ({ img, toImageSrc = false, title }) => {
  const classes = useStyles();

  let image = img;
  const preUrl = process.env.GATSBY_IMG_URL_PRE;
  if (img.includes('/media/__sized__/')) {
    // The image is created thumbnail or sized image. It contains the full url including
    // media path. The '/media' will not be includes because it coming already
    // in image src
    const preUrlForSized = preUrl.split('/media')[0]; // http://localhost:8000
    image = `${preUrlForSized}${img}`;
  } else {
    image = `${process.env.GATSBY_IMG_URL_PRE}/${img}`;
  }

  toImageSrc = toImageSrc
    ? `${process.env.GATSBY_IMG_URL_PRE}/${toImageSrc}`
    : image;
  return (
    <Card
      component={Link}
      to={`/images/${title}`}
      state={{ src: toImageSrc }}
      className={classes.card}>
      <CardMedia className={classes.cardMedia} image={image} title={title} />
    </Card>
  );
};

export default MainFeaturedPost;
