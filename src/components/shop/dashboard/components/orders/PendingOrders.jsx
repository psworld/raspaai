import React from 'react';
import { List, Typography } from '@material-ui/core';
import OrderBase from './OrderBase';
import { yellow } from '@material-ui/core/colors';

const PendingOrders = () => {
  return (
    <List>
      <Typography variant='h6' align='center'>
        Orders Status <span style={{ color: yellow[800] }}>Pending</span>
      </Typography>

      <OrderBase status='unfulfilled'></OrderBase>
    </List>
  );
};

export default PendingOrders;
