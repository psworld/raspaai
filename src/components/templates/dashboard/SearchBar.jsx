import React from 'react';
import { navigate } from 'gatsby';

import SearchIcon from '@material-ui/icons/Search';
import { Paper, InputBase, Divider, IconButton } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
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

const SearchBar = props => {
  const classes = useStyles();

  let {
    searchUrlBase = '',
    placeholder = 'Search products ...',
    defaultPhrase
  } = props;
  // searchUrlBase is windows.pathname from that page
  const [searchPhrase, setSearchPhrase] = React.useState(
    defaultPhrase ? defaultPhrase : ''
  );

  if (searchUrlBase.includes('/search/')) {
    searchUrlBase = searchUrlBase.split('/search')[0];
  }
  const searchUrl = `${searchUrlBase}/search/${searchPhrase}`;

  const handleSearch = () => {
    if (searchPhrase.replace(/\s/g, '').length > 1) {
      navigate(searchUrl);
    }
  };

  // const handleClearSearch = () => {}
  return (
    <Paper className={classes.searchRoot}>
      <InputBase
        className={classes.input}
        value={searchPhrase}
        onChange={e => setSearchPhrase(e.target.value)}
        onKeyPress={e => e.key === 'Enter' && handleSearch()}
        placeholder={placeholder}
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
  );
};

export default SearchBar;
