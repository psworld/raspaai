import React from 'react';
import { List, Typography } from '@material-ui/core';
import OrderBase from './OrderBase';

const CanceledOrders = () => {
  return (
    <List>
      <Typography variant='h6' align='center'>
        Orders Status <span style={{ color: 'red' }}>Canceled</span>
      </Typography>

      <OrderBase status='canceled'></OrderBase>
    </List>
  );
};

export default CanceledOrders;
