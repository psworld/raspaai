import React from 'react';
import { Router } from '@reach/router';
import Layout from '../components/layout';
import WholesalerHomepage from '../components/supply-chain/wholesaler/WholesalerHomepage';
import routes from '../components/core/routes';
import WholesalerProductDetails from '../components/supply-chain/wholesaler/WholesalerProductDetails';

const SupplyChainRouter = () => {
  return (
    <Layout>
      <Router>
        <WholesalerHomepage
          path={`${routes.wholesaler.home}`}></WholesalerHomepage>
        <WholesalerProductDetails
          path={`${routes.wholesaler.home.product}`}></WholesalerProductDetails>
      </Router>
    </Layout>
  );
};

export default SupplyChainRouter;
