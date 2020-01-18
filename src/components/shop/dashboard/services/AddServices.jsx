import React from 'react';
import AddNewProductBase from '../AddNewProductBase';

const AddServices = ({ shopUsername, phrase }) => {
  return (
    <AddNewProductBase
      shopUsername={shopUsername}
      phrase={phrase}
      productType='is_service'></AddNewProductBase>
  );
};

export default AddServices;
