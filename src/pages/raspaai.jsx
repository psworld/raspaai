import React from 'react';
import { Router } from '@reach/router';
import AdminDashboardRouter from '../components/admin-dashboard/AdminDashboardRouter';

const Raspaai = () => {
  return (
    <Router>
      <AdminDashboardRouter path='/raspaai/dashboard/*'></AdminDashboardRouter>
    </Router>
  );
};

export default Raspaai;
