import { Button, Typography } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import { yellow } from '@material-ui/core/colors';
import CssBaseline from '@material-ui/core/CssBaseline';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { makeStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import DashboardIcon from '@material-ui/icons/Dashboard';
import HourglassEmptyIcon from '@material-ui/icons/HourglassEmpty';
import LayersIcon from '@material-ui/icons/Layers';
import MenuIcon from '@material-ui/icons/Menu';
import RemoveShoppingCartIcon from '@material-ui/icons/RemoveShoppingCart';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import StoreIcon from '@material-ui/icons/Store';
import clsx from 'clsx';
import { navigate } from 'gatsby';
import React from 'react';
import { useQuery } from 'react-apollo';
import RaspaaiIcon from '../../../../images/raspaai.svg';
import ErrorPage from '../../../core/ErrorPage';
import { MenuItemLink } from '../../../core/Link';
import Loading from '../../../core/Loading';
import { VIEWER } from '../../../navbar/ToolBarMenu';
import { reverse } from 'named-urls';
import routes from '../../../core/routes';

const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex'
  },
  toolbar: {
    paddingRight: 24 // keep right padding when drawer closed
  },
  toolbarIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    })
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  menuButton: {
    marginRight: 36
  },
  menuButtonHidden: {
    display: 'none'
  },
  title: {
    flexGrow: 1
  },
  drawerPaper: {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  drawerPaperClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9)
    }
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    // height: '100vh',
    overflow: 'auto'
  },
  container: {
    paddingTop: theme.spacing(4),
    marginBottom: theme.spacing(4)
  },
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column'
  },
  fixedHeight: {
    height: 240
  }
}));

const SideBarItems = wholesalerId => {
  const wholesaler = `/dashboard/wholesaler/${wholesalerId}`;
  const baseUrl = wholesaler;
  return (
    <div>
      <ListItem
        component={MenuItemLink}
        to={reverse(`${routes.wholesaler.dashboard.home}`, { wholesalerId })}
        button>
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
        to={reverse(`${routes.wholesaler.home}`, { wholesalerId })}
        button>
        <ListItemIcon>
          <StoreIcon></StoreIcon>
        </ListItemIcon>
        <ListItemText primary={'My Wholesale Shop'} />
      </ListItem>

      <ListItem
        component={MenuItemLink}
        to={reverse(`${routes.wholesaler.dashboard.products}`, {
          wholesalerId
        })}
        button>
        <ListItemIcon>
          <LayersIcon />
        </ListItemIcon>
        <ListItemText primary='Products' />
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

const DashboardLayout = ({ children, wholesalerId }) => {
  const classes = useStyles();

  const [open, setOpen] = React.useState(false);
  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleDrawerClose = () => {
    setOpen(false);
  };

  const { loading, error, data } = useQuery(VIEWER);

  if (loading) return <Loading></Loading>;
  if (error) return <ErrorPage></ErrorPage>;

  if (data && data.viewer) {
    const { viewer } = data;

    const userRegisteredWholesalerId =
      viewer.wholesaler && viewer.wholesaler.id;

    const isWholesalerActive = viewer.wholesaler.isActive;

    if (userRegisteredWholesalerId === wholesalerId || viewer.isSuperuser) {
      return (
        <div className={classes.root}>
          <CssBaseline />
          <AppBar
            position='absolute'
            className={clsx(classes.appBar, open && classes.appBarShift)}>
            <Toolbar className={classes.toolbar}>
              {isWholesalerActive && (
                <>
                  <IconButton
                    edge='start'
                    color='inherit'
                    aria-label='open drawer'
                    onClick={handleDrawerOpen}
                    className={clsx(
                      classes.menuButton,
                      open && classes.menuButtonHidden
                    )}>
                    <MenuIcon />
                  </IconButton>
                  {/* <SearchBar publicUsername={publicUsername}></SearchBar> */}
                </>
              )}
            </Toolbar>
          </AppBar>
          {isWholesalerActive && (
            <Drawer
              variant='permanent'
              classes={{
                paper: clsx(
                  classes.drawerPaper,
                  !open && classes.drawerPaperClose
                )
              }}
              open={open}>
              <div className={classes.toolbarIcon}>
                <IconButton onClick={handleDrawerClose}>
                  <ChevronLeftIcon />
                </IconButton>
              </div>
              <Divider />
              <List>{SideBarItems(wholesalerId)}</List>
              <Divider />
              {/* <List>{secondaryListItems}</List> */}
            </Drawer>
          )}
          <main className={classes.content}>
            <div className={classes.appBarSpacer} />
            {isWholesalerActive ? (
              <>{children}</>
            ) : (
              <div style={{ marginTop: 20 }}>
                <Typography variant='h5' align='center'>
                  Your plans have expired. Recharge to continue the service
                </Typography>
                <br></br>
                <center>
                  <Button
                    onClick={() =>
                      navigate(
                        `/dashboard/wholesaler/${wholesalerId}/plans/buy`
                      )
                    }
                    variant='contained'
                    color='secondary'>
                    Buy plans
                  </Button>
                </center>
              </div>
            )}
          </main>
        </div>
      );
    } else {
      return <h1>You are not authorized to access this page.</h1>;
    }
  } else {
    return <>{navigate('/signin')}</>;
  }
};

export default DashboardLayout;
