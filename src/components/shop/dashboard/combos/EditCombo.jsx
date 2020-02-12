import {
  Button,
  Grid,
  ListItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { gql } from 'apollo-boost';
import { Form, Formik } from 'formik';
import { CheckboxWithLabel, TextField } from 'formik-material-ui';
import React from 'react';
import { useMutation, useQuery } from 'react-apollo';
import * as yup from 'yup';
import ErrorPage from '../../../core/ErrorPage';
import GraphqlErrorMessage from '../../../core/GraphqlErrorMessage';
import Link from '../../../core/Link';
import Loading from '../../../core/Loading';
import { slugGenerator, updatedDiff } from '../../../core/utils';
import ProductCollage from '../../../templates/dashboard/ProductCollage';

const COMBO = gql`
  query($comboId: ID!) {
    combo(id: $comboId) {
      id
      offeredPrice
      maxOfferedPrice
      totalCost
      name
      thumbs
      description
      isAvailable
      products {
        edges {
          node {
            id
            quantity
            shopProduct {
              id
              offeredPrice
              inStock
              product {
                id
                title
                mrp
                thumb
                thumbOverlayText
              }
            }
          }
        }
      }
    }
  }
`;

const EDIT_COMBO = gql`
  mutation($data: EditComboInput!) {
    editCombo(input: $data) {
      combo {
        id
        offeredPrice
        totalCost
        maxOfferedPrice
        name
        description
        isAvailable
      }
    }
  }
`;

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%'
  },
  paper: {
    width: '100%',
    overflowX: 'auto',
    marginBottom: theme.spacing(2)
  },
  table: {
    minWidth: 100
  }
}));

const EditCombo = ({ comboId, shopUsername }) => {
  const classes = useStyles();

  const { loading, error, data } = useQuery(COMBO, {
    variables: { comboId }
  });
  const [saveChanges, mutation] = useMutation(EDIT_COMBO);

  let formikProps = null;

  if (loading) return <Loading></Loading>;
  if (error) {
    return <ErrorPage></ErrorPage>;
  }
  if (data && data.combo) {
    const {
      name,
      description,
      offeredPrice,
      maxOfferedPrice,
      thumbs,
      isAvailable,
      products,
      totalCost
    } = data.combo;

    return (
      <Grid container>
        <Grid item xs={12} sm={4} md={4}>
          <ProductCollage thumbs={thumbs} title={name}></ProductCollage>
        </Grid>

        <Formik
          initialValues={{
            comboName: name,
            offeredPrice,
            description,
            isAvailable
          }}
          validationSchema={yup.object().shape({
            comboName: yup
              .string()
              .min(10, 'Combo name is too small')
              .max(200, 'Too large combo name')
              .required('Required!'),

            offeredPrice: yup
              .number('Invalid price')
              .integer('No decimal places')
              .positive('Invalid price')
              .min(1, 'Offered price can not be zero or less than zero')
              .required('Required!')
              .max(maxOfferedPrice - 1, `Less than ${maxOfferedPrice}`),
            description: yup
              .string()
              .min(20, 'Too small description')
              .max(255, 'Too large for a short description')
              .required('Required!'),
            isAvailable: yup.boolean().required('A value is required')
          })}
          onSubmit={(values, { setSubmitting }) => {
            const initialValues = formikProps.initialValues;
            const dirty = formikProps.dirty;
            const changedValues = updatedDiff(initialValues, values);
            if (dirty) {
              saveChanges({
                variables: {
                  data: {
                    comboId,
                    ...changedValues
                  }
                }
              });
            }
            setSubmitting(false);
          }}>
          {props => {
            formikProps = props;
            const { isSubmitting, handleSubmit, initialValues, dirty } = props;
            return (
              <Grid
                item
                style={{ paddingLeft: 8, paddingRight: 8 }}
                xs={12}
                sm={8}
                md={8}>
                <Form>
                  <ListItem>
                    <TextField
                      name='comboName'
                      label='Combo name'
                      placeholder={initialValues.comboName}
                      fullWidth></TextField>
                  </ListItem>
                  <ListItem>
                    <TextField
                      name='description'
                      label='Short combo description'
                      placeholder={initialValues.description}
                      fullWidth></TextField>
                  </ListItem>

                  <ListItem>
                    <Typography variant='h6'>Products included</Typography>
                  </ListItem>
                  <ListItem>
                    <div className={classes.root}>
                      <Paper className={classes.paper}>
                        <Table
                          className={classes.table}
                          size='small'
                          aria-label='a dense table'>
                          <TableHead>
                            <TableRow>
                              <TableCell>Name</TableCell>
                              <TableCell align='right'>MRP</TableCell>
                              <TableCell align='right'>Offered price</TableCell>
                              <TableCell align='right'>Qty</TableCell>
                              <TableCell align='right'>Sub total</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {products.edges.map(comboProduct => {
                              const comboProductNode = comboProduct.node;
                              const shopProduct = comboProductNode.shopProduct;
                              const product = shopProduct.product;

                              const mrp = product.mrp
                                ? product.mrp
                                : shopProduct.offeredPrice;
                              const offeredPrice = shopProduct.offeredPrice;
                              const qty = comboProductNode.quantity;

                              const subTotal = offeredPrice * qty;

                              const productSlug = slugGenerator(product.title);
                              return (
                                <TableRow key={comboProduct.node.id}>
                                  <TableCell component='th' scope='row'>
                                    <Link
                                      to={`/shop/${shopUsername}/product/${productSlug}/${shopProduct.id}`}>
                                      {product.title}
                                    </Link>
                                  </TableCell>
                                  <TableCell align='right'>{mrp}</TableCell>
                                  <TableCell align='right'>
                                    {offeredPrice}
                                  </TableCell>
                                  <TableCell align='right'>{qty}</TableCell>
                                  <TableCell align='right'>
                                    {subTotal}
                                  </TableCell>
                                </TableRow>
                              );
                            })}
                            <TableRow>
                              <TableCell
                                style={{ paddingTop: '20px' }}
                                component='th'
                                scope='row'>
                                <b>Total (qty included)</b>
                              </TableCell>
                              <TableCell align='right'>
                                <b>{totalCost}</b>
                              </TableCell>
                              <TableCell align='right'>
                                <b>{maxOfferedPrice}</b>
                              </TableCell>
                              {/* <TableCell align='right'>
                                <b>{totalQuantity}</b>
                              </TableCell> */}
                            </TableRow>
                          </TableBody>
                        </Table>
                      </Paper>
                    </div>
                  </ListItem>

                  <ListItem>
                    <Typography>
                      Combo offered price must be less than Rs.{' '}
                      {maxOfferedPrice}
                    </Typography>
                  </ListItem>
                  <ListItem>
                    <TextField
                      name='offeredPrice'
                      label='Combo offered price'
                      placeholder={`${initialValues.offeredPrice}`}
                      type='number'
                      typeof='number'></TextField>
                  </ListItem>

                  <ListItem>
                    <CheckboxWithLabel
                      name='isAvailable'
                      Label={{
                        label: 'Is available'
                      }}></CheckboxWithLabel>
                  </ListItem>

                  <ListItem>
                    <Button
                      variant='outlined'
                      color='primary'
                      disabled={
                        isSubmitting ||
                        mutation.loading ||
                        mutation.data ||
                        !dirty
                      }
                      onClick={handleSubmit}>
                      Save
                    </Button>
                  </ListItem>
                  {mutation.data && (
                    <p style={{ color: 'green' }}>Changes saved successfully</p>
                  )}
                  {mutation.error && (
                    <GraphqlErrorMessage
                      error={mutation.error}
                      critical></GraphqlErrorMessage>
                  )}
                </Form>
              </Grid>
            );
          }}
        </Formik>
      </Grid>
    );
  }
  return (
    <Typography variant='h5' align='center' style={{ marginTop: '10vh' }}>
      Sorry, combo not found.
    </Typography>
  );
};

export default EditCombo;
