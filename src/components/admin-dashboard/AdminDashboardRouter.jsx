import { Router } from '@reach/router';
import React from 'react';
import { useQuery } from 'react-apollo';
import NotFoundPage from '../../pages/404';
import ErrorPage from '../core/ErrorPage';
import { VIEWER } from '../navbar/ToolBarMenu';
import AdminDashboardHomePage from './AdminDashboardHomePage';
import AddNewBrand from './brands/add-brand/AddNewBrand';
import AddPlanToBrand from './brands/add-brand/AddPlanToBrand';
import BrandsPage from './brands/BrandsPage';
import AdminDashboardLayout from './components/AdminDashboardLayout';
import AddShop from './shops/add-shop/AddShop';
import AddPlanToShop from './shops/AddPlanToShop';
import ShopPage from './shops/ShopPage';
import ShopsPage from './shops/ShopsPage';

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
