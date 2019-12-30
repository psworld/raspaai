import React from 'react';
import Dashboard from './components/Dashboard';
import SEO from '../../seo';

const ShopDashboardHomePage = ({ shopUsername }) => {
  return (
    <>
      <SEO title={`Dashboard ${shopUsername}`}></SEO>
      <Dashboard publicUsername={shopUsername}></Dashboard>
    </>
  );
};

export default ShopDashboardHomePage;
