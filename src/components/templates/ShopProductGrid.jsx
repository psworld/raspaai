import React from 'react';
import ProductElement from './ProductElement';

const ShopProductGrid = props => {
  const { shopProducts, shop } = props;

  return (
    <>
      {shopProducts.map(shopProduct => {
        const {
          id,
          offeredPrice,
          product: { title, mrp, thumb }
        } = shopProduct.node;
        if (shop) {
          var {
            properties: { title: shopName, publicUsername }
          } = shop;
        } else {
          var {
            properties: { title: shopName, publicUsername }
          } = shopProduct.node.shop;
        }

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
