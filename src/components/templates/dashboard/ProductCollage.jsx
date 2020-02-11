import React from 'react';

import { Grid } from '@material-ui/core';

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

  const preUrl = process.env.GATSBY_IMG_URL_PRE;

  if (inDashboardAddCombo) {
    const imagesCount = Object.keys(selectedShopProducts).length;
    const colSize = getColSize(imagesCount);

    return (
      <Grid container>
        {Object.keys(selectedShopProducts).map(key => {
          const src = selectedShopProducts[key].thumb;
          const image = `${preUrl}/${src}`;
          return (
            <Grid key={key} item xs={colSize} md={colSize}>
              <Card className={classes.card}>
                <CardMedia
                  className={classes.cardMedia}
                  image={image}
                  title={'Combo'}
                />
              </Card>
            </Grid>
          );
        })}
      </Grid>
    );
  } else {
    thumbs = JSON.parse(thumbs);

    const imagesCount = thumbs.length;
    const colSize = getColSize(imagesCount);

    return (
      <Grid container>
        {thumbs.map(src => {
          const image = `${preUrl}/${src}`;
          return (
            <Grid key={src} item xs={colSize} md={colSize}>
              <Card className={classes.card}>
                <CardMedia
                  className={classes.cardMedia}
                  image={image}
                  title={title ? title : 'combo'}
                />
              </Card>
            </Grid>
          );
        })}
      </Grid>
    );
  }
};

export default ProductCollage;
