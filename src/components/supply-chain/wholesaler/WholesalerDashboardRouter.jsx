import React from 'react';
import { Router } from '@reach/router';
import DashboardLayout from './Dashboard/DashboardLayout';
import DashboardHomepage from './Dashboard/DashboardHomepage';
import WholesalerDashboardProducts from './Dashboard/WholesalerDashboardProducts';
import AddNewWholesalerProduct from './Dashboard/AddNewWholesalerProduct';
import routes from '../../core/routes';

const WholesalerDashboardRouter = ({ wholesalerId }) => {
  return (
    <DashboardLayout wholesalerId={wholesalerId}>
      <Router>
        <DashboardHomepage path='/'></DashboardHomepage>
        <WholesalerDashboardProducts
          path={`${routes.wholesaler.dashboard.productsR}`}></WholesalerDashboardProducts>
        <AddNewWholesalerProduct
          path={`${routes.wholesaler.dashboard.addNewProductsR}`}></AddNewWholesalerProduct>
      </Router>
    </DashboardLayout>
  );
};

export default WholesalerDashboardRouter;
