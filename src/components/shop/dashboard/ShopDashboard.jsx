import { Router } from '@reach/router';
import React from 'react';
import { ShopDashboardProfile } from '../dashboard/components/Dashboard';
import AddNewCombo from './AddNewCombo';
import AddNewProduct from './AddNewProduct';
import DashboardLayout from './components/DashboardLayout';
import OrderRouter from './components/orders/OrderRouter';
import MyShopPlans from './components/plans/MyShopPlans';
import { EditReturnRefundPolicy } from './components/ShopReturnRefundPolicy';
import MyCombos from './MyCombos';
import MyProductsPage from './MyProductsPage';
import ShopDashboardHomePage from './ShopDashboardHomePage';

const ShopDashboard = props => {
  const { shopUsername } = props;
  const [searchPhrase, setSearchPhrase] = React.useState('');
  return (
    <DashboardLayout
      searchPhrase={searchPhrase}
      setSearchPhrase={setSearchPhrase}
      publicUsername={shopUsername}>
      <Router>
        <ShopDashboardHomePage
          path='/'
          shopUsername={shopUsername}></ShopDashboardHomePage>
        <MyProductsPage path='products'></MyProductsPage>
        <MyShopPlans path='plans' shopUsername={shopUsername}></MyShopPlans>
        <ShopDashboardProfile
          path='profile'
          shopUsername={shopUsername}></ShopDashboardProfile>
        <EditReturnRefundPolicy
          shopUsername={shopUsername}
          path='return-refund-policy/edit'></EditReturnRefundPolicy>
        <MyCombos shopUsername={shopUsername} path='combos'></MyCombos>
        <AddNewCombo
          shopUsername={shopUsername}
          path='combos/create'></AddNewCombo>
        <MyCombos
          shopUsername={shopUsername}
          path='combos/search/:phrase'></MyCombos>
        <AddNewProduct
          shopUsername={shopUsername}
          path='products/add'></AddNewProduct>
        <AddNewProduct
          shopUsername={shopUsername}
          path='products/add/search/:phrase'></AddNewProduct>
        <MyProductsPage
          shopUsername={shopUsername}
          path='products/search/:phrase'></MyProductsPage>
        <OrderRouter shopUsername={shopUsername} path='orders/*'></OrderRouter>

        {/* <NotFoundPageWithoutLayout default></NotFoundPageWithoutLayout> */}
      </Router>
    </DashboardLayout>
  );
};

export default ShopDashboard;
