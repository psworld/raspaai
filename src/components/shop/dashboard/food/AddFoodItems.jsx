import React from 'react';
import AddNewProductBase from '../AddNewProductBase';

const AddFoodItems = ({ shopUsername, phrase }) => {
  return (
    <AddNewProductBase
      shopUsername={shopUsername}
      phrase={phrase}
      productType='is_food'></AddNewProductBase>
  );
};

export default AddFoodItems;
