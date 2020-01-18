import React from 'react';
import MyProductsBase from '../MyProductsBase';

const Services = props => {
  return (
    <MyProductsBase baseProps={props} productType='is_service'></MyProductsBase>
  );
};

export default Services;
