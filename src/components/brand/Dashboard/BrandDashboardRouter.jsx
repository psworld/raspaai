import { Router } from '@reach/router';
import React from 'react';
import { NotFoundPageWithoutLayout } from '../../../pages/404';
import AddNewBrandProduct from './AddNewBrandProduct';
import BrandDashboardHomePage from './BrandDashboardHomePage';
import BrandDashboardLayout from './BrandDashboardLayout';
import EditBrandProduct from './edit-product/EditBrandProduct';
import MyProductsPage from './MyProductsPage';
import MyBrandPlans from './plans/MyBrandPlans';
import AvailablePlans from './plans/buy/AvailablePlans';

const BrandDashboardRouter = props => {
  const { brandUsername } = props;
  return (
    <BrandDashboardLayout publicUsername={brandUsername}>
      <Router>
        <BrandDashboardHomePage
          path='/'
          brandUsername={brandUsername}></BrandDashboardHomePage>
        <MyBrandPlans path='plans' brandUsername={brandUsername}></MyBrandPlans>
        <AvailablePlans path='plans/buy'></AvailablePlans>
        <EditBrandProduct path='product/edit/:productSlug/:id'></EditBrandProduct>
        <AddNewBrandProduct
          path='products/add'
          brandUsername={brandUsername}></AddNewBrandProduct>
        <MyProductsPage
          path='products'
          brandUsername={brandUsername}></MyProductsPage>
        <MyProductsPage
          brandUsername={brandUsername}
          path='products/search/:phrase'></MyProductsPage>
        <NotFoundPageWithoutLayout default></NotFoundPageWithoutLayout>
      </Router>
    </BrandDashboardLayout>
  );
};

export default BrandDashboardRouter;
