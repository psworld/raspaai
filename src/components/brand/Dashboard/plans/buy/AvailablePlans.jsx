import {
  List,
  ListItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Checkbox
} from '@material-ui/core';
import { gql } from 'apollo-boost';
import React from 'react';
import { useQuery } from 'react-apollo';
import ErrorPage from '../../../../core/ErrorPage';
import Loading from '../../../../core/Loading';

const AVAILABLE_PLANS_FOR_BRAND = gql`
  {
    availablePlansForBrand(orderBy: "price") {
      edges {
        node {
          id
          planId
          name
          price
          productSpace
          validityDuration
        }
      }
    }
  }
`;

const AvailablePlans = ({
  selectedPlan,
  handlePlanSelect,
  fab,
  filterFreePlans = true
}) => {
  const { loading, error, data } = useQuery(AVAILABLE_PLANS_FOR_BRAND);

  const PlanItem = ({ planNode }) => {
    const {
      id,
      name: planName,
      price,
      productSpace,
      validityDuration
    } = planNode;
    const isSelected = id === selectedPlan;
    return (
      <TableRow
        key={id}
        selected={isSelected}
        aria-checked={isSelected}
        onClick={() => (handlePlanSelect ? handlePlanSelect(id, price) : null)}>
        <TableCell padding='checkbox'>
          <Checkbox
            checked={isSelected}
            style={{ color: 'green' }}
            inputProps={{ 'aria-labelledby': 'check' }}
          />
        </TableCell>
        <TableCell component='th' scope='row'>
          {!filterFreePlans ? planName : <>&#8377;{price}</>}
        </TableCell>
        <TableCell align='right'>{validityDuration.split(',')[0]}</TableCell>
        <TableCell align='right'>{productSpace}</TableCell>
      </TableRow>
    );
  };

  if (loading) return <Loading></Loading>;
  if (error) return <ErrorPage></ErrorPage>;
  if (data) {
    let { edges: availablePlanNodeEdges } = data.availablePlansForBrand;
    availablePlanNodeEdges = filterFreePlans
      ? availablePlanNodeEdges.filter(
          plan => !plan.node.planId.includes('free')
        )
      : availablePlanNodeEdges;
    return (
      <>
        <Paper style={{ padding: 10 }}>
          <Typography variant='h5'>Popular plans</Typography>
        </Paper>
        <List>
          {/* This is grouping of plans */}
          {/* {Object.keys(groupedPlanNodeEdges).map(planGroupKey => {
            const planGroup = groupedPlanNodeEdges[planGroupKey];

            return (
              <PlanGroup
                key={planGroupKey}
                groupName={planGroupKey}
                planGroup={planGroup}></PlanGroup>
            );
          })} */}

          {/* With out plan grouping */}
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell padding='checkbox'></TableCell>
                  <TableCell>Plan</TableCell>
                  <TableCell align='right'>Validity</TableCell>
                  <TableCell align='right'>Space</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {availablePlanNodeEdges.map(plan => {
                  return (
                    <PlanItem
                      key={plan.node.id}
                      planNode={plan.node}></PlanItem>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>

          <ListItem>{fab}</ListItem>
        </List>
      </>
    );
  }
};

export default AvailablePlans;
