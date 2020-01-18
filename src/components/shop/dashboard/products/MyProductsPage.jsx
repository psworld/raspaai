import React from 'react';
import SEO from '../../../seo';
import MyProductsBase from '../MyProductsBase';

const MyProductsPage = props => {
  return (
    <>
      <SEO title={`Dashboard Products`}></SEO>
      <MyProductsBase baseProps={props}></MyProductsBase>
    </>
  );
};

export default MyProductsPage;
