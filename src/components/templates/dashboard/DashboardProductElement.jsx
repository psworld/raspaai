import React from 'react';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

import Link from '../../core/Link';
import Button from '@material-ui/core/Button';

import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import { withStyles } from '@material-ui/core/styles';
import { green, red } from '@material-ui/core/colors';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

import { useMutation } from 'react-apollo';
import gql from 'graphql-tag';
import { SHOP_PRODUCTS } from '../../shop/ShopHomePage';
import GraphqlErrorMessage from '../../core/GraphqlErrorMessage';
import ProductThumb from '../ProductThumb';
import { slugGenerator, emptyPageInfo, newPageInfo } from '../../core/utils';

const MODIFY_SHOP_PRODUCT = gql`
  mutation(
    $productId: ID
    $shopProductId: ID
    $offeredPrice: Int
    $inStock: Boolean
    $withBrand: Boolean = false
    $withProduct: Boolean = true
    $action: String!
  ) {
    modifyShopProduct(
      input: {
        productId: $productId
        shopProductId: $shopProductId
        offeredPrice: $offeredPrice
        inStock: $inStock
        action: $action
      }
    ) {
      shopProduct {
        id
        product @include(if: $withProduct) {
          id
          title
          mrp
          description
          thumb
          brand @include(if: $withBrand) {
            id
            publicUsername
            title
          }
        }
        offeredPrice
        shop {
          id
          properties {
            title
            publicUsername
          }
        }
        inStock
      }
    }
  }
`;

const GreenCheckbox = withStyles({
  root: {
    color: green[400],
    '&$checked': {
      color: green[600]
    }
  },
  checked: {}
})(props => <Checkbox color='default' {...props} />);

const DashboardProductElement = props => {
  const {
    id,
    title,
    publicUsername,
    brandUsername,
    brandName,
    thumb,
    offeredPrice,
    mrp,
    isBrand = false,
    inStock,
    addShopProduct
  } = props;
  const [newOfferedPrice, setNewOfferedPrice] = React.useState(offeredPrice);
  const [newInStock, setNewInStock] = React.useState(inStock);
  const [showMutationResp, setShowMutationResp] = React.useState(true);

  const [modify, { loading, error, data }] = useMutation(MODIFY_SHOP_PRODUCT, {
    onCompleted() {
      setTimeout(() => {
        setShowMutationResp(false);
      }, 5000);
      setShowMutationResp(true);
    }
  });

  const validateChanges = () => {
    const intNewOfferedPrice = parseFloat(newOfferedPrice);
    if (
      !Number.isInteger(intNewOfferedPrice) ||
      (intNewOfferedPrice === offeredPrice && newInStock === inStock) ||
      intNewOfferedPrice > mrp
    ) {
      return false;
    } else {
      return true;
    }
  };

  const productSlug = slugGenerator(title);

  const shopProduct = `/shop/${publicUsername}/product/${productSlug}/${id}`;
  const brandProduct = `/brand/${brandUsername}/product/${productSlug}/${id}`;
  return (
    <Grid item xs={6} sm={4} md={3} lg={2}>
      <Box width='100%' px={1} my={2}>
        <Link to={isBrand || addShopProduct ? brandProduct : shopProduct}>
          <ProductThumb src={thumb} title={title} alt={title}></ProductThumb>
          <Typography variant='body2'>{title}</Typography>
        </Link>
        <Typography display='block' variant='caption' color='textSecondary'>
          <Link to={`/brand/${brandUsername}`}>
            By <span style={{ color: '#5050FF' }}>{brandName}</span>
          </Link>
        </Typography>
        {!isBrand && (
          <Typography variant='body2'>
            M.R.P{' '}
            <span
              style={{
                textDecorationLine: 'line-through',
                color: '#FA8072'
              }}>
              {' '}
              &#8377; {mrp}
            </span>
          </Typography>
        )}
        <Typography variant='body1' style={{ color: 'green' }}>
          {isBrand ? (
            <>M.R.P &#8377; {mrp}</>
          ) : (
            <>
              <TextField
                defaultValue={offeredPrice}
                onChange={e => setNewOfferedPrice(e.target.value)}
                placeholder={addShopProduct ? 'Offered Price' : offeredPrice}
                id='offeredPrice'
                name='offeredPrice'
                type='number'
                margin='dense'
                variant='outlined'
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start' style={{ color: 'green' }}>
                      &#8377;
                    </InputAdornment>
                  )
                }}
                InputLabelProps={{
                  shrink: true
                }}
              />
              {!addShopProduct && (
                <FormControlLabel
                  control={
                    <GreenCheckbox
                      checked={newInStock}
                      onChange={() => setNewInStock(!newInStock)}
                      value='In Stock'></GreenCheckbox>
                  }
                  label={
                    <span
                      style={{
                        color: newInStock ? green[500] : red[500]
                      }}>
                      {newInStock ? 'In stock' : 'Out of stock'}
                    </span>
                  }
                />
              )}
              <br></br>
              {newOfferedPrice > mrp && (
                <span style={{ color: 'red' }}>
                  Offered price can not be greater than M.R.P
                </span>
              )}
              {newOfferedPrice &&
                newOfferedPrice !== '' &&
                !Number.isInteger(parseFloat(newOfferedPrice)) && (
                  <span style={{ color: 'red' }}>Invalid Input</span>
                )}

              {error && (
                <GraphqlErrorMessage error={error}></GraphqlErrorMessage>
              )}
            </>
          )}
        </Typography>

        <Grid container>
          {!addShopProduct ? (
            <>
              <Grid item xs={6} sm={6} md={6}>
                {isBrand ? (
                  <Button color='primary'>Edit</Button>
                ) : (
                  <Button
                    onClick={() =>
                      validateChanges() &
                      modify({
                        variables: {
                          shopProductId: id,
                          offeredPrice: parseInt(newOfferedPrice),
                          action: 'modify',
                          inStock: newInStock
                        }
                      })
                    }
                    color='primary'
                    disabled={loading || !validateChanges()}>
                    {loading ? <>Saving</> : <>Save</>}
                  </Button>
                )}
              </Grid>
              <Grid item xs={6} sm={6} md={6}>
                <Button
                  disabled={loading}
                  onClick={() =>
                    modify({
                      variables: {
                        shopProductId: id,
                        withProduct: false,
                        withShop: false,
                        action: 'delete'
                      },
                      update(cache) {
                        const { shopProducts } = cache.readQuery({
                          query: SHOP_PRODUCTS,
                          variables: {
                            publicShopUsername: publicUsername,
                            withBrand: true
                          }
                        });

                        const newShopProductEdges = shopProducts.edges.filter(
                          e => e.node.id !== id
                        );
                        if (newShopProductEdges.length > 0) {
                          cache.writeQuery({
                            query: SHOP_PRODUCTS,
                            variables: {
                              publicShopUsername: publicUsername,
                              withBrand: true
                            },
                            data: {
                              shopProducts: {
                                ...shopProducts,
                                count: newShopProductEdges.length,
                                edges: newShopProductEdges
                              }
                            }
                          });
                        } else if (newShopProductEdges.length === 0) {
                          cache.writeQuery({
                            query: SHOP_PRODUCTS,
                            variables: {
                              publicShopUsername: publicUsername,
                              withBrand: true
                            },
                            data: {
                              shopProducts: {
                                ...shopProducts,
                                pageInfo: emptyPageInfo,
                                count: 0,
                                edges: []
                              }
                            }
                          });
                        }
                      }
                    })
                  }
                  color='secondary'>
                  Delete
                </Button>
              </Grid>
            </>
          ) : (
            <Grid item xs={12}>
              <Button
                variant='contained'
                disabled={loading || !validateChanges() || data}
                color='primary'
                onClick={() =>
                  validateChanges() &&
                  modify({
                    variables: {
                      productId: id,
                      offeredPrice: parseInt(newOfferedPrice),
                      action: 'add',
                      withBrand: true
                    },

                    update(
                      store,
                      {
                        data: {
                          modifyShopProduct: { shopProduct: newShopProduct }
                        }
                      }
                    ) {
                      let { shopProducts } = store.readQuery({
                        query: SHOP_PRODUCTS,
                        variables: {
                          publicShopUsername: publicUsername,
                          withBrand: true
                        }
                      });

                      if (shopProducts.edges.length === 0) {
                        // If the added product is the first product so we do not have
                        // previous edges i.e edges = []
                        store.writeQuery({
                          query: SHOP_PRODUCTS,
                          variables: {
                            publicShopUsername: publicUsername,
                            withBrand: true
                          },
                          data: {
                            shopProducts: {
                              pageInfo: newPageInfo,
                              count: 1,
                              shop: newShopProduct.shop,
                              edges: [
                                {
                                  node: newShopProduct,
                                  __typename: 'ShopProductNodeConnectionsEdge'
                                }
                              ],
                              __typename: 'ShopProductNodeConnectionsConnection'
                            }
                          }
                        });
                      } else {
                        const newEdges = shopProducts.edges.concat({
                          node: newShopProduct,
                          __typename: shopProducts.edges[0]['__typename']
                        });

                        store.writeQuery({
                          query: SHOP_PRODUCTS,
                          variables: {
                            publicShopUsername: publicUsername,
                            withBrand: true
                          },
                          data: {
                            shopProducts: {
                              ...shopProducts,
                              count: newEdges.length,
                              edges: newEdges
                            }
                          }
                        });
                      }
                    }
                  })
                }>
                Add to shop
              </Button>
            </Grid>
          )}
        </Grid>
        {showMutationResp && data && (
          <span style={{ color: 'green' }}>Saved successfully</span>
        )}
      </Box>
    </Grid>
  );
};

export default DashboardProductElement;
