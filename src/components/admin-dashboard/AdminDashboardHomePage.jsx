import React from 'react';
import { Button, Grid, Container } from '@material-ui/core';
import Link from '../core/Link';

const AdminDashboardHomePage = () => {
  return (
    <Container maxWidth='md'>
      <Grid container spacing={2}>
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
        <Grid item xs={6} md={3}>
          <Button
            component={Link}
            to={`${window.location.pathname}/add-user`}
            variant='outlined'>
            Add User
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AdminDashboardHomePage;
