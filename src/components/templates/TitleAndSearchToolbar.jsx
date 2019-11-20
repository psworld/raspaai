import React from "react"

import { makeStyles } from "@material-ui/core/styles"
import Toolbar from "@material-ui/core/Toolbar"
import Typography from "@material-ui/core/Typography"
import SearchIcon from "@material-ui/icons/Search"
import Grid from "@material-ui/core/Grid"
import Box from "@material-ui/core/Box"
import TextField from "@material-ui/core/TextField"

import { navigate } from "gatsby"

const useStyles = makeStyles(theme => ({
  toolbar: {
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  toolbarTitle: {
    flex: 1,
  },
}))

const TitleAndSearchToolbar = props => {
  const classes = useStyles()

  const {
    searchPhrase,
    setSearchPhrase,
    publicUsername,
    title,
    isBrand,
    lat,
    lng,
  } = props

  const shopSearch = `/shop/${publicUsername}/search/${searchPhrase}`
  const brandSearch = `/brand/${publicUsername}/search/${searchPhrase}`
  return (
    <Toolbar className={classes.toolbar}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <Typography
            variant="h5"
            color="inherit"
            align="center"
            noWrap
            className={classes.toolbarTitle}
          >
            {title}
          </Typography>
        </Grid>
        <Grid item xs={12} md={4}>
          {/* <div className={classes.search}> */}
          <Box width={250} height={56} mx="auto">
            <TextField
              onChange={e => setSearchPhrase(e.target.value)}
              defaultValue={""}
              onKeyPress={e => {
                if (
                  searchPhrase.replace(/\s/g, "").length > 1 &&
                  e.key === "Enter"
                ) {
                  navigate(isBrand ? brandSearch : shopSearch)
                }
              }}
              id="outlined-full-width"
              // style={{ margin: 8 }}
              placeholder={isBrand ? "Search here" : "Search in this shop"}
              style={{ maxWidth: "100%" }}
              margin="none"
              variant="outlined"
              InputLabelProps={{
                shrink: true,
              }}
            />
            {/* </div> */}
            <SearchIcon
              style={{ marginTop: 16, marginLeft: 1 }}
              onClick={() =>
                searchPhrase.replace(/\s/g, "").length > 1 &&
                navigate(isBrand ? brandSearch : shopSearch)
              }
            />
          </Box>
        </Grid>
        <Grid item xs={12} md={4}>
          {!isBrand && (
            <Typography align="center">
              <a
                href={`${process.env.GATSBY_G_MAP_URL}${lat},${lng}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                See this on map
              </a>
            </Typography>
          )}
        </Grid>
      </Grid>
    </Toolbar>
  )
}

export default TitleAndSearchToolbar
