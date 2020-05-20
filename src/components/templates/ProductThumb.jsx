import { Typography } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import { makeStyles } from '@material-ui/core/styles';
import React from 'react';
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
    backgroundSize: 'contain',
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
  quantity = false
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
      {quantity && (
        <Typography variant='body1' className={classes.overlayQuantity}>
          <center>
            <b>{getXQuantity(quantity)}</b>
          </center>
        </Typography>
      )}
    </Card>
  );
};

export default ProductThumb;
