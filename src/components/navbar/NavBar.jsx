import React from "react"
import { fade, makeStyles } from "@material-ui/core/styles"
import AppBar from "@material-ui/core/AppBar"
import Toolbar from "@material-ui/core/Toolbar"
import IconButton from "@material-ui/core/IconButton"
import Typography from "@material-ui/core/Typography"
import InputBase from "@material-ui/core/InputBase"

import MenuIcon from "@material-ui/icons/Menu"
import SearchIcon from "@material-ui/icons/Search"
import ToolBarMenu from "./ToolBarMenu"
import Link from "../core/Link"
import { useQuery } from "react-apollo"
import { LOCAL_SAVED_LOCATION } from "../../pages"
import { navigate } from "gatsby"

const useStyles = makeStyles(theme => ({
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    display: "none",
    [theme.breakpoints.up("sm")]: {
      display: "block",
    },
  },
  search: {
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    "&:hover": {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      marginLeft: theme.spacing(3),
      width: "auto",
    },
  },
  searchIcon: {
    width: theme.spacing(7),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  inputRoot: {
    color: "inherit",
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 1),
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: 200,
    },
  },
}))

export default function NavBar() {
  const classes = useStyles()
  const { data: localSavedLocationData } = useQuery(LOCAL_SAVED_LOCATION)

  const [phrase, setPhrase] = React.useState("")
  if (localSavedLocationData && localSavedLocationData.localSavedLocation) {
    var { lat, lng } = JSON.parse(
      atob(localSavedLocationData.localSavedLocation)
    )
  }
  return (
    <div className={classes.grow}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="open drawer"
          >
            <MenuIcon />
          </IconButton>
          {/* <Link to="/"> */}
          <Typography
            component={Link}
            to="/"
            className={classes.title}
            variant="h6"
            noWrap
          >
            Raspaai
          </Typography>

          <div className={classes.search}>
            <InputBase
              placeholder="Search…"
              onChange={e => setPhrase(e.target.value)}
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput,
              }}
              inputProps={{ "aria-label": "search" }}
              onKeyPress={e => {
                if (phrase.replace(/\s/g, "").length > 1 && e.key === "Enter") {
                  navigate(`/search/${phrase}/pg/1/@/${lat}/${lng}`)
                }
              }}
            />
          </div>
          <SearchIcon
            onClick={() =>
              phrase.replace(/\s/g, "").length > 1 &&
              navigate(`/search/${phrase}/pg/1/@/${lat}/${lng}`)
            }
          />
          <div className={classes.grow} />
          <ToolBarMenu></ToolBarMenu>
        </Toolbar>
      </AppBar>
    </div>
  )
}
