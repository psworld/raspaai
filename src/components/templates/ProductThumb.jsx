import React from 'react';
import CardMedia from '@material-ui/core/CardMedia';
import Card from '@material-ui/core/Card';

import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column'
  },
  cardMedia: {
    // paddingTop: "56.25%", // 16:9
    paddingTop: '125%' // 4:5
  }
}));

const ProductThumb = ({ src, alt, title }) => {
  const classes = useStyles();
  return (
    // <img
    //   style={{ width: "100%" }}
    //   title={title}
    //   alt={title}
    //   src={`${process.env.GATSBY_IMG_URL_PRE}/${src}`}
    // />
    <Card className={classes.card}>
      <CardMedia
        className={classes.cardMedia}
        image={`${process.env.GATSBY_IMG_URL_PRE}/${src}`}
        title={title}
      />
    </Card>
  );
};

export default ProductThumb;
