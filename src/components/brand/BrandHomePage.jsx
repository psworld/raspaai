import React from "react"

import { makeStyles } from "@material-ui/core/styles"
import Toolbar from "@material-ui/core/Toolbar"
import Typography from "@material-ui/core/Typography"
import Link from "@material-ui/core/Link"
import Grid from "@material-ui/core/Grid"
import Box from "@material-ui/core/Box"

import gql from "graphql-tag"
import { useQuery } from "react-apollo"
import ErrorPage from "../core/ErrorPage"
import SEO from "../seo"

import ProductGridSkeleton from "../skeletons/ProductGridSkeleton"

import TitleAndSearchToolbar from "../templates/TitleAndSearchToolbar"
import MainFeaturedPost from "../templates/MainFeaturedPost"
import PaginationWithState from "../templates/PaginationWithState"
import BrandProductGrid from "../templates/BrandProductGrid"
import BrandShopHomeSkeleton from "../skeletons/BrandShopHomeSkeleton"

const useStyles = makeStyles(theme => ({
  toolbarSecondary: {
    justifyContent: "space-between",
    overflowX: "auto",
  },
  toolbarLink: {
    padding: theme.spacing(1),
    flexShrink: 0,
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

export const BRAND_PRODUCTS = gql`
  query(
    $publicBrandUsername: String!
    $phrase: String
    $endCursor: String
    $withBrand: Boolean!
  ) {
    brandProducts(
      publicBrandUsername: $publicBrandUsername
      phrase: $phrase
      first: 10
      after: $endCursor
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
          title
          mrp
          thumb
          description
          brand @include(if: $withBrand) {
            publicUsername
            title
          }
        }
      }
    }
  }
`
const json = {
  title: "Whip cream",
  publisher: "bharti bhawan",
  "author(s)": "Hc verma",
  edition: "17",
  "Publication Year": "2019",
  format: "paperback",
  "No of pages": "350",
}

export const ProductGrid = props => {
  const { phrase, publicBrandUsername, isBrandDashboardProduct } = props
  // Required for pagination
  const [pageInfo, setPageInfo] = React.useState([
    {
      startCursor: null,
    },
  ])
  const [pageNo, setPageNo] = React.useState(1)
  // Pagination requirements end

  const { loading, error, data } = useQuery(BRAND_PRODUCTS, {
    variables: {
      publicBrandUsername,
      phrase,
      withBrand: false,
      endCursor: pageInfo[pageNo - 1].startCursor,
    },
  })
  if (loading) return <ProductGridSkeleton></ProductGridSkeleton>
  if (error) return <ErrorPage></ErrorPage>

  if (data && data.brandProducts.pageInfo.startCursor) {
    const {
      edges: brandProducts,
      pageInfo: { hasNextPage, endCursor: currentPageEndCursor },
    } = data.brandProducts

    return (
      <>
        <Grid container>
          <BrandProductGrid
            publicBrandUsername={publicBrandUsername}
            brandProducts={brandProducts}
            isBrandDashboardProduct={isBrandDashboardProduct}
          ></BrandProductGrid>
        </Grid>
        <Grid item>
          <PaginationWithState
            pageNo={pageNo}
            setPageNo={setPageNo}
            pageInfo={pageInfo}
            setPageInfo={setPageInfo}
            currentPageEndCursor={currentPageEndCursor}
            hasNextPage={hasNextPage}
          ></PaginationWithState>
        </Grid>
      </>
    )
  }
  return (
    <Typography style={{ margin: 8 }} variant="h4">
      We could not find any result <code>{phrase}</code>
    </Typography>
  )
}

const BRAND = gql`
  query($publicBrandUsername: String!) {
    brand(publicBrandUsername: $publicBrandUsername) {
      id
      publicUsername
      title
      heroImage
    }
  }
`

const BrandHomePage = props => {
  const classes = useStyles()
  const { brandUsername: publicBrandUsername, phrase } = props

  const [searchPhrase, setSearchPhrase] = React.useState("")
  const { loading, error, data } = useQuery(BRAND, {
    variables: { publicBrandUsername },
  })

  if (loading) return <BrandShopHomeSkeleton></BrandShopHomeSkeleton>

  if (error) return <ErrorPage></ErrorPage>

  if (data && data.brand) {
    const {
      brand: { id, title, heroImage },
    } = data

    return (
      <>
        <SEO title={publicBrandUsername}></SEO>
        <MainFeaturedPost
          img={heroImage}
          title={publicBrandUsername}
        ></MainFeaturedPost>
        <TitleAndSearchToolbar
          title={title}
          searchPhrase={searchPhrase}
          publicUsername={publicBrandUsername}
          setSearchPhrase={setSearchPhrase}
          isBrand={true}
        ></TitleAndSearchToolbar>
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
        <Box overflow="hidden" px={0}>
          <ProductGrid
            phrase={phrase}
            publicBrandUsername={publicBrandUsername}
          ></ProductGrid>
        </Box>
      </>
    )
  }
  return <h1>Nothing from early</h1>
}

export default BrandHomePage
