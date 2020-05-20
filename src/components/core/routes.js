// R stand for relative path. This is used for reach-router nested Routers

import { include } from './named-urls';

// import { include } from './named-urls';

const routes = {
  wholesaler: {
    home: include('/supply-chain/wholesaler/:wholesalerId', {
      product: 'product/:productName/:wholesalerProductId'
    }),
    dashboard: include('/dashboard/wholesaler/:wholesalerId', {
      home: '',
      products: 'products',
      addNewProducts: 'products/add'
    })
  },
  brand: include('/brand/:brandUsername', {
    home: ''
  }),
  shop: {
    dashboard: include('/dashboard/shop/:shopUsername', {
      shopOrders: 'my-orders',
      cart: 'cart',
      placeOrder: {
        self: 'place-order',
        buyCart: 'place-order/buy-cart',
        wholesaler: 'place-order/wholesaler/:wholesalerId',
        wholesalerProductDetails:
          'place-order/wholesaler/:wholesalerId/product/:wholesalerProductId'
      }
    })
  }
};

export default routes;
