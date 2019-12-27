/* eslint-disable no-script-url */

import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Title from './Title';
import Link from '../../../core/Link';
import gql from 'graphql-tag';
import { useQuery } from 'react-apollo';
import UserCheck from '../../../core/UserCheck';

const useStyles = makeStyles(theme => ({
  seeMore: {
    marginTop: theme.spacing(3)
  }
}));

const RECENT_SHOP_ORDERS = gql`
  query($shopId: ID!) {
    shopOrders(shop: $shopId, first: 10, orderBy: "-order__created") {
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      edges {
        node {
          id
          status
          clientTrackingId
          total
          totalItems
          order {
            id
            created
            userFullName
            userPhone
            user {
              id
              email
            }
          }
        }
      }
    }
  }
`;

const RecentOrders = ({ viewer }) => {
  const classes = useStyles();
  const {
    shop: { id: shopId }
  } = viewer;
  const { loading, error, data } = useQuery(RECENT_SHOP_ORDERS, {
    variables: { shopId }
  });
  return (
    <React.Fragment>
      <Title>Recent Orders</Title>
      {data && data.shopOrders && (
        <Table size='small'>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Time</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align='right'>Sale Amount</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.shopOrders.edges.map(shopOrderObj => {
              const {
                id,
                status,
                total,
                order: { created: dateTimeStr, userFullName }
              } = shopOrderObj.node;

              // Formatting date and time
              const dateObj = new Date(dateTimeStr);
              const date = `${dateObj.getDate()} ${dateObj.toLocaleString(
                'default',
                {
                  month: 'short'
                }
              )}`;
              const orderPlacedTime = dateObj.toLocaleTimeString('default', {
                timeStyle: 'short'
              });
              return (
                <TableRow key={id}>
                  <TableCell>{date}</TableCell>
                  <TableCell>{orderPlacedTime}</TableCell>
                  <TableCell>{userFullName}</TableCell>
                  <TableCell>{status}</TableCell>
                  <TableCell align='right'>{total}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}
      <div className={classes.seeMore}>
        <Link color='primary' to={`${window.location.pathname}/orders/pending`}>
          See pending orders
        </Link>
      </div>
    </React.Fragment>
  );
};

export default function Orders() {
  return (
    <UserCheck>
      <RecentOrders></RecentOrders>
    </UserCheck>
  );
}
