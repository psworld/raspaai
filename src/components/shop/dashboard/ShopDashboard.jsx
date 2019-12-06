import React from 'react';
import { Router } from '@reach/router';
import ShopDashboardHomePage from './ShopDashboardHomePage';
import MyProductsPage from './MyProductsPage';
import DashboardLayout from './components/DashboardLayout';
import AddNewProduct from './AddNewProduct';
import OrderRouter from './components/orders/OrderRouter';
import { EditReturnRefundPolicy } from './components/ShopReturnRefundPolicy';

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
        <EditReturnRefundPolicy shopUsername={shopUsername} path='return-refund-policy/edit'></EditReturnRefundPolicy>
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
      </Router>
    </DashboardLayout>
  );
};

export default ShopDashboard;
