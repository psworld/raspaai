import React from "react"

import Grid from "@material-ui/core/Grid"

import ListItem from "@material-ui/core/ListItem"
import Typography from "@material-ui/core/Typography"
import Divider from "@material-ui/core/Divider"
import ListItemText from "@material-ui/core/ListItemText"

import Link from "../../core/Link"
import ProductImageCarousel from "./ProductImageCarousel"
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TextField,
} from "@material-ui/core"

const ProductDetails = props => {
  const {
    product,
    shopProduct,
    brandPublicUsername,
    shopPublicUsername,
    isShopProduct = false,
  } = props

  const { offeredPrice, inStock } = isShopProduct && shopProduct

  const {
    title: productTitle,
    mrp,
    description,
    images: { edges: imagesNodeList },
    category: { name: categoryName },
    type: { name: typeName },
    longDescription,
    isAvailable,
    technicalDetails: technicalDetailsJsonString,
  } = product

  const technicalDetails = JSON.parse(technicalDetailsJsonString)

  return (
    <>
      <Grid container>
        <Grid item xs={12} sm={6} md={4}>
          <ProductImageCarousel
            imagesNodeList={imagesNodeList}
            alt={productTitle}
          ></ProductImageCarousel>
        </Grid>
        <Grid
          item
          style={{ paddingLeft: 8, paddingRight: 8 }}
          xs={12}
          sm={6}
          md={6}
        >
          <ListItem style={{ paddingBottom: 1 }}>
            <Typography variant={"h5"}>{productTitle}</Typography>
          </ListItem>
          <ListItem style={{ marginTop: 0 }}>
            By&ensp;
            <Typography color="primary" variant="body2">
              <Link to={`/brand/${brandPublicUsername}`}>
                {brandPublicUsername}
              </Link>
            </Typography>
            {isShopProduct && (
              <>
                &ensp;Sold By&ensp;
                <Typography color="primary" variant="body2">
                  <Link to={`/shop/${shopPublicUsername}`}>
                    {shopPublicUsername}
                  </Link>
                </Typography>
              </>
            )}
          </ListItem>
          <ListItem>
            in category:{categoryName} type:{typeName}
          </ListItem>

          <Divider />
          <ListItem style={{ paddingBottom: 0 }}>
            &ensp;&ensp;&ensp;&ensp;&ensp;&ensp;
            <Typography variant="body2">
              M.R.P:{" "}
              <span
                style={
                  isShopProduct
                    ? {
                        textDecorationLine: "line-through",
                        color: "#FA8072",
                      }
                    : { color: "#FA8072" }
                }
              >
                &#x20b9; {mrp}
              </span>
            </Typography>
          </ListItem>
          {isShopProduct && (
            <>
              <ListItem style={{ marginTop: 0, marginBottom: 0 }}>
                <Typography variant="body2">
                  Offered Price:{" "}
                  <span style={{ color: "green", fontSize: "x-large" }}>
                    {" "}
                    &#x20b9; {offeredPrice}
                  </span>
                </Typography>
              </ListItem>
              <ListItem style={{ paddingTop: 0 }}>
                &ensp;&ensp;&ensp;&ensp;
                <Typography variant="body2">
                  You Save:{" "}
                  <span style={{ color: "#4169E1" }}>
                    &#x20b9; {mrp - offeredPrice} (
                    {Math.round(((mrp - offeredPrice) / mrp) * 100)}%)
                  </span>
                </Typography>
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText
                  style={{ color: inStock ? "green" : "red" }}
                  primary={"In stock"}
                />
              </ListItem>
            </>
          )}
          <Divider />
          <ListItem>
            <Typography>{description}</Typography>
          </ListItem>
          <ListItem>
            <Typography>{longDescription}</Typography>
          </ListItem>

          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Property</TableCell>
                <TableCell>Value</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell component="th" scope="row">
                  title
                </TableCell>
                <TableCell>{productTitle}</TableCell>
              </TableRow>
              {Object.keys(technicalDetails).map((key, index) => {
                const value = technicalDetails[key]

                return (
                  <TableRow key={index}>
                    <TableCell component="th" scope="row">
                      {key}
                    </TableCell>
                    <TableCell>{value}</TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </Grid>
        <Grid
          style={{ paddingLeft: 8, paddingRight: 8 }}
          item
          xs={12}
          sm={12}
          md={2}
        >
          <h1>Buy now</h1>
        </Grid>
      </Grid>
    </>
  )
}

export default ProductDetails
