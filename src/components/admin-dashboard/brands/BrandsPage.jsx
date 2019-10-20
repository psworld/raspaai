import React from "react"
import PropTypes from "prop-types"
import { makeStyles } from "@material-ui/core/styles"
import AppBar from "@material-ui/core/AppBar"
import Tabs from "@material-ui/core/Tabs"
import Tab from "@material-ui/core/Tab"
import Typography from "@material-ui/core/Typography"
import Box from "@material-ui/core/Box"
import BrandList from "./components/BrandList"
import gql from "graphql-tag"
import { useQuery } from "react-apollo"

function TabPanel(props) {
  const { children, value, index, ...other } = props

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      <Box p={3}>{children}</Box>
    </Typography>
  )
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  }
}

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
}))

const BRANDS_LIST = gql`
  query(
    $category: String!
    $brandUsername: String
    $searchByUsername: Boolean = false
    $userEmail: String
    $endCursor: String
  ) {
    adminBrands(
      category: $category
      brandUsername: $brandUsername
      searchByUsername: $searchByUsername
      userEmail: $userEmail
      first: 50
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
          owner {
            email
            firstName
            lastName
          }
          publicUsername
          title
          heroImage
          applicationDate
        }
      }
    }
  }
`

export default function BrandsPage() {
  const classes = useStyles()
  const [value, setValue] = React.useState(0)

  const [category, setCategory] = React.useState("under_review")

  // Required for pagination
  const [pageInfo, setPageInfo] = React.useState([
    {
      startCursor: null,
    },
  ])
  const [pageNo, setPageNo] = React.useState(1)
  // Pagination requirements end

  const { loading, error, data } = useQuery(BRANDS_LIST, {
    variables: { category, endCursor: pageInfo[pageNo - 1].startCursor },
  })

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  return (
    <div>
      <AppBar position="static">
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="simple tabs example"
        >
          <Tab label="Under review" {...a11yProps(0)} />
          <Tab label="Done" {...a11yProps(1)} />
          <Tab label="Errors" {...a11yProps(2)} />
          <Tab label="Rejected" {...a11yProps(3)} />
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0}>
        {data && data.adminBrands && (
          <BrandList
            pageNo={pageNo}
            setPageNo={setPageNo}
            setPageInfo={setPageInfo}
            pageInfo={pageInfo}
            data={data}
          ></BrandList>
        )}
      </TabPanel>
      <TabPanel value={value} index={1}>
        Done
      </TabPanel>
      <TabPanel value={value} index={2}>
        Errors
      </TabPanel>
      <TabPanel value={value} index={3}>
        Rejected
      </TabPanel>
    </div>
  )
}
