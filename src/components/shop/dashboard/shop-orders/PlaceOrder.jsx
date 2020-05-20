import {
  Button,
  Container,
  Divider,
  Drawer,
  Grid,
  Paper,
  Step,
  StepLabel,
  Stepper,
  Typography
} from '@material-ui/core';
import { green } from '@material-ui/core/colors';
import { makeStyles } from '@material-ui/core/styles';
import { gql } from 'apollo-boost';
import { reverse } from 'named-urls';
import React from 'react';
import { useMutation, useQuery } from 'react-apollo';
import ErrorPage from '../../../core/ErrorPage';
import Link from '../../../core/Link';
import Loading from '../../../core/Loading';
import routes from '../../../core/routes';
import singularOrPlural from '../../../core/utils';
import { VIEWER } from '../../../navbar/ToolBarMenu';
import {
  HeroElementGridItem,
  WholesalerElement
} from '../../../templates/HeroElement';
import { InOutStock } from '../../../templates/product-detail/ProductDetails';
import ProductThumb from '../../../templates/ProductThumb';
import { getMeasurementUnit, SHOP_CART_LINES } from './Cart';

const NEARBY_WHOLESALERS = gql`
  query($after: String) {
    nearbyWholesalers(after: $after, first: 20) {
      pageInfo {
        startCursor
        endCursor
        hasNextPage
        hasPreviousPage
      }
      edges {
        node {
          id
          name
          image
        }
      }
    }
  }
`;

const CHECKOUT_SHOP_CART = gql`
  mutation {
    checkoutShopCart(input: { clientMutationId: "" }) {
      shopOrder {
        id
        created
        referenceId
      }
    }
  }
`;

const useStyles = makeStyles(theme => ({
  paper: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
    // padding: theme.spacing(2),
    [theme.breakpoints.up(600 + theme.spacing(3) * 2)]: {
      marginTop: theme.spacing(6),
      marginBottom: theme.spacing(6)
      // padding: theme.spacing(3),
    }
  },
  spacing: { marginTop: theme.spacing(2) },
  stepper: {
    padding: theme.spacing(3, 0, 5)
  },
  buttons: {
    display: 'flex',
    justifyContent: 'flex-end'
  },
  button: {
    marginTop: theme.spacing(3),
    marginLeft: theme.spacing(1)
  },
  nested: {
    paddingLeft: theme.spacing(4)
  },
  grey: {
    backgroundColor: theme.palette.grey[100],
    marginBottom: theme.spacing(2)
  }
}));

const ReviewOrder = ({ shopCartLineNodeEdges, classes, handleNext }) => {
  const [checkoutShopCart, { loading, error, data }] = useMutation(
    CHECKOUT_SHOP_CART,
    {
      onCompleted: handleNext
    }
  );

  const noOfWholesalers = shopCartLineNodeEdges.length;
  let offeredPriceTotal = 0;
  let totalNoOfItems = 0;
  return (
    <Grid container>
      <Drawer open={loading}></Drawer>
      {shopCartLineNodeEdges.map(shopCartLine => {
        const {
          id: shopCartLineId,
          wholesaler: { id: wholesalerId, name: wholesalerName },
          wholesaler,
          cartItems: { edges: cartItemNodeEdges }
        } = shopCartLine.node;
        let subTotal = 0;
        let noOfItems = cartItemNodeEdges.length;
        totalNoOfItems += noOfItems;

        return (
          <>
            <Grid item xs={12} md={12}>
              <Typography variant='h5'>{wholesalerName}</Typography>
            </Grid>
            <br></br>
            {cartItemNodeEdges.map((cartItem, index) => {
              const {
                quantity,
                wholesalerProduct: {
                  inStock,
                  quantity: baseQuantity,
                  offeredPrice,
                  brandProduct: { thumb, title, measurementUnit }
                }
              } = cartItem.node;

              const shopCartItemNode = cartItem.node;

              // Measurement units will be same on wholesaler product, brand product, and cart item
              subTotal +=
                shopCartItemNode.quantity *
                (shopCartItemNode.wholesalerProduct.offeredPrice /
                  shopCartItemNode.wholesalerProduct.quantity);

              if (index + 1 === cartItemNodeEdges.length) {
                offeredPriceTotal += subTotal;
              }
              return (
                <>
                  <Grid item xs={3} sm={3} md={2} className={classes.thumb}>
                    <ProductThumb src={thumb} title={title}></ProductThumb>
                  </Grid>
                  <Grid item xs={9} sm={9} md={10}>
                    <div style={{ paddingLeft: 6 }}>
                      <Typography variant='h6'>
                        {title.substring(0, 60)}
                        {title.length > 60 && '...'}
                      </Typography>
                      <InOutStock inStock={inStock}></InOutStock>

                      <Grid container>
                        <Grid item xs={2} md={2} style={{ paddingRight: 5 }}>
                          <Typography variant='h6' name='quantity'>
                            Qty: {quantity}
                            {getMeasurementUnit(measurementUnit)}
                          </Typography>
                        </Grid>

                        <Grid item xs={6}>
                          <Typography variant='h6'>
                            <span style={{ color: green[800] }}>
                              &#x20b9;{offeredPrice}
                            </span>{' '}
                            Per {baseQuantity}
                            {getMeasurementUnit(measurementUnit)}
                          </Typography>
                        </Grid>
                      </Grid>
                    </div>
                  </Grid>

                  <Divider></Divider>
                </>
              );
            })}
            <Grid item xs={12} md={12}>
              <Typography variant='h6' align='right'>
                Subtotal ({noOfItems} item
                {singularOrPlural(noOfItems)}):{' '}
                <span style={{ color: 'green' }}>&#x20b9; {subTotal}</span>
              </Typography>
            </Grid>
          </>
        );
      })}
      <Grid style={{ marginTop: 40 }} item xs={12} md={12}>
        <Typography className={classes.spacing} align='center' variant='h4'>
          Order Summary
        </Typography>
        <Paper color='primary' className={classes.cartSummary}>
          <Container maxWidth='sm' className={classes.spacing}>
            <Typography variant='h5'>
              Total ({totalNoOfItems} item
              {singularOrPlural(totalNoOfItems)}):{' '}
              <span style={{ color: 'green' }}>
                <b>&#x20b9;{offeredPriceTotal}</b>
              </span>
            </Typography>

            <Typography variant='h6'>
              From {noOfWholesalers} Wholesaler
              {singularOrPlural(noOfWholesalers)}
            </Typography>

            <br></br>
            <Button
              variant='contained'
              onClick={checkoutShopCart}
              disabled={loading}
              style={{
                backgroundColor: green[700],
                color: 'white',
                width: '100%'
              }}>
              <Typography>Place Order</Typography>
            </Button>
          </Container>
        </Paper>
      </Grid>
    </Grid>
  );
};

export const CheckoutShopCart = () => {
  const classes = useStyles();
  const [activeStep, setActiveStep] = React.useState(0);

  const { loading, error, data } = useQuery(SHOP_CART_LINES);

  const handleNext = () => {
    setActiveStep(activeStep + 1);
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  const { data: viewerData } = useQuery(VIEWER);

  const steps = ['Review your order'];

  function getStepContent(step) {
    switch (step) {
      case 0:
        return (
          <ReviewOrder
            viewerData={viewerData}
            shopCartLineNodeEdges={data.shopCartLines.edges}
            classes={classes}
            handleNext={handleNext}
          />
        );

      default:
        throw new Error('Unknown step');
    }
  }

  return (
    <Container maxWidth='md'>
      {viewerData && viewerData.viewer !== null && (
        <Paper className={classes.paper}>
          <Typography component='h1' variant='h4' align='center'>
            Checkout
          </Typography>
          <Stepper activeStep={activeStep} className={classes.stepper}>
            {steps.map(label => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          <React.Fragment>
            {loading && <Loading></Loading>}
            {data &&
              data.shopCartLines &&
              data.shopCartLines.edges.length !== 0 && (
                <>
                  {activeStep === steps.length ? (
                    <Typography variant='h5' gutterBottom>
                      Thank you for your order.
                    </Typography>
                  ) : (
                    <React.Fragment>
                      {getStepContent(activeStep)}

                      <div className={classes.buttons}>
                        {activeStep !== 0 && (
                          <Button
                            onClick={handleBack}
                            className={classes.button}
                            variant='outlined'>
                            Back
                          </Button>
                        )}
                      </div>
                    </React.Fragment>
                  )}
                </>
              )}
            {data &&
              data.shopCartLines &&
              data.shopCartLines.edges.length === 0 && (
                <>
                  <Typography variant='h3' align='center'>
                    You do not have any item in your cart.
                  </Typography>
                  <br></br>
                  <Button
                    color='primary'
                    component={Link}
                    to='/'
                    variant='contained'>
                    Continue Shopping
                  </Button>
                </>
              )}
          </React.Fragment>
        </Paper>
      )}
    </Container>
  );
};

const NearbyWholesalers = ({ shopUsername }) => {
  const { loading, error, data } = useQuery(NEARBY_WHOLESALERS);
  if (loading) return <Loading></Loading>;
  if (error) return <ErrorPage></ErrorPage>;
  if (
    data &&
    data.nearbyWholesalers &&
    data.nearbyWholesalers.pageInfo.startCursor
  ) {
    const wholesalersNodeEdges = data.nearbyWholesalers.edges;

    return (
      <Grid container>
        {wholesalersNodeEdges.map(wholesaler => (
          <HeroElementGridItem key={wholesaler.node.id}>
            <WholesalerElement
              wholesalerNode={wholesaler.node}
              primaryLink={reverse(
                `${routes.shop.dashboard.placeOrder.wholesaler}`,
                { shopUsername, wholesalerId: wholesaler.node.id }
              )}></WholesalerElement>
          </HeroElementGridItem>
        ))}
      </Grid>
    );
  }
};

const PlaceOrder = ({ shopUsername }) => {
  return (
    <>
      <Typography variant='h4' align='center'>
        Place Order To Wholesalers
      </Typography>
      <NearbyWholesalers shopUsername={shopUsername}></NearbyWholesalers>
    </>
  );
};

export default PlaceOrder;
