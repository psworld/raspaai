import {
  Checkbox,
  Collapse,
  List,
  ListItem,
  ListItemText,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@material-ui/core';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import { gql } from 'apollo-boost';
import React from 'react';
import { useQuery } from 'react-apollo';
import ErrorPage from '../../../../../core/ErrorPage';
import Loading from '../../../../../core/Loading';

const AVAILABLE_PLANS = gql`
  {
    availablePlans(orderBy: "price") {
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
  handlePlanSelect,
  selectedPlan,
  headingClasses,
  fab,
  filterFreePlans = true
}) => {
  const { loading, error, data } = useQuery(AVAILABLE_PLANS);

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
        name='planId'
        onClick={() => handlePlanSelect(id, price)}>
        <TableCell padding='checkbox'>
          <Checkbox
            checked={isSelected}
            style={{ color: 'green' }}
            inputProps={{ 'aria-labelledby': 'check' }}
          />
        </TableCell>
        <TableCell component='th' scope='row' padding='none'>
          {!filterFreePlans ? planName : <>&#8377;{price}</>}
        </TableCell>
        <TableCell align='right'>{validityDuration.split(',')[0]}</TableCell>
        <TableCell align='right'>{productSpace}</TableCell>
      </TableRow>
    );
  };

  const PlanGroup = ({ groupName, planGroup }) => {
    const [open, setOpen] = React.useState(true);

    const handleClick = () => {
      setOpen(!open);
    };
    return (
      <div style={{ marginBottom: 10 }}>
        <ListItem selected={true} button onClick={handleClick}>
          <ListItemText
            primary={
              <Typography variant='h6'>{groupName}</Typography>
            }></ListItemText>
          {open ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={open} timeout='auto'>
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
                {planGroup.map(plan => {
                  const {
                    id,
                    name: planName,
                    price,
                    productSpace,
                    validityDuration
                  } = plan.node;
                  const isSelected = id === selectedPlan;
                  return (
                    <TableRow
                      key={id}
                      selected={isSelected}
                      aria-checked={isSelected}
                      onClick={() => handlePlanSelect(id, price)}>
                      <TableCell padding='checkbox'>
                        <Checkbox
                          checked={isSelected}
                          style={{ color: 'green' }}
                          inputProps={{ 'aria-labelledby': 'check' }}
                        />
                      </TableCell>
                      <TableCell component='th' scope='row' padding='none'>
                        {!filterFreePlans ? planName : <>&#8377;{price}</>}
                      </TableCell>
                      <TableCell align='right'>
                        {validityDuration.split(',')[0]}
                      </TableCell>
                      <TableCell align='right'>{productSpace}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Collapse>
      </div>
    );
  };

  if (loading) return <Loading></Loading>;
  if (error) return <ErrorPage></ErrorPage>;
  if (data) {
    const productSpaces = [20, 50, 75, 100];
    let { edges: availablePlanNodeEdges } = data.availablePlans;

    availablePlanNodeEdges = filterFreePlans
      ? availablePlanNodeEdges.filter(
          plan => !plan.node.planId.includes('free')
        )
      : availablePlanNodeEdges;

    const groupedPlanNodeEdges = {};

    productSpaces.forEach(space => {
      const productSpacePlans = availablePlanNodeEdges.filter(
        plan => plan.node.productSpace === space
      );
      if (productSpacePlans.length > 0) {
        groupedPlanNodeEdges[
          `${space} product-space packs`
        ] = productSpacePlans;
      }
    });

    return (
      <>
        <Paper className={headingClasses}>
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
