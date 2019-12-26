import React from 'react';
import ProductElement from './ProductElement';

const BrandProductGrid = props => {
  const { publicBrandUsername, brandProducts, isBrandDashboardProduct } = props;
  return (
    <>
      {brandProducts.map(brandProductObj => {
        const { id, title, mrp, thumb, brand } = brandProductObj.node;
        if (brand) {
          var { title: brandName } = brand;
        }
        return (
          <ProductElement
            key={id}
            id={id}
            title={title}
            thumb={thumb}
            brandName={brandName}
            publicUsername={publicBrandUsername}
            mrp={mrp}
            isBrand={true}
            isBrandDashboardProduct={isBrandDashboardProduct}></ProductElement>
        );
      })}
    </>
  );
};

export default BrandProductGrid;
