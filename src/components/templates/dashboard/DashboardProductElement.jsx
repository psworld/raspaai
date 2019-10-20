import React from "react"

import Grid from "@material-ui/core/Grid"
import Typography from "@material-ui/core/Typography"
import Box from "@material-ui/core/Box"

import slugGenerator from "../../core/slugGenerator"
import Link from "../../core/Link"
import Button from "@material-ui/core/Button"

import TextField from "@material-ui/core/TextField"
import InputAdornment from "@material-ui/core/InputAdornment"
import { withStyles } from "@material-ui/core/styles"
import { green, red } from "@material-ui/core/colors"
import FormControlLabel from "@material-ui/core/FormControlLabel"
import Checkbox from "@material-ui/core/Checkbox"

import { useMutation } from "react-apollo"
import gql from "graphql-tag"
import { SHOP_PRODUCTS } from "../../shop/ShopHomePage"

const MODIFY_SHOP_PRODUCT = gql`
  mutation(
    $productId: ID
    $shopProductId: ID
    $offeredPrice: Int
    $inStock: Boolean
    $withBrand: Boolean = false
    $withProduct: Boolean = true
    $withShop: Boolean = true
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
          title
          mrp
          description
          brand @include(if: $withBrand) {
            publicUsername
            title
          }
        }
        offeredPrice
        shop @include(if: $withShop) {
          properties {
            publicUsername
          }
        }
        inStock
      }
    }
  }
`

const GreenCheckbox = withStyles({
  root: {
    color: green[400],
    "&$checked": {
      color: green[600],
    },
  },
  checked: {},
})(props => <Checkbox color="default" {...props} />)

const DashboardProductElement = props => {
  const {
    id,
    title,
    publicUsername,
    brandUsername,
    thumb,
    offeredPrice,
    mrp,
    isBrand = false,
    inStock,
    addShopProduct,
  } = props
  const [newOfferedPrice, setNewOfferedPrice] = React.useState(offeredPrice)
  const [newInStock, setNewInStock] = React.useState(inStock)
  const [showMutationResp, setShowMutationResp] = React.useState(true)

  const [modify, { loading, error, data }] = useMutation(MODIFY_SHOP_PRODUCT, {
    onCompleted() {
      setTimeout(() => {
        setShowMutationResp(false)
      }, 5000)
      setShowMutationResp(true)
    },
  })

  const validateChanges = () => {
    const intNewOfferedPrice = parseFloat(newOfferedPrice)
    if (
      !Number.isInteger(intNewOfferedPrice) ||
      (intNewOfferedPrice === offeredPrice && newInStock === inStock) ||
      intNewOfferedPrice > mrp
    ) {
      return false
    } else {
      return true
    }
  }

  const productSlug = slugGenerator(title)

  const shopProduct = `/shop/${publicUsername}/product/${productSlug}/${id}`
  const brandProduct = `/brand/${brandUsername}/product/${productSlug}/${id}`
  return (
    <Grid item xs={6} sm={4} md={3} lg={2}>
      <Box width="100%" px={1} my={2}>
        <Link to={isBrand || addShopProduct ? brandProduct : shopProduct}>
          <img
            style={{ height: "80%", width: "100%" }}
            alt={title}
            src={`http://localhost:8000/media/${thumb}`}
          />
          <Typography variant="body2">{title.substring(0, 30)}</Typography>
        </Link>
        <Typography display="block" variant="caption" color="textSecondary">
          <Link to={`/brand/${brandUsername}`}>
            By <span style={{ color: "#5050FF" }}>{brandUsername}</span>
          </Link>
        </Typography>
        {!isBrand && (
          <Typography variant="body2">
            M.R.P{" "}
            <span
              style={{
                textDecorationLine: "line-through",
                color: "#FA8072",
              }}
            >
              {" "}
              &#8377; {mrp}
            </span>
          </Typography>
        )}
        <Typography variant="body1" style={{ color: "green" }}>
          {isBrand ? (
            <>M.R.P &#8377; {mrp}</>
          ) : (
            <>
              <TextField
                defaultValue={offeredPrice}
                onChange={e => setNewOfferedPrice(e.target.value)}
                placeholder={addShopProduct ? "Offered Price" : offeredPrice}
                id="offeredPrice"
                name="offeredPrice"
                type="number"
                margin="dense"
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start" style={{ color: "green" }}>
                      &#8377;
                    </InputAdornment>
                  ),
                }}
                InputLabelProps={{
                  shrink: true,
                }}
              />
              {!addShopProduct && (
                <FormControlLabel
                  control={
                    <GreenCheckbox
                      checked={newInStock}
                      onChange={() => setNewInStock(!newInStock)}
                      value="In Stock"
                    ></GreenCheckbox>
                  }
                  label={
                    <span
                      style={{
                        color: newInStock ? green[500] : red[500],
                      }}
                    >
                      {newInStock ? "In stock" : "Out of stock"}
                    </span>
                  }
                />
              )}
              <br></br>
              {newOfferedPrice > mrp && (
                <span style={{ color: "red" }}>
                  Offered price can not be greater than M.R.P
                </span>
              )}
              {newOfferedPrice &&
                newOfferedPrice !== "" &&
                !Number.isInteger(parseFloat(newOfferedPrice)) && (
                  <span style={{ color: "red" }}>Invalid Input</span>
                )}

              {error && <>{error.message}</>}
            </>
          )}
        </Typography>

        <Grid container>
          {!addShopProduct ? (
            <>
              <Grid item xs={6} sm={6} md={6}>
                {isBrand ? (
                  <Button color="primary">Edit</Button>
                ) : (
                  <Button
                    onClick={() =>
                      validateChanges() &
                      modify({
                        variables: {
                          shopProductId: id,
                          offeredPrice: parseInt(newOfferedPrice),
                          action: "modify",
                          inStock: newInStock,
                        },
                      })
                    }
                    color="primary"
                    disabled={loading || !validateChanges()}
                  >
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
                        action: "delete",
                      },
                      // update(cache) {
                      //   const { shopProducts } = cache.readQuery({
                      //     query: SHOP_PRODUCTS,
                      //     variables: {
                      //       publicShopUsername: publicUsername,
                      //       endCursor: null,
                      //       withBrand: false,
                      //     },
                      //   })
                      //   const updatedShopProducts = shopProducts.edges.filter(
                      //     e => e.node.id !== id
                      //   )
                      //   shopProducts.edges = updatedShopProducts
                      //   cache.writeQuery({
                      //     query: SHOP_PRODUCTS,
                      //     variables: {
                      //       publicShopUsername: publicUsername,
                      //       endCursor: null,
                      //       withBrand: false,
                      //     },
                      //     data: shopProducts,
                      //   })
                      //   console.log(shopProducts)
                      // },

                      // refetchQueries: [
                      //   {
                      //     query: SHOP_PRODUCTS,
                      //     variables: {
                      //       publicShopUsername: publicUsername,
                      //       endCursor: null,
                      //       withBrand: false,
                      //     },
                      //   },
                      // ],
                    })
                  }
                  color="secondary"
                >
                  Delete
                </Button>
              </Grid>
            </>
          ) : (
            <Grid item xs={12}>
              <Button
                variant="contained"
                disabled={loading || !validateChanges() || data}
                color="primary"
                onClick={() =>
                  validateChanges() &&
                  modify({
                    variables: {
                      productId: id,
                      offeredPrice: parseInt(newOfferedPrice),
                      action: "add",
                      withBrand: true,
                    },
                    refetchQueries: [
                      {
                        query: SHOP_PRODUCTS,
                        variables: {
                          publicShopUsername: publicUsername,
                          endCursor: null,
                          withBrand: false,
                        },
                      },
                    ],
                  })
                }
              >
                Add to shop
              </Button>
            </Grid>
          )}
        </Grid>
        {showMutationResp && data && (
          <span style={{ color: "green" }}>Saved successfully</span>
        )}
        {error && (
          <span style={{ color: "red" }}>An error occurred. Try again</span>
        )}
      </Box>
    </Grid>
  )
}

export default DashboardProductElement
