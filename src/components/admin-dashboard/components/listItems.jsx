import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import AssignmentIcon from '@material-ui/icons/Assignment';
import BarChartIcon from '@material-ui/icons/BarChart';
import DashboardIcon from '@material-ui/icons/Dashboard';
import HomeIcon from '@material-ui/icons/Home';
import LayersIcon from '@material-ui/icons/Layers';
import PeopleIcon from '@material-ui/icons/People';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import StoreIcon from '@material-ui/icons/Store';
import { navigate } from 'gatsby';
import React from 'react';
import { MenuItemLink } from '../../core/Link';

export const mainListItems = (publicUsername, isBrand) => {
  const baseUrl = `/raspaai/dashboard`;
  return (
    <div>
      <ListItem onClick={() => navigate(`${baseUrl}`)} button>
        <ListItemIcon>
          <DashboardIcon />
        </ListItemIcon>
        <ListItemText primary='Dashboard' />
      </ListItem>
      <ListItem onClick={() => navigate('/')} button>
        <ListItemIcon>
          <HomeIcon></HomeIcon>
        </ListItemIcon>
        <ListItemText primary='Raspaai' />
      </ListItem>
      <ListItem component={MenuItemLink} to={`${baseUrl}/shops`} button>
        <ListItemIcon>
          <StoreIcon></StoreIcon>
        </ListItemIcon>
        <ListItemText primary='Shops' />
      </ListItem>
      <ListItem button component={MenuItemLink} to={`${baseUrl}/brands`}>
        <ListItemIcon>
          <LayersIcon />
        </ListItemIcon>
        <ListItemText primary='Brands' />
      </ListItem>

      <ListItem button>
        <ListItemIcon>
          <ShoppingCartIcon />
        </ListItemIcon>
        <ListItemText primary='Orders' />
      </ListItem>
      <ListItem button>
        <ListItemIcon>
          <PeopleIcon />
        </ListItemIcon>
        <ListItemText primary='Customers' />
      </ListItem>
      <ListItem button>
        <ListItemIcon>
          <BarChartIcon />
        </ListItemIcon>
        <ListItemText primary='Reports' />
      </ListItem>
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
