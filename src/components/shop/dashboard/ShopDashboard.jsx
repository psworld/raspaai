import React from 'react';
import { Router } from '@reach/router';
import ShopDashboardHomePage from './ShopDashboardHomePage';
import MyProductsPage from './MyProductsPage';
import DashboardLayout from './components/DashboardLayout';
import AddNewProduct from './AddNewProduct';
import OrderRouter from './components/orders/OrderRouter';
import { EditReturnRefundPolicy } from './components/ShopReturnRefundPolicy';
import MyCombos from './MyCombos';
import AddNewCombo from './AddNewCombo';
import { NotFoundPageWithoutLayout } from '../../../pages/404';

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

        <NotFoundPageWithoutLayout default></NotFoundPageWithoutLayout>
      </Router>
    </DashboardLayout>
  );
};

export default ShopDashboard;
