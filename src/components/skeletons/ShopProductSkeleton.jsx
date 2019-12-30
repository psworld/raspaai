import React from 'react';

import Skeleton from '@material-ui/lab/Skeleton';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  ListItem
} from '@material-ui/core';

const ShopProductSkeleton = () => {
  return (
    <Grid container>
      <Grid item xs={12} sm={6} md={4}>
        <Skeleton
          width={'100%'}
          variant='rect'
          style={{ marginTop: 0, paddingTop: '125%' }}></Skeleton>
      </Grid>
      <Grid
        style={{ paddingLeft: 8, paddingRight: 8 }}
        item
        xs={12}
        sm={6}
        md={6}>
        <ListItem style={{ paddingBottom: 1 }}>
          <Skeleton height={30} width='80%'></Skeleton>
        </ListItem>
        <ListItem style={{ marginTop: 0 }}>
          <Skeleton width={100} style={{ marginRight: '30%' }}></Skeleton>

          <Skeleton width={100}></Skeleton>
        </ListItem>
        <ListItem>
          <Skeleton width={90}></Skeleton>
        </ListItem>
        <Divider />
        <ListItem>
          <Skeleton width='25%'></Skeleton>
        </ListItem>
        <ListItem>
          <Skeleton width='25%'></Skeleton>
        </ListItem>
        <ListItem>
          <Skeleton width='25%'></Skeleton>
        </ListItem>

        <Divider />
        <ListItem style={{ marginTop: 2 }}>
          <Skeleton width='20%'></Skeleton>
        </ListItem>
        <ListItem style={{ marginTop: 10, marginBottom: 8 }}>
          <Skeleton width='20%'></Skeleton>
        </ListItem>
        <Divider></Divider>
        <ListItem>
          <Skeleton variant='text' height={70} width='100%'></Skeleton>
        </ListItem>

        <Table size='small'>
          <TableHead>
            <TableRow>
              <TableCell>
                <Skeleton width='50%'></Skeleton>
              </TableCell>
              <TableCell>
                <Skeleton width='50%'></Skeleton>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(key => {
              return (
                <TableRow key={key}>
                  <TableCell component='th' scope='row'>
                    <Skeleton width='40%'></Skeleton>
                  </TableCell>
                  <TableCell>
                    <Skeleton width='60%'></Skeleton>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Grid>
      <Grid
        style={{ paddingLeft: 8, paddingRight: 8 }}
        item
        xs={12}
        sm={12}
        md={2}>
        <div style={{ paddingBottom: 5 }}>
          <Skeleton height={30} width='100%'></Skeleton>
        </div>
        <div style={{ paddingBottom: 5 }}>
          <Skeleton height={20} width='60%'></Skeleton>
          <Skeleton></Skeleton>
          <Skeleton width='30%'></Skeleton>
        </div>
        <Skeleton height={20} width='60%'></Skeleton>
        <Skeleton></Skeleton>
      </Grid>
    </Grid>
  );
};

export default ShopProductSkeleton;
