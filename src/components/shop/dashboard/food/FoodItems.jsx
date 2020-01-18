import React from 'react';
import MyProductsBase from '../MyProductsBase';

const FoodItems = props => {
  return (
    <MyProductsBase baseProps={props} productType='is_food'></MyProductsBase>
  );
};

export default FoodItems;
