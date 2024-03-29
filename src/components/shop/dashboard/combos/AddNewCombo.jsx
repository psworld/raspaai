import {
  Box,
  Button,
  Grid,
  InputAdornment,
  List,
  ListItem,
  TextField,
  Typography
} from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { gql } from 'apollo-boost';
import { Formik } from 'formik';
import React from 'react';
import { useMutation, useQuery } from 'react-apollo';
import * as yup from 'yup';
import ErrorPage from '../../../core/ErrorPage';
import GraphqlErrorMessage from '../../../core/GraphqlErrorMessage';
import Link from '../../../core/Link';
import { newPageInfo, slugGenerator } from '../../../core/utils';
import SEO from '../../../seo';
import ProductGridSkeleton from '../../../skeletons/ProductGridSkeleton';
import ProductCollage from '../../../templates/dashboard/ProductCollage';
import PaginationWithState from '../../../templates/PaginationWithState';
import ProductThumb from '../../../templates/ProductThumb';
import { SHOP_PRODUCTS } from '../../ShopHomePage';
import { SHOP_COMBOS } from './MyCombos';

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

const CREATE_COMBO = gql`
  mutation($data: CreateComboInput!) {
    createCombo(input: $data) {
      combo {
        id
        name
        offeredPrice
        thumbs
        isAvailable
      }
    }
  }
`;

const ComboProduct = ({
  shopProductObj,
  handleComboProductSelect,
  selectedShopProducts,
  shop
}) => {
  const {
    id,
    offeredPrice,
    product: {
      thumb,
      thumbOverlayText,
      mrp,
      title,
      brand: { publicUsername: brandUsername, title: brandName }
    }
  } = shopProductObj.node;

  const {
    properties: { publicUsername }
  } = shop;

  const productSlug = slugGenerator(title);
  const shopProduct = `/shop/${publicUsername}/product/${productSlug}/${id}`;

  const isSelected = selectedShopProducts[id];

  return (
    <Grid item xs={6} sm={4} md={3} lg={2}>
      <Formik
        initialValues={{ quantity: 1 }}
        validationSchema={yup.object().shape({
          quantity: yup
            .number('Invalid quantity')
            .min(1, 'Quantity must not be less than 1')
            .max(10, 'Quantity should not be larger than 10')
            .required('Quantity is required')
        })}
        onSubmit={(values, { setSubmitting }) => {
          setSubmitting(false);
          const combObj = {
            name: title,
            thumb,
            thumbOverlayText,
            mrp,
            offeredPrice,
            quantity: values.quantity
          };
          handleComboProductSelect(id, combObj);
        }}>
        {formik => {
          const {
            values,
            touched,
            errors,
            isSubmitting,
            handleChange,
            handleBlur,
            handleSubmit
          } = formik;
          const { quantity } = values;

          function hasError(id, bool) {
            if (touched[id] && errors[id]) {
              return bool ? true : errors[id];
            } else {
              return false;
            }
          }

          return (
            <Box width='100%' px={1} my={2}>
              <Link to={shopProduct}>
                <ProductThumb
                  src={thumb}
                  title={title}
                  thumbOverlayText={thumbOverlayText}
                  quantity={quantity}></ProductThumb>
                <Typography variant='body2'>{title}</Typography>
              </Link>

              <Typography
                display='block'
                variant='caption'
                color='textSecondary'>
                <Link to={`/brand/${brandUsername}`}>
                  By <span style={{ color: '#5050FF' }}>{brandName}</span>
                </Link>
              </Typography>

              <Typography variant='body1' style={{ color: 'green' }}>
                &#8377; {offeredPrice}
              </Typography>
              <TextField
                value={quantity}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder='Quantity'
                id='quantity'
                label={hasError('quantity', true) ? hasError('quantity') : ''}
                error={hasError('quantity', true)}
                name='quantity'
                type='number'
                margin='dense'
                variant='outlined'
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start'>Qty: </InputAdornment>
                  )
                }}
                InputLabelProps={{
                  shrink: true
                }}
              />

              <Button
                color={isSelected ? 'primary' : 'default'}
                disabled={isSubmitting}
                onClick={handleSubmit}
                variant='contained'>
                {isSelected ? 'Selected' : 'Select'}
              </Button>
            </Box>
          );
        }}
      </Formik>
    </Grid>
  );
};

const AddNewCombo = ({
  shopUsername,
  phrase,
  handleNext,
  handleComboProductSelect,
  selectedShopProducts
}) => {
  const { loading, error, data, fetchMore } = useQuery(SHOP_PRODUCTS, {
    variables: {
      publicShopUsername: shopUsername,
      phrase,
      withBrand: true
    }
  });

  if (loading) return <ProductGridSkeleton></ProductGridSkeleton>;
  if (error) return <ErrorPage></ErrorPage>;
  if (data && data.shopProducts && data.shopProducts.count < 2) {
    return (
      <>
        <Typography variant='h5' style={{ marginTop: 20 }} align='center'>
          Two or more products are required to create a combo.
        </Typography>
        <Typography variant='h5' align='center'>
          Add more products to your shop for creating a combo.
        </Typography>
        <br></br>
        <center>
          <Typography
            variant='h5'
            component={Link}
            to={`/dashboard/shop/${shopUsername}/products/add`}>
            Add Products
          </Typography>
        </center>
      </>
    );
  }
  if (data && data.shopProducts.pageInfo.startCursor) {
    const { edges: shopProducts, pageInfo, shop } = data.shopProducts;
    return (
      <>
        <SEO title='Create combo'></SEO>
        <br></br>
        <center>
          <Typography algin='center' variant='h5'>
            Create product combos for your shop.
          </Typography>
          <br></br>
          <Button
            disabled={Object.keys(selectedShopProducts).length < 2}
            onClick={handleNext}
            variant='contained'
            color='primary'>
            Continue
          </Button>
        </center>
        <br></br>
        <br></br>
        <Grid container>
          {shopProducts.map(shopProductObj => {
            const { id } = shopProductObj.node;
            return (
              <ComboProduct
                key={id}
                selectedShopProducts={selectedShopProducts}
                handleComboProductSelect={handleComboProductSelect}
                shopProductObj={shopProductObj}
                shop={shop}></ComboProduct>
            );
          })}
        </Grid>

        <br></br>
        <PaginationWithState
          fetchMore={fetchMore}
          pageInfo={pageInfo}></PaginationWithState>
      </>
    );
  }

  if (phrase) {
    return (
      <Typography align='center' style={{ margin: 4 }} variant='h5'>
        No results found for - <b>{phrase}</b>
      </Typography>
    );
  }
};

const ReviewComboSelection = ({
  shopUsername,
  handleBack,
  selectedShopProducts
}) => {
  const classes = useStyles();

  const [createCombo, { loading, error, data, called }] = useMutation(
    CREATE_COMBO,
    {
      update(
        cache,
        {
          data: {
            createCombo: { combo }
          }
        }
      ) {
        try {
          const { shopCombos } = cache.readQuery({
            query: SHOP_COMBOS,
            variables: { shopUsername: shopUsername }
          });

          if (shopCombos.count === 0) {
            // it's the first combo being added after SHOP_COMBOS query has
            // been cached
            cache.writeQuery({
              query: SHOP_COMBOS,
              variables: { shopUsername: shopUsername },
              data: {
                shopCombos: {
                  ...shopCombos,
                  pageInfo: newPageInfo,
                  count: 1,
                  edges: [
                    { node: combo, __typename: 'ComboNodeConnectionsEdge' }
                  ]
                }
              }
            });
          } else {
            cache.writeQuery({
              query: SHOP_COMBOS,
              variables: { shopUsername },
              data: {
                shopCombos: {
                  ...shopCombos,
                  count: shopCombos.count + 1,
                  edges: shopCombos.edges.concat({
                    node: { ...combo },
                    __typename: shopCombos.edges[0]['__typename']
                  })
                }
              }
            });
          }
        } catch {
          // query SHOP_COMBOS has not been executed yet.
        }
      }
    }
  );

  let comboProducts = {};

  Object.keys(selectedShopProducts).forEach(shopProductId => {
    const comboProduct = selectedShopProducts[shopProductId];
    comboProducts[shopProductId] = { quantity: comboProduct.quantity };
  });

  const createComboInput = { comboProducts: JSON.stringify(comboProducts) };

  return (
    <Grid container>
      <Grid item md={2} xs={12} sm={6}>
        <ProductCollage
          selectedShopProducts={selectedShopProducts}
          inDashboardAddCombo={true}></ProductCollage>
      </Grid>
      <Formik
        initialValues={{
          comboName: '',
          offeredPrice: '',
          description: ''
        }}
        validationSchema={yup.object().shape({
          comboName: yup
            .string()
            .min(10, 'Combo name is too small')
            .max(200, 'Too large combo name')
            .required('Combo name is required'),
          offeredPrice: yup
            .number('Invalid price')
            .positive('Invalid price')
            .required('Combo price is required'),
          description: yup
            .string()
            .min(20, 'Too small description')
            .max(255, 'Too large for a short description')
            .required('Short description about the combo required')
        })}
        onSubmit={(values, { setSubmitting }) => {
          createCombo({
            variables: { data: { ...createComboInput, ...values } }
          });
          setSubmitting(false);
        }}>
        {props => {
          const {
            values,
            touched,
            errors,
            isSubmitting,
            handleChange,
            handleBlur,
            handleSubmit
          } = props;
          const { comboName, offeredPrice, description } = values;

          function hasError(id, bool) {
            if (touched[id] && errors[id]) {
              return bool ? true : errors[id];
            } else {
              return false;
            }
          }

          let totalMrp = 0;
          let totalOfferedPrice = 0;
          let totalQuantity = 0;

          return (
            <>
              <Grid item md={8} xs={12} sm={6}>
                <List>
                  <ListItem>
                    <TextField
                      id='comboName'
                      name='comboName'
                      label={
                        hasError('comboName', true)
                          ? hasError('comboName')
                          : 'Combo Name'
                      }
                      value={comboName}
                      fullWidth
                      error={hasError('comboName', true)}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      margin='normal'
                      variant='outlined'
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position='start'>
                            Combo
                          </InputAdornment>
                        )
                      }}
                    />
                  </ListItem>
                  <ListItem>
                    <Typography variant='h6'>Selected products</Typography>
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
                              {/* <TableCell align='right'>
                                Protein&nbsp;(g)
                              </TableCell> */}
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {Object.keys(selectedShopProducts).map(key => {
                              const shopProduct = selectedShopProducts[key];
                              const {
                                name,
                                mrp,
                                offeredPrice,
                                quantity
                              } = shopProduct;

                              totalMrp += mrp
                                ? mrp * quantity
                                : offeredPrice * quantity;
                              totalOfferedPrice += offeredPrice * quantity;
                              totalQuantity += quantity;
                              const subTotal = offeredPrice * quantity;
                              return (
                                <TableRow key={key}>
                                  <TableCell component='th' scope='row'>
                                    {name}
                                  </TableCell>
                                  <TableCell align='right'>
                                    {mrp ? mrp : offeredPrice}
                                  </TableCell>
                                  <TableCell align='right'>
                                    {offeredPrice}
                                  </TableCell>
                                  <TableCell align='right'>
                                    {quantity}
                                  </TableCell>
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
                                <b>{totalMrp}</b>
                              </TableCell>
                              <TableCell align='right'>
                                <b>{totalOfferedPrice}</b>
                              </TableCell>
                              <TableCell align='right'>
                                <b>{totalQuantity}</b>
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </Paper>
                    </div>
                  </ListItem>
                  <ListItem>
                    <Typography>
                      Combo offered price must be less than Rs.{' '}
                      {totalOfferedPrice}
                    </Typography>
                  </ListItem>
                  <ListItem>
                    <br></br>
                    <TextField
                      value={offeredPrice}
                      onChange={handleChange('offeredPrice')}
                      placeholder='Offered price'
                      id='offeredPrice'
                      label={
                        hasError('offeredPrice', true)
                          ? hasError('offeredPrice')
                          : ''
                      }
                      helperText={
                        offeredPrice > totalOfferedPrice - 1
                          ? `Offered price of a combo must be less than the total offered price of all selected products with respective quantities`
                          : ''
                      }
                      error={
                        hasError('offeredPrice', true) ||
                        offeredPrice > totalOfferedPrice - 1
                      }
                      name='offeredPrice'
                      type='number'
                      margin='dense'
                      variant='outlined'
                      InputProps={{
                        startAdornment: (
                          <InputAdornment
                            position='start'
                            style={{ color: 'green' }}>
                            &#8377;
                          </InputAdornment>
                        )
                      }}
                      InputLabelProps={{
                        shrink: true
                      }}
                    />
                  </ListItem>

                  <ListItem>
                    <TextField
                      id='description'
                      name='description'
                      value={description}
                      label={
                        hasError('description', true)
                          ? hasError('description')
                          : `Short description of combo.`
                      }
                      error={hasError('description', true)}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder='Short Description'
                      multiline
                      fullWidth></TextField>
                  </ListItem>
                </List>
              </Grid>
              <Grid item md={2} xs={12} sm={6}>
                <Button
                  variant='contained'
                  color='primary'
                  onClick={handleSubmit}
                  disabled={isSubmitting || loading || data}>
                  Create combo
                </Button>
                {error && (
                  <GraphqlErrorMessage
                    critical
                    error={error}></GraphqlErrorMessage>
                )}
                {data && (
                  <>
                    <Typography style={{ color: 'green' }}>
                      Combo has been successfully created
                    </Typography>
                    <Link to={`/dashboard/shop/${shopUsername}/combos`}>
                      Click here to see
                    </Link>
                  </>
                )}
                <br></br>
                <br></br>
                <Button
                  variant='contained'
                  onClick={handleBack}
                  disabled={isSubmitting || loading}>
                  Back
                </Button>
              </Grid>
            </>
          );
        }}
      </Formik>
    </Grid>
  );
};

const AddNewComboHOC = ({ shopUsername, phrase }) => {
  const [step, setStep] = React.useState(1);
  const [selectedShopProducts, setSelectedShopProducts] = React.useState({});

  const handleComboProductSelect = (shopProductId, comboObj) => {
    if (selectedShopProducts[shopProductId]) {
      // Item is already selected. Delete the item
      let newSelectedShopProducts = selectedShopProducts;
      delete newSelectedShopProducts[shopProductId];
      setSelectedShopProducts({ ...newSelectedShopProducts });
    } else {
      setSelectedShopProducts({
        ...selectedShopProducts,
        [shopProductId]: comboObj
      });
    }
  };

  const handleNext = () => {
    setStep(step + 1);
  };
  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  switch (step) {
    case 1:
      return (
        <AddNewCombo
          handleNext={handleNext}
          handleComboProductSelect={handleComboProductSelect}
          selectedShopProducts={selectedShopProducts}
          shopUsername={shopUsername}
          phrase={phrase}></AddNewCombo>
      );
    case 2:
      return (
        <ReviewComboSelection
          shopUsername={shopUsername}
          handleBack={handleBack}
          selectedShopProducts={selectedShopProducts}></ReviewComboSelection>
      );

    default:
      break;
  }
};

export default AddNewComboHOC;
