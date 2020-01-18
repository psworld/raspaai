import React from 'react';
import {
  Grid,
  Container,
  Typography,
  TextField,
  List,
  ListItem,
  Button,
  ListItemText,
  Fab
} from '@material-ui/core';
import { gql } from 'apollo-boost';
import { useMutation } from 'react-apollo';
import GraphqlErrorMessage from '../../core/GraphqlErrorMessage';
import AvailablePlans from '../../shop/dashboard/components/plans/buy/AvailablePlans';
import { format } from 'date-fns';

const GET_SHOP_INFO = gql`
  mutation($shopUsername: String, $ownerEmail: String) {
    adminGetShopInfo(
      input: { shopUsername: $shopUsername, ownerEmail: $ownerEmail }
    ) {
      shop {
        id
        properties {
          title
          publicUsername
          contactNumber
          owner {
            id
            email
            firstName
            lastName
          }
          isActive
          address
        }
      }
    }
  }
`;

const ADD_SHOP_PLAN = gql`
  mutation($planId: ID!, $shopId: ID!) {
    adminAddShopPlan(input: { planId: $planId, shopId: $shopId }) {
      shopPlan {
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

const AddPlanToShop = () => {
  const [shopInput, setShopInput] = React.useState({});

  const handleChange = e => {
    setShopInput({ [e.target.id]: e.target.value });
  };

  const [getShopInfo, { loading, error, data }] = useMutation(GET_SHOP_INFO, {
    variables: { ...shopInput }
  });

  const ChoosePlan = ({ shopId }) => {
    // storing plan id
    const [selectedPlan, setSelectedPlan] = React.useState({
      id: false,
      amount: 0
    });
    const [addShopPlan, { loading, error, data }] = useMutation(ADD_SHOP_PLAN, {
      variables: { shopId, planId: selectedPlan.id }
    });
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
        onClick={addShopPlan}
        disabled={loading || data || !selectedPlan.id}
        color='primary'
        variant='extended'
        // className={classes.fab}
      >
        Add plan
      </Fab>
    );

    const PlanInfo = () => {
      const {
        shopPlan: {
          isActive,
          orderId,
          addedAt,
          dateStart: dateStartStr,
          dateEnd: dateEndStr,
          plan: { name: planName, price, productSpace, validityDuration }
        }
      } = data.adminAddShopPlan;

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
          fab={StickyButton}></AvailablePlans>
        {error && <GraphqlErrorMessage error={error}></GraphqlErrorMessage>}
        {data && <PlanInfo></PlanInfo>}
      </>
    );
  };

  const ShopInfo = () => {
    const {
      id: shopId,
      properties: {
        title: shopName,
        publicUsername: shopUsername,
        owner: { email, firstName, lastName },
        isActive,
        address,
        contactNumber
      }
    } = data.adminGetShopInfo.shop;
    return (
      <List>
        <ListItem>
          <ListItemText
            primary='Shop Status'
            secondary={
              <>Is active: {isActive ? 'Yes' : 'No'}</>
            }></ListItemText>
        </ListItem>
        <ListItem>
          <ListItemText
            primary='Shop General Details'
            secondary={
              <>
                Username: {shopUsername}
                <br></br>
                Name: {shopName}
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
        <ListItem>
          <ListItemText
            primary='Contact Details'
            secondary={
              <>
                Address: {address}
                <br></br> Phone No: {contactNumber}
              </>
            }></ListItemText>
        </ListItem>
      </List>
    );
  };

  return (
    <Container>
      <Typography variant='h5' align='center'>
        Add shop plans
      </Typography>
      <Grid style={{ marginTop: 20 }} container spacing={2}>
        <Grid item xs={12} md={5}>
          <TextField
            variant='outlined'
            fullWidth
            onChange={handleChange}
            id='shopUsername'
            label='Shop Username'
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
            onClick={getShopInfo}
            disabled={loading}
            variant='contained'
            color='primary'>
            Get shop info
          </Button>
        </ListItem>

        {/* Shop info */}
        {data && <ShopInfo></ShopInfo>}
        <br></br>
        {data && (
          <ChoosePlan shopId={data.adminGetShopInfo.shop.id}></ChoosePlan>
        )}
      </List>
    </Container>
  );
};

export default AddPlanToShop;
