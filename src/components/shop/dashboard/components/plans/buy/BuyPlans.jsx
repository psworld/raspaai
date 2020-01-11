import {
  Container,
  CssBaseline,
  Fab,
  Typography,
  Button
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import React, { useEffect, useRef } from 'react';
import ErrorPage from '../../../../../core/ErrorPage';
import AvailablePlans from './AvailablePlans';
import { gql } from 'apollo-boost';
import { useMutation } from 'react-apollo';
import SEO from '../../../../../seo';

const useStyles = makeStyles(theme => ({
  fab: {
    position: 'fixed',
    bottom: theme.spacing(1)
  },
  heading: {
    padding: theme.spacing(1, 2),
    marginBottom: theme.spacing(2),
    borderRadius: 0,
    color: theme.palette.common.white,
    backgroundColor: theme.palette.primary.main
  }
}));

const GET_PAYTM_PARAMS = gql`
  mutation($planId: ID!) {
    getPaytmSubmitForm(input: { planId: $planId }) {
      paytmParams
    }
  }
`;

export const BuyPlanLayout = ({ children }) => {
  return (
    <>
      <SEO title='Buy Shop Plans' description='Buy new shop plans'></SEO>
      <CssBaseline></CssBaseline>

      <main style={{ marginBottom: '12%' }}>{children}</main>
    </>
  );
};

const BuyPlans = () => {
  const classes = useStyles();
  // Display plans under product space category
  // eg. All the plans with different validity but with same product space

  // Product space 50
  // MRP 99 validity 28
  // MRP 199 validity 56

  // Product space 75
  // MRP 149 validity 28
  // ...

  const [step, setStep] = React.useState(1);

  const handleNext = () => {
    if (step === 1) {
      setStep(step + 1);
    } else {
      throw new Error('Invalid Step');
    }
  };

  const handleCancel = () => {
    if (step === 2) {
      setStep(step - 1);
    } else {
      throw new Error('Invalid Step');
    }
  };

  // storing plan id
  const [selectedPlan, setSelectedPlan] = React.useState({
    id: false,
    amount: 0
  });

  const [getPaytmParams, { loading, error, data, called }] = useMutation(
    GET_PAYTM_PARAMS,
    {
      variables: { planId: selectedPlan.id },
      onCompleted() {
        handleNext();
      }
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

  const PaytmForm = () => {
    const formRef = useRef(null);
    useEffect(() => {
      formRef.current.submit();
    }, []);
    const paytmParams = JSON.parse(data.getPaytmSubmitForm.paytmParams);
    return (
      <>
        <Typography style={{ marginTop: '10%' }} variant='h4' align='center'>
          Please do not refresh this page...
        </Typography>

        <form
          ref={formRef}
          method='post'
          action='https://securegw-stage.paytm.in/order/process'
          name='paytm'>
          <table>
            <tbody>
              {Object.keys(paytmParams).map(key => {
                const value = paytmParams[key];
                return (
                  <input
                    key={key}
                    type='hidden'
                    name={key}
                    value={value}></input>
                );
              })}
            </tbody>
          </table>
        </form>
      </>
    );
  };

  const StickyButton = (
    <Fab
      onClick={getPaytmParams}
      // disabled={loading || called || data}
      disabled={loading || data || !selectedPlan.id}
      color='primary'
      variant='extended'
      className={classes.fab}>
      Buy
    </Fab>
  );

  const getActiveStepContent = () => {
    switch (step) {
      case 1:
        return (
          <>
            <AvailablePlans
              handlePlanSelect={handlePlanSelect}
              selectedPlan={selectedPlan.id}
              headingClasses={classes.heading}
              fab={StickyButton}></AvailablePlans>
          </>
        );
      case 2:
        return <PaytmForm></PaytmForm>;

      default:
        return <ErrorPage></ErrorPage>;
    }
  };

  return <BuyPlanLayout>{getActiveStepContent()}</BuyPlanLayout>;
};

export default BuyPlans;
