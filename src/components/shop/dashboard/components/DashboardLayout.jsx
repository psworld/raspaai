import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Badge from '@material-ui/core/Badge';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import NotificationsIcon from '@material-ui/icons/Notifications';
import { mainListItems } from './listItems';
import SearchBar from '../../../templates/dashboard/SearchBar';
import { useQuery } from 'react-apollo';
import ErrorPage from '../../../core/ErrorPage';
import { VIEWER } from '../../../navbar/ToolBarMenu';
import { navigate } from 'gatsby';
import { Typography, Button } from '@material-ui/core';

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

const DashboardLayout = ({ children, publicUsername, isBrand = false }) => {
  const classes = useStyles();

  const [open, setOpen] = React.useState(false);
  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleDrawerClose = () => {
    setOpen(false);
  };

  const { loading, error, data } = useQuery(VIEWER);

  if (loading) return <p>Loading</p>;
  if (error) return <ErrorPage></ErrorPage>;

  if (data && data.viewer) {
    const { viewer } = data;

    const userRegisteredPublicUsername = isBrand
      ? viewer.isBrandOwner && viewer.brand.publicUsername
      : viewer.isShopOwner && viewer.shop.properties.publicUsername;

    const isShopActive = isBrand ? true : viewer.shop.properties.isActive;

    if (userRegisteredPublicUsername === publicUsername || viewer.isSuperuser) {
      return (
        <>
          <div className={classes.root}>
            <CssBaseline />
            <AppBar
              position='absolute'
              className={clsx(classes.appBar, open && classes.appBarShift)}>
              <Toolbar className={classes.toolbar}>
                {isShopActive && (
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
                    <SearchBar
                      isBrand={isBrand}
                      publicUsername={publicUsername}></SearchBar>
                  </>
                )}
              </Toolbar>
            </AppBar>
            {isShopActive && (
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
                <List>{mainListItems(publicUsername, isBrand)}</List>
                <Divider />
                {/* <List>{secondaryListItems}</List> */}
              </Drawer>
            )}
            <main className={classes.content}>
              <div className={classes.appBarSpacer} />
              {isShopActive ? (
                <>{children}</>
              ) : (
                <div style={{ marginTop: 20 }}>
                  <Typography variant='h5' align='center'>
                    Your shop plans have expired. Recharge to continue the
                    service
                  </Typography>
                  <br></br>
                  <center>
                    <Button
                      onClick={() =>
                        navigate(`/dashboard/shop/${publicUsername}/plans/buy`)
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
        </>
      );
    } else {
      return <h1>You are not authorized to access this page.</h1>;
    }
  } else {
    return <>{navigate('/signin')}</>;
  }
};

export default DashboardLayout;
