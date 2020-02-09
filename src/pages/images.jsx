import React from 'react';
import { Router } from '@reach/router';
import { NotFoundPageWithoutLayout } from './404';

export const ImagePage = ({ location, alt }) => {
  const src = location && location.state && location.state.src;
  if (src) {
    return <img src={src} alt={alt} width='100%'></img>;
  } else return <></>;
};

const Images = () => {
  return (
    <Router>
      <ImagePage path='/images/:alt'></ImagePage>
      <NotFoundPageWithoutLayout default></NotFoundPageWithoutLayout>
    </Router>
  );
};

export default Images;
