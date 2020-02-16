import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';

import clsx from 'clsx';
import 'date-fns';
import React from 'react';

import Orders from './Orders';
import PlanInfo from './PlanInfo';
import ShopReturnRefundPolicy from './ShopReturnRefundPolicy';

const useStyles = makeStyles(theme => ({
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column'
  },
  spacing: {
    padding: theme.spacing(1)
  },
  fixedHeight: {
    minHeight: 240
  }
}));

export default function Dashboard({ publicUsername, isBrand = false }) {
  const classes = useStyles();

  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

  return (
    <Grid container>
      {/* Chart */}
      {!isBrand && (
        <Grid className={classes.spacing} item xs={12} md={8} lg={9}>
          <Paper className={fixedHeightPaper}>
            <ShopReturnRefundPolicy publicUsername={publicUsername} />
          </Paper>
        </Grid>
      )}
      {/* Recent Deposits */}
      <Grid className={classes.spacing} item xs={12} md={4} lg={3}>
        <Paper className={fixedHeightPaper}>
          <PlanInfo isBrand={isBrand} publicUsername={publicUsername} />
        </Paper>
      </Grid>
      {/* Recent Orders */}
      {/* {!isBrand && (
        <Grid className={classes.spacing} item xs={12}>
          <Paper className={classes.paper}>
            <Orders />
          </Paper>
        </Grid>
      )} */}
    </Grid>
  );
}
