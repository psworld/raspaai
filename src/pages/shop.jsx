import React from 'react';
import { Router } from '@reach/router';
import Layout from '../components/layout';
import ShopProduct from '../components/shop-product/ShopProduct';
import ShopHomePage from '../components/shop/ShopHomePage';
import CreateShop from '../components/shop/create-shop/CreateShop';
import ShopApplicationStatus from '../components/shop/ShopApplicationStatus';
import ShopAboutPage from '../components/shop/ShopAboutPage';

const ShopRouter = () => {
  return (
    <Layout>
      <Router>
        {/* <ShopApplicationStatus path='/shop/application/:shopUsername'></ShopApplicationStatus>
        <CreateShop path='/shop/create-shop'></CreateShop> */}
        <ShopProduct path='/shop/:shopUsername/product/:shopProductSlug/:shopProductId'></ShopProduct>
        <ShopAboutPage path='/shop/:shopUsername/about'></ShopAboutPage>
        <ShopAboutPage path='/shop/:shopUsername/about/:sectionId'></ShopAboutPage>
        <ShopHomePage path='/shop/:shopUsername/search/:phrase'></ShopHomePage>
        <ShopHomePage path='/shop/:shopUsername'></ShopHomePage>
      </Router>
    </Layout>
  );
};

export default ShopRouter;
