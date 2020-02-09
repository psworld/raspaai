import React from 'react';
import CardMedia from '@material-ui/core/CardMedia';
import Card from '@material-ui/core/Card';

import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  card: {
    // height: '100%',
    display: 'flex',
    flexDirection: 'column'
  },
  cardMedia: {
    // paddingTop: "56.25%", // 16:9
    paddingTop: '125%' // 4:5
  }
}));

const ProductThumb = ({ src, title }) => {
  const classes = useStyles();
  let image = src;
  const preUrl = process.env.GATSBY_IMG_URL_PRE;
  if (src.includes('/media/__sized__/')) {
    // The image is created thumbnail or sized image. It contains the full url including
    // media path. The '/media' will not be includes because it coming already
    // in image src
    const preUrlForSized = preUrl.split('/media')[0]; // http://localhost:8000
    image = `${preUrlForSized}${src}`;
  } else {
    image = `${process.env.GATSBY_IMG_URL_PRE}/${src}`;
  }
  return (
    <Card className={classes.card}>
      <CardMedia className={classes.cardMedia} image={image} title={title} />
    </Card>
  );
};

export default ProductThumb;
