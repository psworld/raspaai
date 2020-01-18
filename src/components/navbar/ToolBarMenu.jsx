import React from 'react';

import MoreIcon from '@material-ui/icons/MoreVert';
import IconButton from '@material-ui/core/IconButton';
import Badge from '@material-ui/core/Badge';
import AccountCircle from '@material-ui/icons/AccountCircle';
import ShoppingCart from '@material-ui/icons/ShoppingCart';

import { useQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';

import { MenuItemLink } from '../core/Link';
import { CART_ITEMS } from '../../pages/cart';

export const VIEWER = gql`
  {
    viewer {
      id
      email
      firstName
      lastName
      isShopOwner
      isBrandOwner
      isSuperuser
      brand {
        id
        publicUsername
        isActive
      }
      shop {
        id
        properties {
          publicUsername
          isActive
        }
      }
    }
  }
`;

export const UserToolBar = ({
  classes,
  menuId,
  mobileMenuId,
  handleMobileMenuOpen,
  handleProfileMenuOpen
}) => {
  const { data } = useQuery(CART_ITEMS);

  return (
    <>
      <div className={classes.sectionDesktop}>
        <IconButton
          component={MenuItemLink}
          to='/cart'
          aria-label='cart items'
          color='inherit'>
          <Badge
            variant='dot'
            invisible={data ? data.cartLines.length === 0 : true}
            color='secondary'>
            <ShoppingCart />
          </Badge>
        </IconButton>
        <IconButton
          edge='end'
          aria-label='account of current user'
          aria-controls={menuId}
          aria-haspopup='true'
          onClick={handleProfileMenuOpen}
          color='inherit'>
          <AccountCircle />
        </IconButton>
      </div>
      <div className={classes.sectionMobile}>
        <IconButton
          aria-label='show more'
          aria-controls={mobileMenuId}
          aria-haspopup='true'
          onClick={handleMobileMenuOpen}
          color='inherit'>
          <MoreIcon />
        </IconButton>
      </div>
    </>
  );
};

const ToolBarMenu = props => {
  return;
};
export default ToolBarMenu;
