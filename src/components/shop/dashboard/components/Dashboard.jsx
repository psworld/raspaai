import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Orders from './Orders';
import PlanInfo from './PlanInfo';
import ShopReturnRefundPolicy from './ShopReturnRefundPolicy';

const useStyles = makeStyles(theme => ({
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    // overflow: 'auto',
    flexDirection: 'column'
  },
  fixedHeight: {
    height: 240
  }
}));

export default function Dashboard({ publicUsername, isBrand = false }) {
  const classes = useStyles();

  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

  return (
    <Grid container spacing={2}>
      {/* Chart */}
      {!isBrand && (
        <Grid item xs={12} md={8} lg={9}>
          <Paper>
            <ShopReturnRefundPolicy publicUsername={publicUsername} />
          </Paper>
        </Grid>
      )}
      {/* Recent Deposits */}
      <Grid item xs={12} md={4} lg={3}>
        <Paper className={fixedHeightPaper}>
          <PlanInfo isBrand={isBrand} publicUsername={publicUsername} />
        </Paper>
      </Grid>
      {/* Recent Orders */}
      {!isBrand && (
        <Grid item xs={12}>
          <Paper className={classes.paper}>
            <Orders />
          </Paper>
        </Grid>
      )}
    </Grid>
  );
}
