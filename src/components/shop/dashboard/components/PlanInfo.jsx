/* eslint-disable no-script-url */

import { Button } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import { format } from 'date-fns';
import { navigate } from 'gatsby';
import gql from 'graphql-tag';
import React from 'react';
import { useQuery } from 'react-apollo';
import ErrorPage from '../../../core/ErrorPage';
import Loading from '../../../core/Loading';

const BRAND_PLAN_INFO = gql`
  query($publicBrandUsername: String!) {
    brand(publicBrandUsername: $publicBrandUsername) {
      id
      publicUsername
      occupiedSpace
      activePlan {
        id
        addedAt
        dateStart
        dateEnd
        isValid
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
`;

const PLAN_INFO = gql`
  query($publicShopUsername: String!) {
    shop(publicShopUsername: $publicShopUsername) {
      id
      properties {
        occupiedSpace
        activePlan {
          id
          addedAt
          dateStart
          dateEnd
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
`;

const PlanInfoCard = ({
  price,
  planExpiryDate,
  productSpace,
  occupiedSpace,
  planName
}) => {
  const expiryDate = format(planExpiryDate, 'MMM d, y h:m a');
  return (
    <React.Fragment>
      {/* <Title>Plan Details</Title> */}
      <Typography component='p' variant='h6'>
        {planName}
      </Typography>
      {/* <Typography>Validity: {validityDuration.split(",")[0]}</Typography> */}
      <Typography color='textSecondary'>Expires on {expiryDate}</Typography>
      <br></br>
      <Typography variant='body1'>
        <b>{productSpace - occupiedSpace}</b> product space remaining out of
        total {productSpace}
        {/* <CircularProgress
          variant="static"
          value={availableProductSpaceTage}
        /> */}
      </Typography>
      {/* <Typography>Total Product Space: {productSpace}</Typography> */}

      <br></br>
      <Button
        onClick={() => navigate(`${window.location.pathname}/plans`)}
        variant='contained'
        color='secondary'>
        View Details
      </Button>
    </React.Fragment>
  );
};

const BrandPlanInfo = ({ publicUsername }) => {
  const { loading, error, data } = useQuery(BRAND_PLAN_INFO, {
    variables: { publicBrandUsername: publicUsername }
  });
  if (loading) return <Loading></Loading>;
  if (error) return <ErrorPage></ErrorPage>;
  if (data) {
    const { occupiedSpace, activePlan } = data.brand;
    if (activePlan) {
      const {
        dateEnd,
        isValid,
        productSpace,
        plan: { price, name: planName }
      } = activePlan;

      const planExpiryDate = new Date(dateEnd);

      if (isValid) {
        return (
          <PlanInfoCard
            price={price}
            planExpiryDate={planExpiryDate}
            planName={planName}
            productSpace={productSpace}
            occupiedSpace={occupiedSpace}></PlanInfoCard>
        );
      } else {
        return (
          <>
            <Typography variant='h6'>Your current plan has expired.</Typography>
            <Typography color='textSecondary'>
              If you have already bought a plan then do not worry, it will get
              updated within a day.
            </Typography>
            <br></br>
            <Button
              onClick={() => navigate(`${window.location.pathname}/plans`)}
              variant='contained'
              color='secondary'>
              View Details
            </Button>
          </>
        );
      }
    }

    return <Typography>You do not have any active plans</Typography>;
  }
};

const ShopPlanInfo = ({ publicUsername }) => {
  const { loading, error, data } = useQuery(PLAN_INFO, {
    variables: { publicShopUsername: publicUsername }
  });
  if (loading) return <Loading></Loading>;
  if (error) return <ErrorPage></ErrorPage>;
  if (data) {
    const {
      properties: {
        occupiedSpace,
        activePlan: {
          dateEnd,
          productSpace,
          plan: { price, name: planName }
        }
      }
    } = data.shop;
    const planExpiryDate = new Date(dateEnd);

    return (
      <PlanInfoCard
        price={price}
        planExpiryDate={planExpiryDate}
        productSpace={productSpace}
        planName={planName}
        occupiedSpace={occupiedSpace}></PlanInfoCard>
    );
  }
};

export default function PlanInfo({ publicUsername, isBrand }) {
  if (isBrand) {
    return <BrandPlanInfo publicUsername={publicUsername}></BrandPlanInfo>;
  } else {
    return <ShopPlanInfo publicUsername={publicUsername}></ShopPlanInfo>;
  }
}
