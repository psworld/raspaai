import {
  Button,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography
} from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import { makeStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import AddBoxIcon from '@material-ui/icons/AddBox';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import DashboardIcon from '@material-ui/icons/Dashboard';
import LayersIcon from '@material-ui/icons/Layers';
import MenuIcon from '@material-ui/icons/Menu';
import StoreIcon from '@material-ui/icons/Store';
import clsx from 'clsx';
import { navigate } from 'gatsby';
import React from 'react';
import { useQuery } from 'react-apollo';
import RaspaaiIcon from '../../../images/raspaai.svg';
import ErrorPage from '../../core/ErrorPage';
import { MenuItemLink } from '../../core/Link';
import Loading from '../../core/Loading';
import { VIEWER } from '../../navbar/ToolBarMenu';
import SearchBar from '../../templates/dashboard/SearchBar';

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

const mainListItems = publicUsername => {
  const brandDashboard = `/dashboard/brand/${publicUsername}`;
  const baseUrl = brandDashboard;
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

      <ListItem component={MenuItemLink} to={`/brand/${publicUsername}`} button>
        <ListItemIcon>
          <StoreIcon></StoreIcon>
        </ListItemIcon>
        <ListItemText primary={'My Brand'} />
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
    </div>
  );
};

const BrandDashboardLayout = ({ children, publicUsername }) => {
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

    const userRegisteredPublicUsername = viewer.brand.publicUsername;

    const isBrandActive = viewer.brand.isActive;

    if (userRegisteredPublicUsername === publicUsername || viewer.isSuperuser) {
      return (
        <div className={classes.root}>
          <CssBaseline />
          <AppBar
            position='absolute'
            className={clsx(classes.appBar, open && classes.appBarShift)}>
            <Toolbar className={classes.toolbar}>
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
              <SearchBar
                isBrand={true}
                publicUsername={publicUsername}></SearchBar>
            </Toolbar>
          </AppBar>

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
            <List>{mainListItems(publicUsername)}</List>
            <Divider />
            {/* <List>{secondaryListItems}</List> */}
          </Drawer>

          <main className={classes.content}>
            <div className={classes.appBarSpacer} />
            {isBrandActive ? (
              <>{children}</>
            ) : (
              <div style={{ marginTop: 20 }}>
                <Typography variant='h5' align='center'>
                  Your brand plans have expired. Recharge to continue the
                  service
                </Typography>
                <br></br>
                <center>
                  <Button
                    onClick={() =>
                      navigate(`/dashboard/brand/${publicUsername}/plans/buy`)
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

export default BrandDashboardLayout;
