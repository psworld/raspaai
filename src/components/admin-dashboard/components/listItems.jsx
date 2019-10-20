import React from "react"
import ListItem from "@material-ui/core/ListItem"
import ListItemIcon from "@material-ui/core/ListItemIcon"
import ListItemText from "@material-ui/core/ListItemText"
import ListSubheader from "@material-ui/core/ListSubheader"
import DashboardIcon from "@material-ui/icons/Dashboard"
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart"
import PeopleIcon from "@material-ui/icons/People"
import BarChartIcon from "@material-ui/icons/BarChart"
import LayersIcon from "@material-ui/icons/Layers"
import AssignmentIcon from "@material-ui/icons/Assignment"
import StoreIcon from "@material-ui/icons/Store"
import HomeIcon from "@material-ui/icons/Home"
import LibraryAddIcon from "@material-ui/icons/LibraryAdd"

import { navigate } from "gatsby"

export const mainListItems = (publicUsername, isBrand) => {
  const baseUrl = `/raspaai/dashboard`
  return (
    <div>
      <ListItem onClick={() => navigate(`${baseUrl}`)} button>
        <ListItemIcon>
          <DashboardIcon />
        </ListItemIcon>
        <ListItemText primary="Dashboard" />
      </ListItem>
      <ListItem onClick={() => navigate("/")} button>
        <ListItemIcon>
          <HomeIcon></HomeIcon>
        </ListItemIcon>
        <ListItemText primary="Raspaai" />
      </ListItem>
      <ListItem onClick={() => navigate(`${baseUrl}/shops`)} button>
        <ListItemIcon>
          <StoreIcon></StoreIcon>
        </ListItemIcon>
        <ListItemText primary="Shops" />
      </ListItem>
      <ListItem onClick={() => navigate(`${baseUrl}/brands`)} button>
        <ListItemIcon>
          <LayersIcon />
        </ListItemIcon>
        <ListItemText primary="Brands" />
      </ListItem>
      <ListItem button onClick={() => navigate(`${baseUrl}/brand/add`)}>
        <ListItemIcon>
          <LibraryAddIcon></LibraryAddIcon>
        </ListItemIcon>
        <ListItemText primary="Add Brand" />
      </ListItem>
      <ListItem button>
        <ListItemIcon>
          <ShoppingCartIcon />
        </ListItemIcon>
        <ListItemText primary="Orders" />
      </ListItem>
      <ListItem button>
        <ListItemIcon>
          <PeopleIcon />
        </ListItemIcon>
        <ListItemText primary="Customers" />
      </ListItem>
      <ListItem button>
        <ListItemIcon>
          <BarChartIcon />
        </ListItemIcon>
        <ListItemText primary="Reports" />
      </ListItem>
    </div>
  )
}

export const secondaryListItems = (
  <div>
    <ListSubheader inset>Saved reports</ListSubheader>
    <ListItem button>
      <ListItemIcon>
        <AssignmentIcon />
      </ListItemIcon>
      <ListItemText primary="Current month" />
    </ListItem>
    <ListItem button>
      <ListItemIcon>
        <AssignmentIcon />
      </ListItemIcon>
      <ListItemText primary="Last quarter" />
    </ListItem>
    <ListItem button>
      <ListItemIcon>
        <AssignmentIcon />
      </ListItemIcon>
      <ListItemText primary="Year-end sale" />
    </ListItem>
  </div>
)
