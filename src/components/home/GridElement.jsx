import React from "react"
import Grid from "@material-ui/core/Grid"
import Typography from "@material-ui/core/Typography"
import { makeStyles } from "@material-ui/core/styles"
import gatsbyAstronaut from "../../images/gatsby-astronaut.png"
import slugGenerator from "../core/slugGenerator"
import Link from "../core/Link"
import Box from "@material-ui/core/Box"

const useStyles = makeStyles(theme => ({
  card: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
  },
  cardMedia: {
    // paddingTop: "56.25%", // 16:9
    paddingTop: "80%",
  },
  cardContent: {
    flexGrow: 1,
  },
}))

const GridElement = props => {
  const {
    shopProduct: {
      id: shopProductId,
      shop: {
        properties: { publicUsername },
      },
      offeredPrice,
      product: { title, mrp, description },
    },
  } = props
  const classes = useStyles()
  const shopProductSlug = slugGenerator(title)
  return (
    <Grid item xs={6} sm={4} md={3} lg={2}>
      <Box width={150} mx={0.5} my={2}>
        <Link
          to={`/shop/${publicUsername}/product/${shopProductSlug}/${shopProductId}`}
        >
          <img
            style={{ maxHeight: 200, maxWidth: 150 }}
            alt={title}
            src={gatsbyAstronaut}
          />
          {/* <Box paddingRight={2}> */}
          <Typography variant="body2">{title.substring(0, 30)}</Typography>
        </Link>
        <Typography display="block" variant="caption" color="textSecondary">
          <Link
            variant="contained"
            to={`/shop/${publicUsername}`}
            size="large"
            color="primary"
          >
            {publicUsername}
          </Link>
        </Typography>
        <Typography variant="body1" style={{ color: "green" }}>
          &#8377; {offeredPrice}
        </Typography>
        {/* </Box> */}
      </Box>
    </Grid>
  )
}

export default GridElement
