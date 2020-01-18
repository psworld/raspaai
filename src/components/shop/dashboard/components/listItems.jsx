import { yellow } from '@material-ui/core/colors';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import AcUnitIcon from '@material-ui/icons/AcUnit';
import AssignmentIcon from '@material-ui/icons/Assignment';
import DashboardIcon from '@material-ui/icons/Dashboard';
import FastFoodIcon from '@material-ui/icons/Fastfood';
import HourglassEmptyIcon from '@material-ui/icons/HourglassEmpty';
import LayersIcon from '@material-ui/icons/Layers';
// import PeopleIcon from "@material-ui/icons/People"
// import BarChartIcon from "@material-ui/icons/BarChart"
import RemoveShoppingCartIcon from '@material-ui/icons/RemoveShoppingCart';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import StoreIcon from '@material-ui/icons/Store';
import ViewQuiltIcon from '@material-ui/icons/ViewQuilt';
import React from 'react';
import RaspaaiIcon from '../../../../images/raspaai.svg';
import { MenuItemLink } from '../../../core/Link';

export const mainListItems = publicUsername => {
  const shopDashboard = `/dashboard/shop/${publicUsername}`;
  const baseUrl = shopDashboard;
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

      <ListItem component={MenuItemLink} to={`${baseUrl}/profile`} button>
        <ListItemIcon>
          <StoreIcon></StoreIcon>
        </ListItemIcon>
        <ListItemText primary={'My Shop'} />
      </ListItem>

      <ListItem component={MenuItemLink} to={`${baseUrl}/products`} button>
        <ListItemIcon>
          <LayersIcon />
        </ListItemIcon>
        <ListItemText primary='Products' />
      </ListItem>
      <ListItem button component={MenuItemLink} to={`${baseUrl}/services`}>
        <ListItemIcon>
          <AcUnitIcon></AcUnitIcon>
        </ListItemIcon>
        <ListItemText primary='Services'></ListItemText>
      </ListItem>
      <ListItem button component={MenuItemLink} to={`${baseUrl}/food`}>
        <ListItemIcon>
          <FastFoodIcon></FastFoodIcon>
        </ListItemIcon>
        <ListItemText primary='Food'></ListItemText>
      </ListItem>

      <ListItem button component={MenuItemLink} to={`${baseUrl}/combos`}>
        <ListItemIcon>
          <ViewQuiltIcon></ViewQuiltIcon>
        </ListItemIcon>
        <ListItemText primary='Combos'></ListItemText>
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
