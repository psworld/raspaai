import React from 'react';
import { Carousel } from 'react-responsive-carousel';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import styles from 'react-responsive-carousel/lib/styles/carousel.min.css';

const ProductImageCarousel = ({ imagesNodeList, alt }) => {
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up('sm'));

  return (
    <Carousel showThumbs={matches} infiniteLoop showArrows={true}>
      {imagesNodeList.map(imgObj => {
        const { id, image } = imgObj.node;
        return (
          <div key={id}>
            <img
              src={`${process.env.GATSBY_IMG_URL_PRE}/${image}`}
              style={{ maxHeight: '56.25%', maxWidth: '100%' }}
              alt={alt}></img>
          </div>
        );
      })}
    </Carousel>
  );
};

export default ProductImageCarousel;
