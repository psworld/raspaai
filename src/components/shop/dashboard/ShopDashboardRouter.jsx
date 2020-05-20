import { Router } from '@reach/router';
import React from 'react';
import routes from '../../core/routes';
import WholesalerHomepage from '../../supply-chain/wholesaler/WholesalerHomepage';
import WholesalerProductDetails from '../../supply-chain/wholesaler/WholesalerProductDetails';
import AddNewComboHOC from './combos/AddNewCombo';
import EditCombo from './combos/EditCombo';
import MyCombos from './combos/MyCombos';
import DashboardLayout from './components/DashboardLayout';
import OrderRouter from './components/orders/OrderRouter';
import MyShopPlans from './components/plans/MyShopPlans';
import ShopDashboardProfile from './components/ShopDashboardProfile';
import { EditReturnRefundPolicy } from './components/ShopReturnRefundPolicy';
import AddFoodItems from './food/AddFoodItems';
import FoodItems from './food/FoodItems';
import AddNewProduct from './products/AddNewProduct';
import MyProductsPage from './products/MyProductsPage';
import AddServices from './services/AddServices';
import Services from './services/Services';
import Cart from './shop-orders/Cart';
import PlaceOrder, { CheckoutShopCart } from './shop-orders/PlaceOrder';
import ShopOrders from './shop-orders/ShopOrders';
import ShopDashboardHomePage from './ShopDashboardHomePage';

export const shopDashboardStateContext = React.createContext({
  shopUsername: '',
  variant: 'shopDashboard'
});

const ShopDashboardRouter = props => {
  const { shopUsername } = props;
  const [searchPhrase, setSearchPhrase] = React.useState('');
  const { Provider } = shopDashboardStateContext;
  return (
    <Provider value={{ shopUsername, variant: 'shopDashboard' }}>
      <DashboardLayout
        searchPhrase={searchPhrase}
        setSearchPhrase={setSearchPhrase}
        publicUsername={shopUsername}>
        <Router>
          <ShopDashboardHomePage
            path='/'
            shopUsername={shopUsername}></ShopDashboardHomePage>

          <ShopOrders
            path={`${routes.shop.dashboard.shopOrdersR}`}></ShopOrders>
          <CheckoutShopCart
            path={`${routes.shop.dashboard.placeOrder.buyCartR}`}></CheckoutShopCart>
          <PlaceOrder
            path={`${routes.shop.dashboard.placeOrder.selfR}`}
            shopUsername={shopUsername}></PlaceOrder>
          <WholesalerHomepage
            path={`${routes.shop.dashboard.placeOrder.wholesalerR}`}
            shopUsername={shopUsername}
            variant='shopDashboard'></WholesalerHomepage>
          <WholesalerProductDetails
            path={`${routes.shop.dashboard.placeOrder.wholesalerProductDetailsR}`}
            shopUsername={shopUsername}></WholesalerProductDetails>
          <Cart path={`${routes.shop.dashboard.cartR}`}></Cart>

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
          <EditCombo path='combos/edit/:comboId'></EditCombo>
          <AddNewComboHOC
            shopUsername={shopUsername}
            path='combos/create'></AddNewComboHOC>
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

          <OrderRouter
            shopUsername={shopUsername}
            path='orders/*'></OrderRouter>

          {/* <NotFoundPageWithoutLayout default></NotFoundPageWithoutLayout> */}
        </Router>
      </DashboardLayout>
    </Provider>
  );
};

export default ShopDashboardRouter;
