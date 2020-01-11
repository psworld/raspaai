import React from 'react';
import { Router } from '@reach/router';
import ShopDashboard from '../components/shop/dashboard/ShopDashboard';
import BrandDashboard from '../components/brand/Dashboard/BrandDashboard';
import NotFoundPage from './404';
import BuyPlans from '../components/shop/dashboard/components/plans/buy/BuyPlans';
import PaymentResponse from '../components/shop/dashboard/components/plans/buy/PaymentResponse';

const Dashboard = () => {
  return (
    <Router>
      <PaymentResponse path='/dashboard/shop/plans/buy/payment/:status/:orderId'></PaymentResponse>
      <BuyPlans path='/dashboard/shop/:shopUsername/plans/buy'></BuyPlans>

      <ShopDashboard path='/dashboard/shop/:shopUsername/*'></ShopDashboard>
      <BrandDashboard path='/dashboard/brand/:brandUsername/*'></BrandDashboard>
      <NotFoundPage default></NotFoundPage>
    </Router>
  );
};

export default Dashboard;
