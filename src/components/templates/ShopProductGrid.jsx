import React from 'react';
import ProductElement from './ProductElement';

const ShopProductGrid = props => {
  const { shopProducts } = props;
  return (
    <>
      {shopProducts.map(shopProduct => {
        const {
          id,
          shop: {
            properties: { title: shopName, publicUsername }
          },
          offeredPrice,
          product: { title, mrp, thumb }
        } = shopProduct.node;
        return (
          <ProductElement
            key={id}
            id={id}
            title={title}
            thumb={thumb}
            shopName={shopName}
            publicUsername={publicUsername}
            offeredPrice={offeredPrice}
            mrp={mrp}
            isBrand={false}></ProductElement>
        );
      })}
    </>
  );
};

export default ShopProductGrid;
