import React from 'react';
import Grid from '@material-ui/core/Grid';
import DashboardProductElement from './DashboardProductElement';

const DashboardBrandProductGrid = ({
  products,
  addShopProduct,
  isBrand,
  publicShopUsername
}) => {
  return (
    <Grid container>
      {products.map(productObj => {
        const {
          id,
          title,
          mrp,
          thumb,
          brand: { title: brandName, publicUsername }
        } = productObj.node;
        return (
          <DashboardProductElement
            key={id}
            id={id}
            title={title}
            brandUsername={publicUsername}
            brandName={brandName}
            publicUsername={publicShopUsername}
            thumb={thumb}
            mrp={mrp}
            addShopProduct={addShopProduct}
            isBrand={isBrand}
            action={'add'}></DashboardProductElement>
        );
      })}
    </Grid>
  );
};

export default DashboardBrandProductGrid;
