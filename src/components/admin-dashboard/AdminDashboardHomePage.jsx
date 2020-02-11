import React from 'react';
import { Button, Grid } from '@material-ui/core';
import Link from '../core/Link';

const AdminDashboardHomePage = () => {
  return (
    <Grid container>
      <Grid item xs={6} md={3}>
        <Button
          component={Link}
          to={`${window.location.pathname}/add-popular-place`}
          variant='outlined'>
          Add popular places
        </Button>
      </Grid>
      <Grid item xs={6} md={3}>
        <Button
          component={Link}
          to={`${window.location.pathname}/popular-places`}
          variant='outlined'>
          Popular Places
        </Button>
      </Grid>
    </Grid>
  );
};

export default AdminDashboardHomePage;
