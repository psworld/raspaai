import React from 'react';
import { Router } from '@reach/router';
import ShopDashboardRouter from '../components/shop/dashboard/ShopDashboardRouter';
import BrandDashboardRouter from '../components/brand/Dashboard/BrandDashboardRouter';
import BuyPlans from '../components/shop/dashboard/components/plans/buy/BuyPlans';
import PaymentResponse from '../components/shop/dashboard/components/plans/buy/PaymentResponse';

const Dashboard = () => {
  return (
    <Router>
      <PaymentResponse path='/dashboard/shop/plans/buy/payment/:status/:orderId'></PaymentResponse>
      <BuyPlans path='/dashboard/shop/:shopUsername/plans/buy'></BuyPlans>

      <ShopDashboardRouter path='/dashboard/shop/:shopUsername/*'></ShopDashboardRouter>
      <BrandDashboardRouter path='/dashboard/brand/:brandUsername/*'></BrandDashboardRouter>
    </Router>
  );
};

export default Dashboard;
