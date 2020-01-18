import { Router } from '@reach/router';
import React from 'react';
import { ShopDashboardProfile } from './components/Dashboard';
import DashboardLayout from './components/DashboardLayout';
import OrderRouter from './components/orders/OrderRouter';
import MyShopPlans from './components/plans/MyShopPlans';
import { EditReturnRefundPolicy } from './components/ShopReturnRefundPolicy';
import ShopDashboardHomePage from './ShopDashboardHomePage';
import Services from './services/Services';
import AddServices from './services/AddServices';
import MyCombos from './combos/MyCombos';
import AddNewComboHOC from './combos/AddNewCombo';
import AddNewProduct from './products/AddNewProduct';
import MyProductsPage from './products/MyProductsPage';
import FoodItems from './food/FoodItems';
import AddFoodItems from './food/AddFoodItems';

const ShopDashboardRouter = props => {
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

        <MyShopPlans path='plans' shopUsername={shopUsername}></MyShopPlans>
        <ShopDashboardProfile
          path='profile'
          shopUsername={shopUsername}></ShopDashboardProfile>
        <EditReturnRefundPolicy
          shopUsername={shopUsername}
          path='return-refund-policy/edit'></EditReturnRefundPolicy>

        <MyCombos
          shopUsername={shopUsername}
          path='combos/search/:phrase'></MyCombos>
        <AddNewComboHOC
          shopUsername={shopUsername}
          path='combos/add'></AddNewComboHOC>
        <MyCombos shopUsername={shopUsername} path='combos'></MyCombos>

        <AddNewProduct
          shopUsername={shopUsername}
          path='products/add/search/:phrase'></AddNewProduct>
        <AddNewProduct
          shopUsername={shopUsername}
          path='products/add'></AddNewProduct>
        <MyProductsPage
          shopUsername={shopUsername}
          path='products/search/:phrase'></MyProductsPage>
        <MyProductsPage
          path='products'
          shopUsername={shopUsername}></MyProductsPage>

        <AddFoodItems
          path='food/add/search/:phrase'
          shopUsername={shopUsername}></AddFoodItems>
        <AddFoodItems
          path='food/add'
          shopUsername={shopUsername}></AddFoodItems>
        <FoodItems
          path='food/search/:phrase'
          shopUsername={shopUsername}></FoodItems>
        <FoodItems path='food' shopUsername={shopUsername}></FoodItems>

        <AddServices
          path='services/add/search/:phrase'
          shopUsername={shopUsername}></AddServices>
        <AddServices
          path='services/add'
          shopUsername={shopUsername}></AddServices>
        <Services
          path='services/search/:phrase'
          shopUsername={shopUsername}></Services>
        <Services path='services' shopUsername={shopUsername}></Services>

        <OrderRouter shopUsername={shopUsername} path='orders/*'></OrderRouter>

        {/* <NotFoundPageWithoutLayout default></NotFoundPageWithoutLayout> */}
      </Router>
    </DashboardLayout>
  );
};

export default ShopDashboardRouter;
