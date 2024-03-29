import { Divider, IconButton, InputBase, Paper } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import SearchIcon from '@material-ui/icons/Search';
import { navigate } from 'gatsby';
import React from 'react';

const useStyles = makeStyles(theme => ({
  toolbar: {
    borderBottom: `1px solid ${theme.palette.divider}`
  },
  toolbarTitle: {
    flex: 1
  },
  searchRoot: {
    padding: '2px 4px',
    display: 'flex',
    alignItems: 'center',
    width: 'auto'
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1
  },
  iconButton: {
    padding: 10
  },
  divider: {
    height: 28,
    margin: 4
  }
}));

const TitleAndSearchToolbar = props => {
  const classes = useStyles();

  const {
    searchPhrase,
    setSearchPhrase,
    publicUsername,
    title,
    isBrand,
    lat,
    lng,
    handleClearSearch,
    isActive
  } = props;

  const shopSearch = `/shop/${publicUsername}/search/${searchPhrase}`;
  const brandSearch = `/brand/${publicUsername}/search/${searchPhrase}`;

  const handleSearch = () => {
    if (searchPhrase.replace(/\s/g, '').length > 1) {
      navigate(isBrand ? brandSearch : shopSearch);
    }
  };

  return (
    <Toolbar className={classes.toolbar}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={isActive ? 4 : 12}>
          <Typography
            variant='h5'
            color='inherit'
            align='center'
            noWrap
            className={classes.toolbarTitle}>
            {title}
          </Typography>
        </Grid>
        {isActive && (
          <>
            <Grid item xs={12} md={4}>
              <Paper className={classes.searchRoot}>
                <InputBase
                  className={classes.input}
                  value={searchPhrase}
                  onChange={e => setSearchPhrase(e.target.value)}
                  onKeyPress={e => e.key === 'Enter' && handleSearch()}
                  placeholder='Search Here'
                  inputProps={{ 'aria-label': 'search here' }}
                />
                <IconButton
                  onClick={handleClearSearch}
                  className={classes.iconButton}
                  aria-label='clear'>
                  <CloseIcon />
                </IconButton>
                <Divider className={classes.divider} orientation='vertical' />
                <IconButton
                  color='primary'
                  onClick={() => handleSearch()}
                  className={classes.iconButton}
                  aria-label='search'>
                  <SearchIcon />
                </IconButton>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              {!isBrand && (
                <Typography align='center'>
                  <a
                    href={`${process.env.GATSBY_G_MAP_URL}${lat},${lng}`}
                    target='_blank'
                    rel='noopener noreferrer'>
                    See this on map
                  </a>
                </Typography>
              )}
            </Grid>
          </>
        )}
      </Grid>
    </Toolbar>
  );
};

export default TitleAndSearchToolbar;
