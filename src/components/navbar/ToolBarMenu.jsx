import React from "react"

import MoreIcon from "@material-ui/icons/MoreVert"
import { makeStyles } from "@material-ui/core/styles"
import IconButton from "@material-ui/core/IconButton"
import Badge from "@material-ui/core/Badge"
import AccountCircle from "@material-ui/icons/AccountCircle"
import MailIcon from "@material-ui/icons/Mail"
import NotificationsIcon from "@material-ui/icons/Notifications"
import MenuItem from "@material-ui/core/MenuItem"
import Menu from "@material-ui/core/Menu"

import { useQuery, useMutation } from "@apollo/react-hooks"
import { gql } from "apollo-boost"

import ErrorPage from "../core/ErrorPage"
import { MenuItemLink } from "../core/Link"
import { Button, Typography } from "@material-ui/core"
import ToolBarMenuSkeleton from "../skeletons/ToolBarMenuSkeleton"

const useStyles = makeStyles(theme => ({
  sectionDesktop: {
    display: "none",
    [theme.breakpoints.up("md")]: {
      display: "flex",
    },
  },
  sectionMobile: {
    display: "flex",
    [theme.breakpoints.up("md")]: {
      display: "none",
    },
  },
}))

export const VIEWER = gql`
  {
    viewer {
      email
      firstName
      lastName
      isShopOwner
      isSuperuser
      brand {
        publicUsername
        isApplication
        applicationStatus {
          statusCode
          title
        }
      }
      shop {
        properties {
          publicUsername
          isApplication
          applicationStatus {
            statusCode
            title
          }
        }
      }
      isBrandOwner
    }
  }
`

const LOGOUT_USER = gql`
  mutation {
    logoutUser(input: {}) {
      msg
    }
  }
`

const ToolBarMenu = props => {
  const { loading, error, data } = useQuery(VIEWER)
  const [
    logout,
    { loading: logoutLoading, called, data: logoutData },
  ] = useMutation(LOGOUT_USER, { refetchQueries: [{ query: VIEWER }] })

  const classes = useStyles()

  const [anchorEl, setAnchorEl] = React.useState(null)
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null)

  const isMenuOpen = Boolean(anchorEl)
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl)

  function handleProfileMenuOpen(event) {
    setAnchorEl(event.currentTarget)
  }

  function handleMobileMenuClose() {
    setMobileMoreAnchorEl(null)
  }

  function handleMenuClose() {
    setAnchorEl(null)
    handleMobileMenuClose()
  }

  function handleMobileMenuOpen(event) {
    setMobileMoreAnchorEl(event.currentTarget)
  }

  const menuId = "primary-search-account-menu"
  const renderMenu = viewer => (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem
        onClick={handleMenuClose}
      >{`${viewer.firstName} ${viewer.lastName}`}</MenuItem>
      <MenuItem onClick={handleMenuClose}>{viewer.email}</MenuItem>
      {viewer.isSuperuser && (
        <MenuItem component={MenuItemLink} to={`/raspaai/dashboard`}>
          Admin Dashboard
        </MenuItem>
      )}
      <MenuItem
        component={MenuItemLink}
        to={
          viewer.shop
            ? viewer.shop.properties.isApplication
              ? `/shop/application/${viewer.shop.properties.publicUsername}`
              : `/shop/${viewer.shop.properties.publicUsername}`
            : "/shop/create-shop"
        }
      >
        My Shop
      </MenuItem>
      {viewer.shop && (
        <MenuItem
          component={MenuItemLink}
          to={`/dashboard/shop/${viewer.shop.properties.publicUsername}`}
        >
          Shop Dashboard
        </MenuItem>
      )}

      {viewer.brand && (
        <MenuItem
          component={MenuItemLink}
          to={`/dashboard/brand/${viewer.brand.publicUsername}`}
        >
          Brand Dashboard
        </MenuItem>
      )}
      <MenuItem onClick={() => logout() & handleMenuClose()}>
        {!called
          ? "Logout"
          : logoutLoading
          ? "Logging out"
          : logoutData && "Logged out"}
      </MenuItem>
    </Menu>
  )

  const mobileMenuId = "primary-search-account-menu-mobile"
  const renderMobileMenu = isAnonymous => (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      {isAnonymous ? (
        <>
          <MenuItem>
            <Typography component={MenuItemLink} to="/signin">
              Sign in
            </Typography>
          </MenuItem>
          <MenuItem>
            <Typography component={MenuItemLink} to="/shop/create-shop">
              My Shop
            </Typography>
          </MenuItem>
        </>
      ) : (
        <>
          <MenuItem>
            <IconButton aria-label="show 4 new mails" color="inherit">
              <Badge badgeContent={4} color="secondary">
                <MailIcon />
              </Badge>
            </IconButton>
            <p>Messages</p>
          </MenuItem>
          <MenuItem>
            <IconButton aria-label="show 11 new notifications" color="inherit">
              <Badge badgeContent={11} color="secondary">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            <p>Notifications</p>
          </MenuItem>
          <MenuItem onClick={handleProfileMenuOpen}>
            <IconButton
              aria-label="account of current user"
              aria-controls="primary-search-account-menu"
              aria-haspopup="true"
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
            <p>Profile</p>
          </MenuItem>
        </>
      )}
    </Menu>
  )

  function AnonymousUserToolBar(props) {
    return (
      <>
        <div className={classes.sectionDesktop}>
          {/* <IconButton aria-label="show 4 new mails" color="inherit">
            <Badge badgeContent={4} color="secondary">
              <MailIcon />
            </Badge>
          </IconButton>
          <IconButton aria-label="show 17 new notifications" color="inherit">
            <Badge badgeContent={17} color="secondary">
              <NotificationsIcon />
            </Badge>
          </IconButton> */}
          <Button component={MenuItemLink} to="/signin" edge="end">
            Sign in
          </Button>
        </div>
        <div className={classes.sectionMobile}>
          <IconButton
            aria-label="show more"
            aria-controls={mobileMenuId}
            aria-haspopup="true"
            onClick={handleMobileMenuOpen}
            color="inherit"
          >
            <MoreIcon />
          </IconButton>
        </div>
        {renderMobileMenu(true)}
      </>
    )
  }

  if (loading) return <ToolBarMenuSkeleton></ToolBarMenuSkeleton>

  if (error) return <ErrorPage></ErrorPage>
  //viewer = null means no user is logged in.
  if (data.viewer === null) return <AnonymousUserToolBar></AnonymousUserToolBar>

  // viewer !== null means user is logged in.
  const { viewer } = data

  return (
    <>
      <div className={classes.sectionDesktop}>
        <IconButton aria-label="show 4 new mails" color="inherit">
          <Badge badgeContent={4} color="secondary">
            <MailIcon />
          </Badge>
        </IconButton>
        <IconButton aria-label="show 17 new notifications" color="inherit">
          <Badge badgeContent={17} color="secondary">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <IconButton
          edge="end"
          aria-label="account of current user"
          aria-controls={menuId}
          aria-haspopup="true"
          onClick={handleProfileMenuOpen}
          color="inherit"
        >
          <AccountCircle />
        </IconButton>
      </div>
      <div className={classes.sectionMobile}>
        <IconButton
          aria-label="show more"
          aria-controls={mobileMenuId}
          aria-haspopup="true"
          onClick={handleMobileMenuOpen}
          color="inherit"
        >
          <MoreIcon />
        </IconButton>
      </div>
      {renderMobileMenu(false)}
      {renderMenu(viewer)}
    </>
  )
}

export default ToolBarMenu
