import React from 'react';
import { List, Typography } from '@material-ui/core';
import OrderBase from './OrderBase';

const FulfilledOrders = () => {
  return (
    <List>
      <Typography variant='h6' align='center'>
        Orders Status <span style={{ color: 'green' }}>Fulfilled</span>
      </Typography>
      <OrderBase status='fulfilled'></OrderBase>
    </List>
  );
};

export default FulfilledOrders;
