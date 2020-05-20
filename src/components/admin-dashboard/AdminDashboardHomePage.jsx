import React from 'react';
import { Button, Grid, Container } from '@material-ui/core';
import Link from '../core/Link';

const AdminDashboardHomePage = () => {
  const actions = [
    { name: 'Add popular places', to: 'add-popular-place' },
    { name: 'Popular Places', to: 'popular-places' },
    { name: 'Add User', to: 'add-user' },
    { name: 'Add Wholesaler', to: 'supply-chain/add/wholesaler' }
  ];
  return (
    <Container maxWidth='md'>
      <Grid container spacing={2}>
        {actions.map(action => (
          <Grid key={action.name} item xs={6} md={3}>
            <Button
              component={Link}
              to={`${window.location.pathname}/${action.to}`}
              variant='outlined'>
              {action.name}
            </Button>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default AdminDashboardHomePage;
