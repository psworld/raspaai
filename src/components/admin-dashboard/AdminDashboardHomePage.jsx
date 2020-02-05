import React from 'react';
import { Button } from '@material-ui/core';
import Link from '../core/Link';

const AdminDashboardHomePage = () => {
  return (
    <div>
      <Button
        component={Link}
        to={`${window.location.pathname}/add-popular-place`}
        variant='outlined'>
        Add popular places
      </Button>
    </div>
  );
};

export default AdminDashboardHomePage;
