import React from "react"

import { fade, makeStyles } from "@material-ui/core/styles"
import Toolbar from "@material-ui/core/Toolbar"
import Typography from "@material-ui/core/Typography"
import InputBase from "@material-ui/core/InputBase"
import SearchIcon from "@material-ui/icons/Search"
import Link from "@material-ui/core/Link"
import Button from "@material-ui/core/Button"
import Grid from "@material-ui/core/Grid"

import MainFeaturedPost from "./MainFeaturedPost"
import GridElement from "../home/GridElement"
import gql from "graphql-tag"
import { useQuery } from "react-apollo"
import ErrorPage from "../core/ErrorPage"

import SEO from "../seo"
import HeroImageTemplate from "../templates/HeroImageTemplate"
import ProductGridSkeleton from "../skeletons/ProductGridSkeleton"

import { Box, TextField } from "@material-ui/core"
import { navigate } from "gatsby"

const useStyles = makeStyles(theme => ({
  toolbar: {
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  toolbarTitle: {
    flex: 1,
  },
  toolbarSecondary: {
    justifyContent: "space-between",
    overflowX: "auto",
  },
  toolbarLink: {
    padding: theme.spacing(1),
    flexShrink: 0,
  },
  search: {
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    "&:hover": {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      marginLeft: theme.spacing(3),
      width: "auto",
    },
  },
  inputRoot: {
    color: "inherit",
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 8),
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: 200,
    },
  },
}))
const sections = [
  "Technology",
  "Design",
  "Culture",
  "Business",
  "Politics",
  "Opinion",
  "Science",
  "Health",
  "Style",
  "Travel",
]

const SHOP_PRODUCTS = gql`
  query(
    $publicShopUsername: String!
    $endCursor: String
    $startCursor: String
  ) {
    shopProducts(
      publicShopUsername: $publicShopUsername
      first: 10
      after: $endCursor
      before: $startCursor
    ) {
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      edges {
        node {
          id
          product {
            title
            mrp
            description
          }
          offeredPrice
          shop {
            properties {
              publicUsername
            }
          }
        }
      }
    }
  }
`

const ProductGrid = ({ publicShopUsername }) => {
  const [pageInfo, setPageInfo] = React.useState([
    {
      startCursor: null,
    },
  ])
  const [pageNo, setPageNo] = React.useState(1)

  function handleNext(currentEndCursor, pageNo) {
    const newPageInfo = pageInfo
    newPageInfo[pageNo] = { startCursor: currentEndCursor }
    setPageInfo(newPageInfo)
    setPageNo(pageNo + 1)
  }
  const { loading, error, data } = useQuery(SHOP_PRODUCTS, {
    variables: {
      publicShopUsername,
      endCursor: pageInfo[pageNo - 1].startCursor,
    },
  })

  if (loading) return <ProductGridSkeleton></ProductGridSkeleton>
  if (error) return <ErrorPage></ErrorPage>
  if (data && data.shopProducts.pageInfo.startCursor) {
    const {
      edges: shopProducts,
      pageInfo: { hasNextPage, endCursor: currentEndCursor },
    } = data.shopProducts
    return (
      <>
        <Grid container>
          {shopProducts.map(shopProductObj => (
            <GridElement
              key={shopProductObj.node.id}
              shopProduct={shopProductObj.node}
            ></GridElement>
          ))}
        </Grid>
        <Grid item>
          <Button
            disabled={!hasNextPage}
            onClick={() => handleNext(currentEndCursor, pageNo)}
            variant="contained"
            color="secondary"
          >
            Next
          </Button>
          <Button
            variant="contained"
            color="secondary"
            disabled={pageNo === 1}
            onClick={() => setPageNo(pageNo - 1)}
          >
            Back
          </Button>
        </Grid>
      </>
    )
  }
}

const SHOP = gql`
  query($publicShopUsername: String!) {
    shop(publicShopUsername: $publicShopUsername) {
      geometry {
        coordinates
      }
      properties {
        publicUsername
        title
        productSpace
      }
    }
  }
`

const ShopHome = props => {
  const classes = useStyles()
  const { shopUsername: publicShopUsername } = props

  const [phrase, setPhrase] = React.useState("")
  const { loading, error, data } = useQuery(SHOP, {
    variables: { publicShopUsername },
  })

  if (loading)
    return (
      <>
        <HeroImageTemplate></HeroImageTemplate>
        <ProductGridSkeleton></ProductGridSkeleton>
      </>
    )

  if (data && data.shop) {
    const {
      geometry: { coordinates },
      properties: { title, productSpace },
    } = data.shop
    const lat = coordinates[1]
    const lng = coordinates[0]
    return (
      <>
        <SEO title={publicShopUsername}></SEO>
        <MainFeaturedPost></MainFeaturedPost>
        <Toolbar className={classes.toolbar}>
          <Grid container style={{ margin: 2 }} spacing={4}>
            <Grid item xs={12} md={4}>
              <Typography
                component="h2"
                variant="h5"
                color="inherit"
                align="center"
                noWrap
                className={classes.toolbarTitle}
              >
                {title}
              </Typography>
            </Grid>
            <Grid item alignItems="center" alignContent="center" xs={12} md={4}>
              {/* <div className={classes.search}> */}

              <TextField
                onChange={e => setPhrase(e.target.value)}
                onKeyPress={e => {
                  if (
                    phrase.replace(/\s/g, "").length > 1 &&
                    e.key === "Enter"
                  ) {
                    navigate(`/search/`)
                  }
                }}
                id="outlined-full-width"
                // style={{ margin: 8 }}
                placeholder="Search in this shop"
                style={{ width: "90%" }}
                margin="none"
                variant="outlined"
                InputLabelProps={{
                  shrink: true,
                }}
              />
              {/* </div> */}
              <SearchIcon
                style={{ marginTop: 16, marginLeft: 1 }}
                onClick={() =>
                  phrase.replace(/\s/g, "").length > 1 && navigate(`/search/`)
                }
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography align="center">
                <a
                  href={`https://www.google.co.in/maps/place/${lat},${lng}/@${lat},${lng},17z/`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  See this on map
                </a>
              </Typography>
            </Grid>
          </Grid>
        </Toolbar>
        <Toolbar
          component="nav"
          variant="dense"
          className={classes.toolbarSecondary}
        >
          {sections.map(section => (
            <Link
              color="inherit"
              noWrap
              key={section}
              variant="body2"
              href="#"
              className={classes.toolbarLink}
            >
              {section}
            </Link>
          ))}
        </Toolbar>
        <Box overflow="hidden" px={0.25}>
          <ProductGrid publicShopUsername={publicShopUsername}></ProductGrid>
        </Box>
      </>
    )
  }
}

export default ShopHome
