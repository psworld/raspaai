import { Grid, Paper } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import React from 'react';
import PlanInfo from '../../shop/dashboard/components/PlanInfo';

const useStyles = makeStyles(theme => ({
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
    minHeight: 240
  },
  spacing: {
    padding: theme.spacing(1)
  }
}));

const BrandDashboardHomePage = ({ brandUsername }) => {
  const classes = useStyles();

  return (
    <Grid container>
      <Grid className={classes.spacing} item xs={12} md={4} lg={3}>
        <Paper className={classes.paper}>
          <PlanInfo isBrand={true} publicUsername={brandUsername} />
        </Paper>
      </Grid>
    </Grid>
  );
};

export default BrandDashboardHomePage;
