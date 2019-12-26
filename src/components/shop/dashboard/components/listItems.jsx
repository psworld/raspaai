import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import DashboardIcon from '@material-ui/icons/Dashboard';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
// import PeopleIcon from "@material-ui/icons/People"
// import BarChartIcon from "@material-ui/icons/BarChart"
import RemoveShoppingCartIcon from '@material-ui/icons/RemoveShoppingCart';
import HourglassEmptyIcon from '@material-ui/icons/HourglassEmpty';
import LayersIcon from '@material-ui/icons/Layers';
import AssignmentIcon from '@material-ui/icons/Assignment';
import StoreIcon from '@material-ui/icons/Store';
import ViewQuiltIcon from '@material-ui/icons/ViewQuilt';
import HomeIcon from '@material-ui/icons/Home';
import AddBoxIcon from '@material-ui/icons/AddBox';
import LibraryAddIcon from '@material-ui/icons/LibraryAdd';
import RaspaaiIcon from '../../../../images/raspaai.svg';
import { MenuItemLink } from '../../../core/Link';
import { yellow } from '@material-ui/core/colors';

export const mainListItems = (publicUsername, isBrand) => {
  const shopDashboard = `/dashboard/shop/${publicUsername}`;
  const brandDashboard = `/dashboard/brand/${publicUsername}`;
  const baseUrl = isBrand ? brandDashboard : shopDashboard;
  return (
    <div>
      <ListItem component={MenuItemLink} to={baseUrl} button>
        <ListItemIcon>
          <DashboardIcon />
        </ListItemIcon>
        <ListItemText primary='Dashboard' />
      </ListItem>
      <ListItem component={MenuItemLink} to={'/'} button>
        <ListItemIcon>
          <img alt='Raspaai' height='24' width='24' src={RaspaaiIcon}></img>
        </ListItemIcon>
        <ListItemText primary='Raspaai' />
      </ListItem>

      <ListItem
        component={MenuItemLink}
        to={isBrand ? `/brand/${publicUsername}` : `/shop/${publicUsername}`}
        button>
        <ListItemIcon>
          <StoreIcon></StoreIcon>
        </ListItemIcon>
        <ListItemText primary={isBrand ? 'My Brand' : 'My Shop'} />
      </ListItem>
      <ListItem component={MenuItemLink} to={`${baseUrl}/products`} button>
        <ListItemIcon>
          <LayersIcon />
        </ListItemIcon>
        <ListItemText primary='My Products' />
      </ListItem>
      <ListItem component={MenuItemLink} to={`${baseUrl}/products/add`} button>
        <ListItemIcon>
          <AddBoxIcon></AddBoxIcon>
        </ListItemIcon>
        <ListItemText primary='Add product' />
      </ListItem>
      {!isBrand && (
        <>
          <ListItem button component={MenuItemLink} to={`${baseUrl}/combos`}>
            <ListItemIcon>
              <ViewQuiltIcon></ViewQuiltIcon>
            </ListItemIcon>
            <ListItemText primary='My combos'></ListItemText>
          </ListItem>
          <ListItem
            button
            component={MenuItemLink}
            to={`${baseUrl}/combos/create`}>
            <ListItemIcon>
              <LibraryAddIcon></LibraryAddIcon>
            </ListItemIcon>
            <ListItemText primary='Create combo'></ListItemText>
          </ListItem>
          <ListItem
            button
            component={MenuItemLink}
            to={`${baseUrl}/orders/pending`}>
            <ListItemIcon>
              <HourglassEmptyIcon style={{ color: yellow[900] }} />
            </ListItemIcon>
            <ListItemText primary='Pending Orders' />
          </ListItem>
          <ListItem
            button
            component={MenuItemLink}
            to={`${baseUrl}/orders/fulfilled`}>
            <ListItemIcon>
              <ShoppingCartIcon style={{ color: 'green' }} />
            </ListItemIcon>
            <ListItemText primary='Successful Orders' />
          </ListItem>
          <ListItem
            button
            component={MenuItemLink}
            to={`${baseUrl}/orders/cancelled`}>
            <ListItemIcon>
              <RemoveShoppingCartIcon color='secondary' />
            </ListItemIcon>
            <ListItemText primary='Unsuccessful Orders' />
          </ListItem>
        </>
      )}
      {/*
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
      </ListItem> */}
    </div>
  );
};

export const secondaryListItems = (
  <div>
    <ListSubheader inset>Saved reports</ListSubheader>
    <ListItem button>
      <ListItemIcon>
        <AssignmentIcon />
      </ListItemIcon>
      <ListItemText primary='Current month' />
    </ListItem>
    <ListItem button>
      <ListItemIcon>
        <AssignmentIcon />
      </ListItemIcon>
      <ListItemText primary='Last quarter' />
    </ListItem>
    <ListItem button>
      <ListItemIcon>
        <AssignmentIcon />
      </ListItemIcon>
      <ListItemText primary='Year-end sale' />
    </ListItem>
  </div>
);
