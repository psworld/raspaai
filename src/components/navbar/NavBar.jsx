import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import InputBase from '@material-ui/core/InputBase';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import { VIEWER, UserToolBar } from './ToolBarMenu';
import Button from '@material-ui/core/Button';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Badge from '@material-ui/core/Badge';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import ShoppingCart from '@material-ui/icons/ShoppingCart';

import { navigate } from 'gatsby';
import Link, { MenuItemLink } from '../core/Link';
import { useQuery, useMutation } from 'react-apollo';
import ToolBarMenuSkeleton from '../skeletons/ToolBarMenuSkeleton';
import gql from 'graphql-tag';
import { Paper } from '@material-ui/core';
import { CART_ITEMS } from '../../pages/cart';

const useStyles = makeStyles(theme => ({
  grow: {
    flexGrow: 1
  },
  menuButton: {
    marginRight: theme.spacing(2)
  },
  title: {
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block'
    }
  },
  sectionDesktop: {
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'flex'
    }
  },
  sectionMobile: {
    display: 'flex',
    [theme.breakpoints.up('md')]: {
      display: 'none'
    }
  },

  list: {
    width: 250
  },
  fullList: {
    width: 'auto'
  },

  //Search
  searchRoot: {
    padding: '2px 4px',
    display: 'flex',
    alignItems: 'center',
    // width: 400,
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: 'auto',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(3),
      width: 'auto'
    }
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1
    // backgroundColor: fade(theme.palette.common.white, 0.5),
    // '&:hover': {
    //   backgroundColor: fade(theme.palette.common.white, 0.8)
    // }
  },
  iconButton: {
    padding: 10
  },
  divider: {
    height: 28,
    margin: 4
  }
}));

const LOGOUT_USER = gql`
  mutation($id: String) {
    logoutUser(input: { clientMutationId: $id }) {
      clientMutationId
    }
  }
`;

export default function NavBar({ searchPhrase }) {
  const classes = useStyles();
  const { loading, error, data } = useQuery(VIEWER);

  // menus configuration
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  function handleProfileMenuOpen(event) {
    setAnchorEl(event.currentTarget);
  }

  function handleMobileMenuClose() {
    setMobileMoreAnchorEl(null);
  }

  function handleMenuClose() {
    setAnchorEl(null);
    handleMobileMenuClose();
  }

  function handleMobileMenuOpen(event) {
    setMobileMoreAnchorEl(event.currentTarget);
  }
  // end menus configuration

  // search phrase
  const [phrase, setPhrase] = React.useState(searchPhrase ? searchPhrase : '');
  // end search phrase

  if (error && error.message === 'GraphQL error: Error decoding signature') {
    localStorage.removeItem('token');
    window.reload();
  }

  const [
    logout,
    { loading: logoutLoading, called, data: logoutData }
  ] = useMutation(LOGOUT_USER, {
    variables: { id: data && data.viewer && data.viewer.id },
    update: (
      cache,
      {
        data: {
          logoutUser: { clientMutationId }
        }
      }
    ) => {
      cache.writeQuery({
        query: CART_ITEMS,
        data: { cartLines: [] }
      });
      cache.writeQuery({
        query: VIEWER,
        data: { viewer: null }
      });
    },
    onCompleted: () =>
      localStorage.removeItem('token') &
      sessionStorage.removeItem('token') &
      handleMenuClose()
  });

  // drawer
  const [state, setState] = React.useState({
    left: false
  });

  const toggleDrawer = (side, open) => event => {
    if (
      event.type === 'keydown' &&
      (event.key === 'Tab' || event.key === 'Shift')
    ) {
      return;
    }

    setState({ ...state, [side]: open });
  };

  const sideList = side => (
    <div
      className={classes.list}
      role='presentation'
      onClick={toggleDrawer(side, false)}
      onKeyDown={toggleDrawer(side, false)}>
      <List>
        {['Raspaai'].map((text, index) => (
          <ListItem component={MenuItemLink} to='/' key={text}>
            {/* <ListItemIcon>
              <MailIcon />
            </ListItemIcon> */}
            <ListItemText primary={text} />
          </ListItem>
        ))}
        <Divider></Divider>
        <ListItem component={MenuItemLink} to='/cart'>
          <ListItemText primary='My Cart' />
        </ListItem>
        <ListItem component={MenuItemLink} to='/my-orders'>
          <ListItemText primary='My Orders' />
        </ListItem>
      </List>
      <Divider />
    </div>
  );
  // end drawer

  // menus
  const menuId = 'primary-search-account-menu';
  const mobileMenuId = 'primary-search-account-menu-mobile';

  if (data && data.viewer !== null) {
    const { viewer } = data;
    var renderMenu = (
      <Menu
        anchorEl={anchorEl}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        id={menuId}
        keepMounted
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={isMenuOpen}
        onClose={handleMenuClose}>
        {/* <MenuItem
          onClick={
            handleMenuClose
          }>{`${viewer.firstName} ${viewer.lastName}`}</MenuItem> */}
        <MenuItem component={MenuItemLink} to='/profile/user'>
          {`${viewer.firstName} ${viewer.lastName}`}
        </MenuItem>
        {viewer.isSuperuser && (
          <MenuItem component={MenuItemLink} to={`/raspaai/dashboard`}>
            Admin Dashboard
          </MenuItem>
        )}

        {viewer.shop && (
          <>
            <MenuItem
              component={MenuItemLink}
              to={
                viewer.shop
                  ? viewer.shop.properties.application
                    ? `/shop/application/${viewer.shop.properties.publicUsername}`
                    : `/shop/${viewer.shop.properties.publicUsername}`
                  : '/shop/create-shop'
              }>
              My Shop
            </MenuItem>
            <MenuItem
              component={MenuItemLink}
              to={`/dashboard/shop/${viewer.shop.properties.publicUsername}`}>
              Shop Dashboard
            </MenuItem>
          </>
        )}
        {viewer.brand &&
          [
            {
              id: 'my-brand',
              to: `/brand/${viewer.brand.publicUsername}`,
              title: 'My Brand'
            },
            {
              id: 'brand-dashboard',
              to: `/dashboard/brand/${viewer.brand.publicUsername}`,
              title: 'Brand Dashboard'
            }
          ].map(brandObj => (
            <MenuItem
              key={brandObj.id}
              component={MenuItemLink}
              to={brandObj.to}>
              {brandObj.title}
            </MenuItem>
          ))}
        <MenuItem component={MenuItemLink} to={`/my-orders`}>
          My Orders
        </MenuItem>
        <MenuItem onClick={() => logout()}>
          {!called
            ? 'Logout'
            : logoutLoading
            ? 'Logging out'
            : logoutData && 'Logged out'}
        </MenuItem>
      </Menu>
    );

    var renderMobileMenu = (
      <Menu
        anchorEl={mobileMoreAnchorEl}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        id={mobileMenuId}
        keepMounted
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={isMobileMenuOpen}
        onClose={handleMobileMenuClose}>
        <MenuItem component={MenuItemLink} to='/cart'>
          <IconButton aria-label='cart items' color='inherit'>
            <Badge badgeContent={viewer.totalCartItems} color='secondary'>
              <ShoppingCart />
            </Badge>
          </IconButton>
          <p>Cart</p>
        </MenuItem>
        <MenuItem onClick={handleProfileMenuOpen}>
          <IconButton
            aria-label='account of current user'
            aria-controls='primary-search-account-menu'
            aria-haspopup='true'
            color='inherit'>
            <AccountCircle />
          </IconButton>
          <p>Profile</p>
        </MenuItem>
      </Menu>
    );
    // end menus
  }

  const handleSearch = () => {
    if (phrase.replace(/\s/g, '').length > 1) {
      navigate(`/search/${phrase}/pg/1`);
    }
  };

  return (
    <div className={classes.grow}>
      <AppBar position='static'>
        <Toolbar>
          <IconButton
            edge='start'
            onClick={toggleDrawer('left', true)}
            className={classes.menuButton}
            color='inherit'
            aria-label='open drawer'>
            <MenuIcon />
          </IconButton>
          <Drawer open={state.left} onClose={toggleDrawer('left', false)}>
            {sideList('left')}
          </Drawer>
          <Typography
            component={Link}
            to='/'
            style={{ color: 'white' }}
            className={classes.title}
            variant='h6'
            noWrap>
            Raspaai
          </Typography>
          <Paper className={classes.searchRoot}>
            <InputBase
              className={classes.input}
              value={phrase}
              onChange={e => setPhrase(e.target.value)}
              onKeyPress={e => e.key === 'Enter' && handleSearch()}
              placeholder='Search...'
              inputProps={{ 'aria-label': 'search' }}
            />
            {/* <IconButton
              onClick={handleClearSearch}
              className={classes.iconButton}
              aria-label='clear'>
              <CloseIcon />
            </IconButton> */}
            <Divider className={classes.divider} orientation='vertical' />
            <IconButton
              color='primary'
              onClick={() => handleSearch()}
              className={classes.iconButton}
              aria-label='search'>
              <SearchIcon />
            </IconButton>
          </Paper>

          <div className={classes.grow} />
          {loading && <ToolBarMenuSkeleton></ToolBarMenuSkeleton>}
          {data && data.viewer !== null && (
            <UserToolBar
              classes={classes}
              menuId={menuId}
              mobileMenuId={mobileMenuId}
              handleMobileMenuOpen={handleMobileMenuOpen}
              handleProfileMenuOpen={handleProfileMenuOpen}></UserToolBar>
          )}
          {data && data.viewer === null && (
            <>
              <div className={classes.sectionDesktop}>
                <Button component={MenuItemLink} to='/signin' edge='end'>
                  Sign in
                </Button>
              </div>
              <div className={classes.sectionMobile}>
                {/* <IconButton
                  aria-label="show more"
                  aria-controls={mobileMenuId}
                  aria-haspopup="true"
                  onClick={handleMobileMenuOpen}
                  color="inherit"
                >
                  <MoreIcon />
                </IconButton> */}
                <Button component={MenuItemLink} to='/signin' edge='end'>
                  Sign in
                </Button>
              </div>
            </>
          )}
        </Toolbar>
      </AppBar>
      <Drawer open={logoutLoading}></Drawer>
      {renderMobileMenu}
      {renderMenu}
    </div>
  );
}
