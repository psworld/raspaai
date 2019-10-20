import React from "react"

import Grid from "@material-ui/core/Grid"
import Typography from "@material-ui/core/Typography"
import Box from "@material-ui/core/Box"

import slugGenerator from "../core/slugGenerator"
import Link from "../core/Link"
import { Button } from "@material-ui/core"

const ProductElement = ({
  id,
  title,
  thumb,
  publicUsername,
  offeredPrice,
  mrp,
  isBrand,
  isBrandDashboardProduct = false,
}) => {
  const productSlug = slugGenerator(title)

  const shopProduct = `/shop/${publicUsername}/product/${productSlug}/${id}`
  const brandProduct = `/brand/${publicUsername}/product/${productSlug}/${id}`

  return (
    <Grid item xs={6} sm={4} md={3} lg={2}>
      <Box width={"100%"} px={1} my={2}>
        <Link to={isBrand ? brandProduct : shopProduct}>
          <img
            style={{ height: "80%", width: "100%" }}
            alt={title}
            src={`http://localhost:8000/media/${thumb}`}
          />
          <Typography variant="body2" color="textPrimary">
            {title.substring(0, 30)}
          </Typography>
        </Link>
        <Typography display="block" variant="caption" color="primary">
          <Link
            to={
              isBrand ? `/brand/${publicUsername}` : `/shop/${publicUsername}`
            }
          >
            {publicUsername}
          </Link>
        </Typography>
        <Typography variant="body1" style={{ color: "green" }}>
          {isBrand ? <>M.R.P &#8377; {mrp}</> : <>&#8377; {offeredPrice}</>}
        </Typography>
        {isBrandDashboardProduct && (
          <Grid container>
            <Grid item xs={6}>
              <Button
                component={Link}
                to={`/dashboard/brand/${publicUsername}/product/edit/${productSlug}/${id}`}
                color="primary"
                variant="outlined"
              >
                Edit
              </Button>
            </Grid>
            <Grid item xs={6}>
              <Button
                component={Link}
                to="/shop/PsWorld"
                color="secondary"
                variant="outlined"
              >
                Delete
              </Button>
            </Grid>
          </Grid>
        )}
      </Box>
    </Grid>
  )
}

export default ProductElement
