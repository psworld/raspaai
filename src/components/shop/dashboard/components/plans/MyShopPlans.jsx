import {
  Button,
  Container,
  Divider,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { gql } from 'apollo-boost';
import { format, differenceInHours } from 'date-fns/esm';
import React from 'react';
import { useQuery } from 'react-apollo';
import ErrorPage from '../../../../core/ErrorPage';
import Link from '../../../../core/Link';
import Loading from '../../../../core/Loading';
import SEO from '../../../../seo';
import { differenceInDays } from 'date-fns';

const SHOP_PLANS = gql`
  query($shopUsername: String!) {
    shop(publicShopUsername: $shopUsername) {
      id
      properties {
        title
        occupiedSpace
        plans {
          edges {
            node {
              id
              isActive
              isValid
              dateStart
              dateEnd
              addedAt
              productSpace
              plan {
                id
                planId
                name
                price
                validityDuration
              }
            }
          }
        }
      }
    }
  }
`;

const useStyles = makeStyles(theme => ({
  fab: {
    position: 'fixed',
    bottom: theme.spacing(1)
  },
  paper: {
    padding: theme.spacing(1)
  },
  heading: {
    padding: theme.spacing(1, 2),
    marginBottom: theme.spacing(2),
    color: theme.palette.grey[700],
    borderRadius: 0
    // backgroundColor: theme.palette.success.dark
  },
  container: {
    padding: theme.spacing(1)
  }
}));

const MyShopPlans = ({ shopUsername }) => {
  const classes = useStyles();

  // All bought plans of the shop
  const { loading, error, data } = useQuery(SHOP_PLANS, {
    variables: { shopUsername }
  });

  const ActivePlan = ({ activePlan, occupiedSpace }) => {
    const {
      dateEnd: expiryDateStr,
      productSpace: totalProductSpace,
      plan: { price, name: planName, validityDuration }
    } = activePlan.node;
    const expiryDateObj = new Date(expiryDateStr);
    let timeLeft = differenceInDays(expiryDateObj, new Date());
    // if 0 days are remaining show remaining hrs
    timeLeft =
      timeLeft === 0
        ? `${differenceInHours(expiryDateObj, new Date())} hrs`
        : `${timeLeft} days`;
    const expiryDate = format(expiryDateObj, 'MMM d, y h:mm a');

    const isFreePlan = planName.includes('free');
    return (
      <Paper className={classes.paper}>
        <Typography variant='h6'>
          <b>{isFreePlan ? planName : `MRP ${price}`}</b>
        </Typography>
        <Typography variant='body2'>
          Expires on {expiryDate}
          {/* Expires on Jan 15, 2020 10:58 PM */}
        </Typography>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell component='th' scope='row'>
                Product space
              </TableCell>
              <TableCell align='right'>
                <Typography>
                  <b>{totalProductSpace - occupiedSpace}</b>
                </Typography>
                <Typography variant='caption' component='p'>
                  remaining of {totalProductSpace}
                </Typography>
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell component='th' scope='row'>
                Validity
              </TableCell>
              <TableCell align='right'>
                <Typography>
                  <b>{timeLeft}</b>
                </Typography>
                <Typography variant='caption' component='p'>
                  remaining of {validityDuration.split(',')[0]}
                </Typography>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Paper>
    );
  };

  const UpcomingPlan = ({ plan }) => {
    const {
      plan: { price, productSpace: totalProductSpace, validityDuration }
    } = plan.node;

    return (
      <Paper className={classes.paper}>
        <Typography variant='h6'>
          <b>MRP {price}</b>
        </Typography>
        <Typography variant='body2'>
          Valid for {validityDuration.split(',')[0]}
          {/* Expires on Jan 15, 2020 10:58 PM */}
        </Typography>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell component='th' scope='row'>
                Product space
              </TableCell>
              <TableCell align='right'>
                <Typography>
                  <b>{totalProductSpace}</b>
                </Typography>
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell component='th' scope='row'>
                Validity
              </TableCell>
              <TableCell align='right'>
                <Typography>
                  <b>{validityDuration.split(',')[0]}</b>
                </Typography>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Paper>
    );
  };

  const DoNotHaveActivePlans = () => {
    return (
      <>
        <Typography variant='h5' align='center'>
          You do not have any shop plans
        </Typography>
        <div style={{ margin: 30 }}>
          <center>
            <Button
              color='secondary'
              variant='contained'
              component={Link}
              to={`${window.location.pathname}/buy`}>
              Buy plans
            </Button>
          </center>
        </div>
      </>
    );
  };

  if (loading) return <Loading></Loading>;
  if (error) return <ErrorPage></ErrorPage>;
  if (data) {
    const {
      properties: {
        title: shopName,
        occupiedSpace,
        plans: { edges: planNodeEdges }
      }
    } = data.shop;

    if (planNodeEdges.length > 0) {
      const activePlan = planNodeEdges.find(plan => plan.node.isValid === true);

      const upcomingPlans = planNodeEdges.filter(
        plan => new Date(plan.node.dateStart) > new Date()
      );
      return (
        <>
          <SEO
            title='My shop plans'
            description='Current and upcoming plans.'></SEO>
          <Paper className={classes.heading}>
            <Typography variant='h6' align='center'>
              My shop plans
            </Typography>
            <Typography variant='h6' align='center'>
              {shopName}
            </Typography>
          </Paper>
          <Container className={classes.container}>
            {activePlan ? (
              <div style={{ marginTop: 20, marginBottom: 20 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} md={4}>
                    <Typography align='center'>
                      <b>Current Plan</b>
                    </Typography>
                    <ActivePlan
                      occupiedSpace={occupiedSpace}
                      activePlan={activePlan}></ActivePlan>
                  </Grid>
                </Grid>
              </div>
            ) : (
              <DoNotHaveActivePlans></DoNotHaveActivePlans>
            )}
            <Divider></Divider>
            {upcomingPlans.length > 0 && (
              <div style={{ marginTop: 20 }}>
                <Typography align='center'>
                  <b>Upcoming Plan(s)</b>
                </Typography>
                <Grid container spacing={1}>
                  {upcomingPlans.map(plan => (
                    <Grid key={plan.node.id} item xs={12} sm={6} md={4}>
                      <UpcomingPlan plan={plan}></UpcomingPlan>
                    </Grid>
                  ))}
                </Grid>
              </div>
            )}
            {activePlan && (
              <div style={{ margin: 30 }}>
                <Button
                  color='secondary'
                  variant='contained'
                  component={Link}
                  to={`${window.location.pathname}/buy`}>
                  View more plans
                </Button>
              </div>
            )}
          </Container>
        </>
      );
    } else {
      return (
        <>
          <SEO
            title='My shop plans'
            description='Current and upcoming plans.'></SEO>
          <Paper className={classes.heading}>
            <Typography variant='h6' align='center'>
              My shop plans
            </Typography>
            <Typography variant='h6' align='center'>
              {shopName}
            </Typography>
          </Paper>
          <DoNotHaveActivePlans></DoNotHaveActivePlans>
        </>
      );
    }
  }
};

export default MyShopPlans;
