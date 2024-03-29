import { Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import React from 'react';
import ProductThumb from '../ProductThumb';

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
    bottom: '0px',
    left: '0px',
    color: 'black',
    backgroundColor: 'white'
    //   msTransform: rotate(45deg),
    // -webkit-transform: rotate(45deg),
  }
}));

const ProductCollage = ({
  selectedShopProducts,
  thumbs,
  title,
  inDashboardAddCombo = false
}) => {
  const classes = useStyles();

  const getColSize = imagesCount => {
    switch (imagesCount) {
      case 2:
        return 6;
      case 3:
        return 6;
      case 4:
        return 6;

      default:
        return 2;
    }
  };

  if (inDashboardAddCombo) {
    const imagesCount = Object.keys(selectedShopProducts).length;
    const colSize = getColSize(imagesCount);

    return (
      <Grid container>
        {Object.keys(selectedShopProducts).map(key => {
          const shopProduct = selectedShopProducts[key];
          const src = shopProduct.thumb;
          const thumbOverlayText = shopProduct.thumbOverlayText;
          const quantity = shopProduct.quantity;

          return (
            <Grid key={key} item xs={colSize} md={colSize}>
              <ProductThumb
                src={src}
                thumbOverlayText={thumbOverlayText}
                quantity={quantity}></ProductThumb>
            </Grid>
          );
        })}
      </Grid>
    );
  } else {
    thumbs = JSON.parse(thumbs);

    const imagesCount = thumbs.length;
    const colSize = getColSize(imagesCount);
    const thumbsStructure = [
      { src: '/media/img1.jpg', overlayText: '1 kg', quantity: 2 },
      { src: '/media/img2.jpg', overlayText: '1 kg', quantity: 1 }
    ];
    return (
      <Grid container>
        {thumbs.map(thumb => {
          const src = thumb.src;
          const overlayText = thumb.overlayText;
          const quantity = thumb.quantity;
          return (
            <Grid key={src} item xs={colSize} md={colSize}>
              <ProductThumb
                src={src}
                thumbOverlayText={overlayText}
                quantity={quantity}></ProductThumb>
            </Grid>
          );
        })}
      </Grid>
    );
  }
};

export default ProductCollage;
