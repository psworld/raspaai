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
  image = `${preUrl}/${src}`;
  return (
    <Card className={classes.card}>
      <CardMedia className={classes.cardMedia} image={image} title={title} />
    </Card>
  );
};

export default ProductThumb;
