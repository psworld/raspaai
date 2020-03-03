import React from 'react';
import CardMedia from '@material-ui/core/CardMedia';
import Card from '@material-ui/core/Card';

import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import { getXQuantity } from '../core/utils';

const useStyles = makeStyles(theme => ({
  card: {
    // height: '100%',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column'
  },
  cardMedia: {
    // paddingTop: "56.25%", // 16:9
    paddingTop: '125%' // 4:5
  },
  overlay: {
    position: 'absolute',
    top: '5px',
    // left: '-30px',
    color: 'black',
    // width: '100px',
    backgroundColor: 'white'
    //   msTransform: rotate(45deg),
    // -webkit-transform: rotate(45deg),
    // transform: `rotate(-45deg)`
  },
  overlayQuantity: {
    position: 'absolute',
    bottom: '0px',
    left: '0px',
    color: 'black',
    backgroundColor: 'white'
  }
}));

const ProductThumb = ({
  src,
  title,
  thumbOverlayText = null,
  quantityOverlayText = false
}) => {
  const classes = useStyles();
  let image = src;
  const preUrl = process.env.GATSBY_IMG_URL_PRE;
  image = `${preUrl}/${src}`;
  return (
    <Card className={classes.card}>
      <CardMedia className={classes.cardMedia} image={image} title={title} />
      <Typography variant='body1' className={classes.overlay}>
        <center>
          <b>{thumbOverlayText}</b>
        </center>
      </Typography>
      {quantityOverlayText && (
        <Typography variant='body1' className={classes.overlayQuantity}>
          <center>
            <b>{getXQuantity(quantityOverlayText)}</b>
          </center>
        </Typography>
      )}
    </Card>
  );
};

export default ProductThumb;
