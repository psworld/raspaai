import React from 'react';
import AddNewProductBase from '../AddNewProductBase';

const AddNewProduct = ({ phrase, shopUsername }) => {
  return (
    <AddNewProductBase
      shopUsername={shopUsername}
      phrase={phrase}></AddNewProductBase>
  );
};

export default AddNewProduct;
