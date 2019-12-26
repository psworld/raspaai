import React from 'react';
import { Router } from '@reach/router';
import ShopDashboard from '../components/shop/dashboard/ShopDashboard';
import BrandDashboard from '../components/brand/Dashboard/BrandDashboard';
import NotFoundPage from './404';

const Dashboard = () => {
  return (
    <Router>
      <ShopDashboard path='/dashboard/shop/:shopUsername/*'></ShopDashboard>
      <BrandDashboard path='/dashboard/brand/:brandUsername/*'></BrandDashboard>
      <NotFoundPage default></NotFoundPage>
    </Router>
  );
};

export default Dashboard;
