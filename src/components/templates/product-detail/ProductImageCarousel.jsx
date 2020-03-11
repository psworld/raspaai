import React from 'react';
import { Carousel } from 'react-responsive-carousel';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import styles from 'react-responsive-carousel/lib/styles/carousel.min.css';
import { Typography } from '@material-ui/core';

const ProductImageCarousel = ({
  imagesNodeList,
  alt,
  thumbOverlayText = false
}) => {
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up('sm'));

  return (
    <Carousel showThumbs={matches} showArrows={true}>
      {imagesNodeList
        .sort((a, b) => a.node.position - b.node.position)
        .map(imgObj => {
          const { id, image } = imgObj.node;
          return (
            <div key={id}>
              <img
                src={`${process.env.GATSBY_IMG_URL_PRE}/${image}`}
                style={{ maxHeight: '56.25%', maxWidth: '100%' }}
                alt={alt}></img>
              <Typography
                variant='body1'
                style={{
                  position: 'absolute',
                  top: '5px',
                  color: 'black',
                  backgroundColor: 'white'
                }}>
                <b>{thumbOverlayText}</b>
              </Typography>
            </div>
          );
        })}
    </Carousel>
  );
};

export default ProductImageCarousel;
