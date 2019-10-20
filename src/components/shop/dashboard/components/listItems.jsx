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

import { MenuItemLink } from "../../../core/Link"

export const mainListItems = (publicUsername, isBrand) => {
  const shopDashboard = `/dashboard/shop/${publicUsername}`
  const brandDashboard = `/dashboard/brand/${publicUsername}`
  const baseUrl = isBrand ? brandDashboard : shopDashboard
  return (
    <div>
      <ListItem component={MenuItemLink} to={baseUrl} button>
        <ListItemIcon>
          <DashboardIcon />
        </ListItemIcon>
        <ListItemText primary="Dashboard" />
      </ListItem>
      <ListItem component={MenuItemLink} to={"/"} button>
        <ListItemIcon>
          <HomeIcon></HomeIcon>
        </ListItemIcon>
        <ListItemText primary="Raspaai" />
      </ListItem>
      {isBrand ? (
        <ListItem
          component={MenuItemLink}
          to={`/brand/${publicUsername}`}
          button
        >
          <ListItemIcon>
            <StoreIcon></StoreIcon>
          </ListItemIcon>
          <ListItemText primary="My Brand" />
        </ListItem>
      ) : (
        <ListItem
          component={MenuItemLink}
          to={`/shop/${publicUsername}`}
          button
        >
          <ListItemIcon>
            <StoreIcon></StoreIcon>
          </ListItemIcon>
          <ListItemText primary="My shop" />
        </ListItem>
      )}
      <ListItem component={MenuItemLink} to={`${baseUrl}/product/add`} button>
        <ListItemIcon>
          <LibraryAddIcon></LibraryAddIcon>
        </ListItemIcon>
        <ListItemText primary="Add product" />
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

      <ListItem component={MenuItemLink} to={`${baseUrl}/products`} button>
        <ListItemIcon>
          <LayersIcon />
        </ListItemIcon>
        <ListItemText primary="My Products" />
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
