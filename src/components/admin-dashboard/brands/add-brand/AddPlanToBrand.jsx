import {
  Button,
  Container,
  Fab,
  Grid,
  List,
  ListItem,
  ListItemText,
  TextField,
  Typography
} from '@material-ui/core';
import { gql } from 'apollo-boost';
import { format } from 'date-fns';
import React from 'react';
import { useMutation } from 'react-apollo';
import AvailablePlans from '../../../brand/Dashboard/plans/buy/AvailablePlans';
import GraphqlErrorMessage from '../../../core/GraphqlErrorMessage';

const GET_BRAND_INFO = gql`
  mutation($brandUsername: String, $ownerEmail: String) {
    adminGetBrandInfo(
      input: { brandUsername: $brandUsername, ownerEmail: $ownerEmail }
    ) {
      brand {
        id
        title
        publicUsername
        owner {
          id
          email
          firstName
          lastName
        }
        isActive
      }
    }
  }
`;

const ADD_BRAND_PLAN = gql`
  mutation($planId: ID!, $brandId: ID!) {
    adminAddBrandPlan(input: { planId: $planId, brandId: $brandId }) {
      brandPlan {
        id
        isActive
        orderId
        addedAt
        dateStart
        dateEnd
        plan {
          id
          name
          price
          productSpace
          validityDuration
        }
      }
    }
  }
`;

const AddPlanToBrand = () => {
  const [brandInput, setBrandInput] = React.useState({});

  const handleChange = e => {
    setBrandInput({ [e.target.id]: e.target.value });
  };

  const [getBrandInfo, { loading, error, data }] = useMutation(GET_BRAND_INFO, {
    variables: { ...brandInput }
  });

  const ChoosePlan = ({ brandId }) => {
    // storing plan id
    const [selectedPlan, setSelectedPlan] = React.useState({
      id: false,
      amount: 0
    });
    const [addBrandPlan, { loading, error, data }] = useMutation(
      ADD_BRAND_PLAN,
      {
        variables: { brandId, planId: selectedPlan.id }
      }
    );
    const handlePlanSelect = (planId, amount) => {
      if (selectedPlan.id === planId) {
        // clicking again on selected plan
        setSelectedPlan({
          id: false,
          amount: 0
        });
      } else {
        setSelectedPlan({ id: planId, amount });
      }
    };
    const StickyButton = (
      <Fab
        onClick={addBrandPlan}
        disabled={loading || !selectedPlan.id}
        color='primary'
        variant='extended'
        // className={classes.fab}
      >
        Add plan
      </Fab>
    );

    const PlanInfo = () => {
      const {
        brandPlan: {
          isActive,
          orderId,
          addedAt,
          dateStart: dateStartStr,
          dateEnd: dateEndStr,
          plan: { name: planName, price, productSpace, validityDuration }
        }
      } = data.adminAddBrandPlan;

      const dateStart = format(new Date(dateStartStr), 'MMM d, y h:m a');
      const expiryDate = format(new Date(dateEndStr), 'MMM d, y h:m a');

      return (
        <List>
          <ListItem>
            <ListItemText
              primary={planName}
              secondary={`MRP ${price}`}></ListItemText>
          </ListItem>
          <ListItem>
            <ListItemText
              primary='Product space'
              secondary={productSpace}></ListItemText>
          </ListItem>
          <ListItem>
            <ListItemText
              primary='Validity (days)'
              secondary={validityDuration}></ListItemText>
          </ListItem>
          <ListItem>
            <ListItemText
              primary='Is active plan'
              secondary={`${isActive}`}></ListItemText>
          </ListItem>
          <ListItem>
            <ListItemText
              primary='Start date'
              secondary={dateStart}></ListItemText>
          </ListItem>
          <ListItem>
            <ListItemText
              primary='Date end'
              secondary={expiryDate}></ListItemText>
          </ListItem>
        </List>
      );
    };
    return (
      <>
        <AvailablePlans
          handlePlanSelect={handlePlanSelect}
          selectedPlan={selectedPlan.id}
          fab={StickyButton}
          filterFreePlans={false}></AvailablePlans>
        {error && <GraphqlErrorMessage error={error}></GraphqlErrorMessage>}
        {data && <PlanInfo></PlanInfo>}
      </>
    );
  };

  const BrandInfo = () => {
    const {
      id: brandId,
      title: brandName,
      publicUsername: brandUsername,
      isActive,
      owner: { email, firstName, lastName }
    } = data.adminGetBrandInfo.brand;
    return (
      <List>
        <ListItem>
          <ListItemText
            primary='brand Status'
            secondary={
              <>Is active: {isActive ? 'Yes' : 'No'}</>
            }></ListItemText>
        </ListItem>
        <ListItem>
          <ListItemText
            primary='brand General Details'
            secondary={
              <>
                Username: {brandUsername}
                <br></br>
                Name: {brandName}
              </>
            }></ListItemText>
        </ListItem>
        <ListItem>
          <ListItemText
            primary='Owner'
            secondary={
              <>
                {email}
                <br></br>
                {firstName} {lastName}
              </>
            }></ListItemText>
        </ListItem>
      </List>
    );
  };

  return (
    <Container>
      <Typography variant='h5' align='center'>
        Add brand plans
      </Typography>
      <Grid style={{ marginTop: 20 }} container spacing={2}>
        <Grid item xs={12} md={5}>
          <TextField
            variant='outlined'
            fullWidth
            onChange={handleChange}
            id='brandUsername'
            name='Brand Username'
            label='Brand Username'
            autoComplete={true}
          />
        </Grid>
        <Grid item xs={12} md={2}>
          <Typography variant='h6' align='center'>
            Or
          </Typography>
        </Grid>
        <Grid item xs={12} md={5}>
          <TextField
            onChange={handleChange}
            fullWidth
            variant='outlined'
            id='ownerEmail'
            label='Owner email'
          />
        </Grid>
      </Grid>
      <List>
        {error && (
          <ListItem>
            <GraphqlErrorMessage error={error}></GraphqlErrorMessage>
          </ListItem>
        )}
        <ListItem>
          <Button
            onClick={getBrandInfo}
            disabled={loading}
            variant='contained'
            color='primary'>
            Get brand info
          </Button>
        </ListItem>

        {/* brand info */}
        {data && <BrandInfo></BrandInfo>}
        <br></br>
        {data && (
          <ChoosePlan brandId={data.adminGetBrandInfo.brand.id}></ChoosePlan>
        )}
      </List>
    </Container>
  );
};

export default AddPlanToBrand;
