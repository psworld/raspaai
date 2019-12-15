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

  const {
    publicUsername,
    isBrand = false,
    isAddNewShopProductSearch = false
  } = props;

  const [searchPhrase, setSearchPhrase] = React.useState('');

  const shopSearch = `/dashboard/shop/${publicUsername}/products/search/${searchPhrase}`;
  const brandSearch = `/dashboard/brand/${publicUsername}/products/search/${searchPhrase}`;
  const addNewShopProductSearch = `/dashboard/shop/${publicUsername}/products/add/search/${searchPhrase}`;

  const placeholder = isAddNewShopProductSearch
    ? 'Search products to add them to your shop ...'
    : 'Search products ...';

  const handleSearch = () => {
    if (searchPhrase.replace(/\s/g, '').length > 1) {
      navigate(
        isAddNewShopProductSearch
          ? addNewShopProductSearch
          : isBrand
          ? brandSearch
          : shopSearch
      );
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
