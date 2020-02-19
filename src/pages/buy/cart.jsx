/* eslint-disable no-redeclare */
import {
  Button,
  Container,
  Divider,
  Grid,
  List,
  ListItem,
  Paper,
  Step,
  StepLabel,
  Stepper,
  Typography
} from '@material-ui/core';
import { green } from '@material-ui/core/colors';
import { makeStyles } from '@material-ui/core/styles';
import { navigate } from '@reach/router';
import { format } from 'date-fns';
import { Formik } from 'formik';
import { TextField } from 'formik-material-ui';
import gql from 'graphql-tag';
import React from 'react';
import { useMutation, useQuery } from 'react-apollo';
import * as yup from 'yup';
import Link from '../../components/core/Link';
import Loading from '../../components/core/Loading';
import {
  decryptText,
  encryptText,
  slugGenerator
} from '../../components/core/utils';
import Layout from '../../components/layout';
import { VIEWER } from '../../components/navbar/ToolBarMenu';
import ProductCollage from '../../components/templates/dashboard/ProductCollage';
import ProductThumb from '../../components/templates/ProductThumb';
import { CART_ITEMS } from '../cart';

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

const UserDetails = ({ formikProps, classes }) => {
  const { handleSubmit, isSubmitting } = formikProps;

  return (
    <Container maxWidth='md'>
      <Typography variant='h6' gutterBottom>
        Your details
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            name='firstName'
            type='text'
            label='First name'
            fullWidth
            autoComplete='fname'
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            name='lastName'
            type='text'
            label='Last name'
            fullWidth
            autoComplete='lname'
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            required
            name='phone'
            type='number'
            label='Phone'
            fullWidth
            autoComplete='phone'
          />
        </Grid>
      </Grid>
      <div className={classes.buttons}>
        <Button
          variant='contained'
          color='primary'
          className={classes.button}
          disabled={isSubmitting}
          onClick={handleSubmit}>
          Continue
        </Button>
      </div>
    </Container>
  );
};

const CHECKOUT_CART = gql`
  mutation($data: CheckoutCartInput!) {
    checkoutCart(input: $data) {
      order {
        id
        created
        status
        userEmail
        shopOrders {
          edges {
            node {
              id
              status
              clientTrackingId
              total
            }
          }
        }
      }
    }
  }
`;

const CLEAR_CART = gql`
  mutation {
    clearCart(input: {}) {
      success
    }
  }
`;

const Review = ({ cartLines, classes, values, handleNext, viewerData }) => {
  const { id: userId, email: customerEmail } = viewerData.viewer;
  const { firstName, lastName, phone } = values;

  const orderPlacedOn = format(new Date(), 'd MMM y  h:mm a');

  let offeredPriceTotal = 0;
  let mrpTotal = 0;
  let totalNoOfItems = 0;

  // {"cartLineId":"orderMessage"}
  const whatsappOrderMessages = {};

  cartLines.forEach(cartLine => {
    const trackingId = Math.floor(100000 + Math.random() * 999999);
    let cartLineMrpTotal = 0;
    let cartLineOfferedPriceTotal = 0;
    let whatsappOrderMessage = `--- *Order Info* ---%0aTracking id - *${trackingId}*%0aPlaced on ${orderPlacedOn}%0a%0a`;
    totalNoOfItems += cartLine.items.edges.length;
    cartLine.items.edges.forEach(cartItem => {
      const cartItemNode = cartItem.node;

      const isCombo = cartItemNode.isCombo;
      const productId = isCombo
        ? cartItemNode.combo.id
        : cartItemNode.shopProduct.id;
      const productTitle = isCombo
        ? cartItemNode.combo.name
        : cartItemNode.shopProduct.product.title;
      const baseUnit = isCombo
        ? false
        : cartItemNode.shopProduct.product.measurementUnit;
      const baseUnitOfferedPrice = isCombo
        ? cartItemNode.combo.offeredPrice
        : cartItemNode.shopProduct.offeredPrice;

      const productSlug = slugGenerator(productTitle);
      const shopUsername = cartLine.shop.properties.publicUsername;

      const productLink = `${window.location.origin}/shop/${shopUsername}/${
        isCombo ? 'combo' : 'product'
      }/${productSlug}/${productId}`;

      whatsappOrderMessage += `*${productTitle}*%0a${productLink}%0a*Qty: ${
        cartItemNode.quantity
      }${
        cartItemNode.measurementUnit ? cartItemNode.measurementUnit : ''
      }*     Offered price: ₹${baseUnitOfferedPrice}${
        baseUnit ? ' per ' + baseUnit : ''
      }%0a%0a`;

      // For a cart line. Mrp sub total is total cost of all the products at their
      // mrp including qty
      // cartLineOfferedPriceTotal is price paid by customer for all the item in
      // cartLine
      cartLineOfferedPriceTotal += cartItemNode.offeredPriceTotal;
      cartLineMrpTotal += cartItemNode.totalCost;

      // These are for whole cart summary. These can include different cart lines
      offeredPriceTotal += cartItemNode.offeredPriceTotal;
      mrpTotal += cartItemNode.totalCost
        ? cartItemNode.totalCost
        : cartItemNode.offeredPriceTotal;
    });
    whatsappOrderMessage += `*--- Buyer information ---*%0a${firstName} ${lastName}%0aEmail ${customerEmail}%0aPhone ${phone}%0a%0a`;
    whatsappOrderMessage +=
      cartLineOfferedPriceTotal < cartLineMrpTotal
        ? `*Amount to pay* ~₹${cartLineMrpTotal}~ *₹${cartLineOfferedPriceTotal}*%0aYou save ₹${cartLineMrpTotal -
            cartLineOfferedPriceTotal}`
        : `*Amount to pay ₹${cartLineOfferedPriceTotal}*`;
    whatsappOrderMessage += `%0a%0aThankyou for using Raspaai. ❤`;

    whatsappOrderMessages[cartLine.id] = whatsappOrderMessage;
  });

  const [clearCart, { loading, error, data }] = useMutation(CLEAR_CART, {
    update(store) {
      store.writeQuery({
        query: CART_ITEMS,
        data: { cartLines: [] }
      });
    },
    onCompleted() {
      navigate('/');
    }
  });

  // const [checkoutCart, { loading, data }] = useMutation(CHECKOUT_CART, {
  //   variables: {
  //     data: {
  //       fullName: `${firstName} ${lastName}`,
  //       phone
  //     }
  //   },
  //   refetchQueries: [{ query: MY_ORDERS, variables: { userId } }],
  //   update(store) {
  //     store.writeQuery({
  //       query: CART_ITEMS,
  //       data: { cartLines: [] }
  //     });
  //   },
  //   onCompleted() {
  //     navigate('/my-orders');
  //   }
  // });

  return (
    <>
      <Typography align='center' variant='h4'>
        Total amount to pay:{' '}
        <span style={{ textDecorationLine: 'line-through', fontSize: 20 }}>
          &#x20b9;{mrpTotal}
        </span>{' '}
        <span style={{ color: 'green' }}>&#x20b9;{offeredPriceTotal}</span>
      </Typography>
      {offeredPriceTotal < mrpTotal && (
        <Typography align='center' variant='h5'>
          You save{' '}
          <span style={{ color: 'blue' }}>
            &#x20b9;{mrpTotal - offeredPriceTotal} (
            {Math.round(100 - (100 / mrpTotal) * offeredPriceTotal)}%)
          </span>
        </Typography>
      )}
      <Typography align='center' variant='h5'>
        Total no of items: {totalNoOfItems}
      </Typography>
      <List>
        {cartLines.map(cartLineNode => {
          const {
            id: cartLineId,
            shop: {
              id: shopId,
              geometry: { coordinates },
              properties: {
                title: shopName,
                publicUsername: shopUsername,
                address,
                contactNumber: shopContactNumber
              }
            },
            items: { edges: cartItems }
          } = cartLineNode;

          const lat = coordinates[1];
          const lng = coordinates[0];

          let mrpSubTotal = 0;
          let subTotal = 0;
          const noOfItems = cartItems.length;
          return (
            <div key={shopId} className={classes.grey}>
              <ListItem>
                <Typography variant='h5'>{shopName}</Typography>
              </ListItem>

              <Grid container>
                {cartItems.map(cartItem => {
                  const cartItemNode = cartItem.node;

                  subTotal += cartItemNode.offeredPriceTotal;
                  mrpSubTotal += cartItemNode.totalCost;

                  const {
                    id: cartItemId,
                    measurementUnit,
                    shopProduct,
                    combo,
                    quantity,
                    isCombo
                  } = cartItem.node;

                  if (isCombo) {
                    var {
                      id: comboId,
                      offeredPrice,
                      name: title,
                      thumbs,
                      totalCost: mrp,
                      isAvailable: inStock
                    } = combo;
                  } else {
                    var {
                      id: shopProductId,
                      product: {
                        title,
                        thumb,
                        mrp,
                        measurementUnit: baseMeasurementUnit
                      },
                      offeredPrice,
                      inStock
                    } = shopProduct;
                  }

                  return (
                    <>
                      <Grid item xs={3} sm={3} md={2} className={classes.thumb}>
                        {isCombo ? (
                          <ProductCollage
                            thumbs={thumbs}
                            title={title}></ProductCollage>
                        ) : (
                          <ProductThumb
                            src={thumb}
                            title={title}></ProductThumb>
                        )}
                      </Grid>
                      <Grid item xs={9} sm={9} md={9}>
                        <div style={{ paddingLeft: 6 }}>
                          <Typography variant='h6'>
                            {title.substring(0, 60)}
                            {title.length > 60 && '...'}
                          </Typography>
                          <Typography
                            style={
                              inStock ? { color: green[900] } : { color: 'red' }
                            }
                            // component={"p"}
                            variant='subtitle2'>
                            {inStock ? 'In stock' : 'Out of stock'}
                          </Typography>

                          <Grid container>
                            <Grid item xs={12} md={6}>
                              <Typography>
                                Qty: {quantity} {measurementUnit}
                              </Typography>
                            </Grid>
                            <Grid item>
                              <Typography
                                variant='body1'
                                style={{ color: green[800] }}>
                                {mrp && (
                                  <Typography variant='caption'>
                                    <span
                                      style={{
                                        textDecoration: 'line-through'
                                      }}>
                                      &#x20b9;{mrp}
                                    </span>{' '}
                                  </Typography>
                                )}
                                &#x20b9;{offeredPrice}{' '}
                                {baseMeasurementUnit && (
                                  <span style={{ fontSize: 'small' }}>
                                    per {baseMeasurementUnit}
                                  </span>
                                )}
                              </Typography>
                            </Grid>
                          </Grid>
                        </div>
                      </Grid>
                    </>
                  );
                })}
              </Grid>
              <ListItem>
                <Typography variant='h6'>
                  Amount to pay{' '}
                  <span style={{ color: 'green' }}>&#x20b9;{subTotal}</span>
                </Typography>
              </ListItem>
              <ListItem>
                <Typography variant='body1'>
                  Collect at{' '}
                  <a
                    href={`${process.env.GATSBY_G_MAP_URL}${lat},${lng}`}
                    target='_blank'
                    rel='noopener noreferrer'>
                    {address}
                  </a>
                </Typography>
              </ListItem>

              <ListItem>
                <Button variant='contained' color='primary'>
                  <a
                    href={`https://wa.me/91${shopContactNumber}?text=${whatsappOrderMessages[cartLineId]}`}
                    target='_blank'
                    rel='noopener noreferrer'
                    style={{ color: 'inherit' }}>
                    Place whatsapp order
                  </a>
                </Button>
              </ListItem>
              <Divider></Divider>
            </div>
          );
        })}
      </List>
      <Typography align='center' variant='h4'>
        Your Details
      </Typography>
      <Container maxWidth='xs'>
        <Grid container>
          <Grid item xs={12}>
            <Typography align='center' variant='h6'>
              {firstName} {lastName}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography align='center' variant='h6'>
              +91 {phone}
            </Typography>
          </Grid>
        </Grid>
      </Container>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Button
          onClick={clearCart}
          disabled={loading || data}
          className={classes.button}
          variant='contained'
          color='primary'>
          Done
        </Button>
      </div>
      {data && (
        <Typography style={{ color: 'green' }} variant='h6' align='center'>
          Order placed
        </Typography>
      )}
    </>
  );
};

const CheckoutFromCart = () => {
  const classes = useStyles();
  const { loading, error, data } = useQuery(CART_ITEMS);

  const [activeStep, setActiveStep] = React.useState(0);

  const handleNext = () => {
    setActiveStep(activeStep + 1);
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  const { data: viewerData } = useQuery(VIEWER);

  const steps = ['Your details', 'Review your order'];

  let buyer =
    typeof window !== 'undefined' ? localStorage.getItem('BI') : false;
  buyer = buyer ? decryptText(buyer) : false;
  buyer = buyer ? JSON.parse(buyer) : {};

  return (
    <Layout>
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
              {data && data.cartLines && data.cartLines.length !== 0 && (
                <>
                  {activeStep === steps.length ? (
                    <Typography variant='h5' gutterBottom>
                      Thank you for your order.
                    </Typography>
                  ) : (
                    <Formik
                      initialValues={{
                        firstName: buyer.firstName,
                        lastName: buyer.lastName,
                        phone: buyer.phone
                      }}
                      validationSchema={yup.object().shape({
                        firstName: yup
                          .string('Only letters are allowed in name')
                          .min(2, 'Too Short!')
                          .max(50, 'Too Long!')
                          .required('First name required'),
                        lastName: yup
                          .string('Only letters are allowed in name')
                          .min(3, 'Too Short!')
                          .max(50, 'Too Long!')
                          .required('Last name required'),
                        phone: yup
                          .string()
                          .matches(/^[1-9]\d{9}$/, {
                            message: 'Please enter valid number.',
                            excludeEmptyString: false
                          })
                          .required('Phone number required')
                      })}
                      onSubmit={(values, { setSubmitting }) => {
                        localStorage.setItem(
                          'BI',
                          encryptText(JSON.stringify(values))
                        );
                        handleNext();
                        setSubmitting(false);
                      }}>
                      {formik => {
                        function getStepContent(step) {
                          switch (step) {
                            case 0:
                              return (
                                <UserDetails
                                  classes={classes}
                                  formikProps={formik}
                                />
                              );
                            case 1:
                              return (
                                <Review
                                  viewerData={viewerData}
                                  cartLines={data.cartLines}
                                  classes={classes}
                                  values={formik.values}
                                  handleNext={handleNext}
                                />
                              );

                            default:
                              throw new Error('Unknown step');
                          }
                        }
                        return (
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
                        );
                      }}
                    </Formik>
                  )}
                </>
              )}
              {data && data.cartLines && data.cartLines.length === 0 && (
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
    </Layout>
  );
};

export default CheckoutFromCart;
