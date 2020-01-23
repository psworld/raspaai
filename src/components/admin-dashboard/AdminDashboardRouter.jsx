import React from 'react';
import { Router } from '@reach/router';
import AdminDashboardHomePage from './AdminDashboardHomePage';
import AdminDashboardLayout from './components/AdminDashboardLayout';
import ShopsPage from './shops/ShopsPage';
import AddNewBrand from './brands/AddNewBrand';
import BrandsPage from './brands/BrandsPage';
import BrandPage from './brands/BrandPage';
import ShopPage from './shops/ShopPage';
import { VIEWER } from '../navbar/ToolBarMenu';
import { useQuery } from 'react-apollo';
import ErrorPage from '../core/ErrorPage';
import AddShop from './shops/add-shop/AddShop';
import AddPlanToShop from './shops/AddPlanToShop';
import AddPlanToBrand from './brands/AddPlanToBrand';
import NotFoundPage from '../../pages/404';

const AdminDashboardRouter = () => {
  const { loading, error, data } = useQuery(VIEWER);
  if (loading) return <p>Loading</p>;
  if (error) return <ErrorPage></ErrorPage>;

  if (data && data.viewer && data.viewer.isSuperuser) {
    return (
      <AdminDashboardLayout>
        <Router>
          <AdminDashboardHomePage path='/'></AdminDashboardHomePage>
          <AddPlanToShop path='shops/add-plan'></AddPlanToShop>
          <AddShop path='shops/add'></AddShop>
          <ShopPage path='shops/:shopUsername'></ShopPage>
          <ShopsPage path='shops'></ShopsPage>
          <AddPlanToBrand path='brands/add-plan'></AddPlanToBrand>
          <AddNewBrand path='brands/add'></AddNewBrand>
          <BrandsPage path='brands'></BrandsPage>
          {/* <BrandPage path='brands/:brandUsername/:applicationId'></BrandPage> */}
          <NotFoundPage default></NotFoundPage>
        </Router>
      </AdminDashboardLayout>
    );
  } else {
    return <h1>You are not authorized to access this page</h1>;
  }
};

export default AdminDashboardRouter;
