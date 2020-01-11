/* eslint-disable no-script-url */

import React from 'react';
import Typography from '@material-ui/core/Typography';
import gql from 'graphql-tag';
import { useQuery } from 'react-apollo';

import ErrorPage from '../../../core/ErrorPage';
import Loading from '../../../core/Loading';
import Link from '../../../core/Link';
import { differenceInDays, format, differenceInHours } from 'date-fns';

const BRAND_PLAN_INFO = gql`
  query($publicBrandUsername: String!) {
    brand(publicBrandUsername: $publicBrandUsername) {
      id
      publicUsername
      activePlan {
        id
        addedAt
        dateStart
        dateEnd
        plan {
          id
          planId
          price
          productSpace
          validityDuration
        }
      }
      noOfProducts
    }
  }
`;

const PLAN_INFO = gql`
  query($publicShopUsername: String!) {
    shop(publicShopUsername: $publicShopUsername) {
      id
      properties {
        noOfProducts
        activePlan {
          id
          addedAt
          dateStart
          dateEnd
          plan {
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
  }
`;

const PlanInfoCard = ({
  price,
  planExpiryDate,
  productSpace,
  noOfProducts
}) => {
  const expiryDate = format(planExpiryDate, 'MMM d, y h:m a');
  return (
    <React.Fragment>
      {/* <Title>Plan Details</Title> */}
      <Typography component='p' variant='h6'>
        ₹ {price} plan
      </Typography>
      {/* <Typography>Validity: {validityDuration.split(",")[0]}</Typography> */}
      <Typography color='textSecondary'>Expires on {expiryDate}</Typography>
      <Typography>
        {productSpace - noOfProducts} product space remaining out of total{' '}
        {productSpace}
        {/* <CircularProgress
          variant="static"
          value={availableProductSpaceTage}
        /> */}
      </Typography>
      {/* <Typography>Total Product Space: {productSpace}</Typography> */}

      <div>
        <Link to={`${window.location.pathname}/plans`}>View Details</Link>
      </div>
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
    const { id, noOfProducts, activePlan } = data.brand;
    if (activePlan) {
      const {
        dateEnd,
        dateStart,
        addedAt,
        plan: { planId, price, productSpace, validityDuration }
      } = activePlan;

      const planExpiryDate = new Date(dateEnd);
      const planIssuedAt = new Date(dateStart);

      return (
        <PlanInfoCard
          price={price}
          planExpiryDate={planExpiryDate}
          productSpace={productSpace}
          noOfProducts={noOfProducts}></PlanInfoCard>
      );
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
      id,
      properties: {
        planIssuedAt: planIssuedAtStr,
        planExpiryDate: planExpiryDateStr,
        noOfProducts,
        activePlan: {
          dateEnd,
          dateStart,
          addedAt,
          plan: { planId, price, productSpace, validityDuration }
        }
      }
    } = data.shop;
    const planExpiryDate = new Date(dateEnd);
    const planIssuedAt = new Date(dateStart);
    return (
      <PlanInfoCard
        price={price}
        planExpiryDate={planExpiryDate}
        productSpace={productSpace}
        noOfProducts={noOfProducts}></PlanInfoCard>
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
