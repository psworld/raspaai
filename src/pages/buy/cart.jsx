import React from 'react';
import Layout from '../../components/layout';
import { makeStyles } from '@material-ui/core/styles';
import {
  Typography,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Button,
  Container,
  FormControlLabel,
  Grid,
  TextField,
  Checkbox,
  List,
  ListItem,
  FormControl,
  NativeSelect,
  Divider
} from '@material-ui/core';
import { CART_ITEMS } from '../cart';
import { useQuery, useMutation } from 'react-apollo';
import Link from '../../components/core/Link';
import ProductThumb from '../../components/templates/ProductThumb';
import slugGenerator from '../../components/core/slugGenerator';
import { green } from '@material-ui/core/colors';
import { Formik } from 'formik';

import * as yup from 'yup';
import { hasError } from '../../components/signin/SigninForm';
import gql from 'graphql-tag';
import { MY_ORDERS } from '../my-orders';
import { navigate } from '@reach/router';

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
  const {
    values,
    touched,
    errors,
    handleChange,
    handleBlur,
    handleSubmit,
    isSubmitting
  } = formikProps;
  const { firstName, lastName, phone } = values;

  return (
    <Container maxWidth='md'>
      <Typography variant='h6' gutterBottom>
        Your details
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id='firstName'
            name='firstName'
            type='text'
            defaultValue={firstName}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.firstName && errors.firstName && true}
            label={
              touched.firstName && errors.firstName
                ? errors.firstName
                : 'First name'
            }
            fullWidth
            autoComplete='fname'
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id='lastName'
            name='lastName'
            type='text'
            value={lastName}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.lastName && errors.lastName && true}
            label={
              touched.lastName && errors.lastName
                ? errors.lastName
                : 'Last name'
            }
            fullWidth
            autoComplete='lname'
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            required
            id='phone'
            name='phone'
            type='number'
            value={phone}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.phone && errors.phone && true}
            label={touched.phone && errors.phone ? errors.phone : 'Phone'}
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

const Review = ({ cartItems, classes, values, handleNext }) => {
  const { firstName, lastName, phone } = values;

  const sortedCartItems = [];

  let shop_ids = [];

  let total = 0;
  let mrpTotal = 0;
  let totalNoOfItems = 0;

  cartItems.forEach(cartItem => {
    shop_ids.push(cartItem.item.shop.id);
    total += cartItem.item.offeredPrice * cartItem.quantity;
    mrpTotal += cartItem.item.product.mrp * cartItem.quantity;
    totalNoOfItems += cartItem.quantity;
  });

  shop_ids = [...new Set(shop_ids)];

  shop_ids.forEach(shopId => {
    const shopCartItems = cartItems.filter(
      cartItem => cartItem.item.shop.id === shopId
    );
    const locationList = shopCartItems[0].item.shop.geometry.coordinates;
    const location = {
      lat: locationList[1],
      lng: locationList[0]
    };
    sortedCartItems.push({
      shopId: shopId,
      shopName: shopCartItems[0].item.shop.properties.title,
      publicUsername: shopCartItems[0].item.shop.properties.publicUsername,
      address: shopCartItems[0].item.shop.properties.address,
      location,
      shopCartItems
    });
  });

  let noOfShops = shop_ids.length;

  const [checkoutCart, { called, loading, error, data }] = useMutation(
    CHECKOUT_CART,
    {
      variables: {
        data: {
          shopIds: shop_ids,
          fullName: `${firstName} ${lastName}`,
          phone
        }
      },
      refetchQueries: [{ query: MY_ORDERS }],
      update(store) {
        store.writeQuery({
          query: CART_ITEMS,
          data: { cartItems: [] }
        });
      },
      onCompleted() {
        navigate('/my-orders');
      }
    }
  );

  return (
    <>
      <Typography align='center' variant='h4'>
        Total amount to pay:{' '}
        <span style={{ textDecorationLine: 'line-through', fontSize: 20 }}>
          &#x20b9;{mrpTotal}
        </span>{' '}
        <span style={{ color: 'green' }}>&#x20b9;{total}</span>
      </Typography>
      <Typography align='center' variant='h5'>
        You save{' '}
        <span style={{ color: 'blue' }}>
          &#x20b9;{mrpTotal - total} (
          {Math.round(100 - (100 / mrpTotal) * total)}%)
        </span>
      </Typography>
      <Typography align='center' variant='h5'>
        Total no of items: {totalNoOfItems}
      </Typography>
      <List>
        {sortedCartItems.map(shopCart => {
          const {
            shopName,
            shopId,
            shopCartItems,
            publicUsername: shopUsername,
            address,
            location: { lat, lng }
          } = shopCart;
          let subTotal = 0;
          let items = 0;
          return (
            <div key={shopId} className={classes.grey}>
              <ListItem>
                <List>
                  <ListItem>
                    <Typography variant='h5'>{shopName}</Typography>
                  </ListItem>
                  <ListItem className={classes.nested}>
                    <div>
                      <Grid container>
                        {shopCartItems.map(cartItem => {
                          subTotal +=
                            cartItem.item.offeredPrice * cartItem.quantity;

                          items += cartItem.quantity;

                          const {
                            id: cartItemId,
                            item: {
                              id: shopProductId,
                              product: { title, thumb, mrp },
                              offeredPrice,
                              inStock,
                              shop: {
                                properties: { publicUsername }
                              }
                            },
                            quantity
                          } = cartItem;

                          const product_slug = slugGenerator(title);
                          return (
                            <>
                              <Grid
                                item
                                xs={3}
                                sm={3}
                                md={2}
                                className={classes.thumb}>
                                <ProductThumb
                                  src={thumb}
                                  alt={title}
                                  title={title}></ProductThumb>
                              </Grid>
                              <Grid item xs={9} sm={9} md={10}>
                                <div style={{ paddingLeft: 6 }}>
                                  <Typography variant='h6'>
                                    {title.substring(0, 60)}
                                    {title.length > 60 && '...'}
                                  </Typography>
                                  <Typography
                                    style={
                                      inStock
                                        ? { color: green[900] }
                                        : { color: 'red' }
                                    }
                                    // component={"p"}
                                    variant='subtitle2'>
                                    {inStock ? 'In stock' : 'Out of stock'}
                                  </Typography>
                                  <Grid container>
                                    <Grid item xs={4} md={4}>
                                      <Typography>
                                        Quantity: {quantity}
                                      </Typography>
                                    </Grid>
                                    <Grid item xs={4} md={4}></Grid>
                                    <Grid item xs={4}>
                                      <Typography
                                        variant='h6'
                                        style={{ color: green[800] }}>
                                        <Typography variant='caption'>
                                          <span
                                            style={{
                                              textDecoration: 'line-through'
                                            }}>
                                            &#x20b9;{mrp}
                                          </span>{' '}
                                        </Typography>
                                        &#x20b9;{offeredPrice}
                                      </Typography>
                                    </Grid>
                                  </Grid>
                                </div>
                              </Grid>
                            </>
                          );
                        })}
                      </Grid>
                      <Typography variant='h6'>
                        Amount to pay{' '}
                        <span style={{ color: 'green' }}>
                          &#x20b9; {subTotal}
                        </span>
                      </Typography>
                      <Typography variant='h6'>
                        Items to collect ({items} items)
                      </Typography>
                      <Typography variant='h6'>
                        Collect at{' '}
                        <a
                          href={`${process.env.GATSBY_G_MAP_URL}${lat},${lng}`}
                          target='_blank'
                          rel='noopener noreferrer'>
                          {address}
                        </a>
                      </Typography>
                    </div>
                  </ListItem>
                </List>
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
          onClick={checkoutCart}
          disabled={loading || data}
          className={classes.button}
          variant='contained'
          color='primary'>
          Place order
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

  const steps = ['Your details', 'Review your order'];

  return (
    <Layout>
      <Container maxWidth='md'>
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
            {data && data.cartItems && (
              <>
                {activeStep === steps.length ? (
                  <React.Fragment>
                    <Typography variant='h5' gutterBottom>
                      Thank you for your order.
                    </Typography>
                    <Typography variant='subtitle1'>
                      Your order number is #2001539. We have emailed your order
                      confirmation, and will send you an update when your order
                      has shipped.
                    </Typography>
                  </React.Fragment>
                ) : (
                  <Formik
                    initialValues={{
                      firstName: '',
                      lastName: '',
                      phone: ''
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
                    onSubmit={(values, { setSubmitting }) =>
                      handleNext() & setSubmitting(false)
                    }>
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
                                cartItems={data.cartItems}
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
          </React.Fragment>
        </Paper>
      </Container>
    </Layout>
  );
};

export default CheckoutFromCart;
