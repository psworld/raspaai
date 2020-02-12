import { Box, Button, Grid, Typography, ListItem } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { gql } from 'apollo-boost';
import React from 'react';
import { useMutation, useQuery } from 'react-apollo';
import ErrorPage from '../../../core/ErrorPage';
import Link from '../../../core/Link';
import { emptyPageInfo, slugGenerator } from '../../../core/utils';
import SEO from '../../../seo';
import ProductGridSkeleton from '../../../skeletons/ProductGridSkeleton';
import ProductCollage from '../../../templates/dashboard/ProductCollage';
import SearchBar from '../../../templates/dashboard/SearchBar';
import PaginationWithState from '../../../templates/PaginationWithState';

export const SHOP_COMBOS = gql`
  query(
    $shopUsername: String!
    $phrase: String
    $endCursor: String
    $withShop: Boolean = false
  ) {
    shopCombos(
      publicShopUsername: $shopUsername
      phrase: $phrase
      first: 10
      after: $endCursor
    ) @connection(key: "shopCombos", filter: ["publicShopUsername", "phrase"]) {
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      shop @include(if: $withShop) {
        id
        properties {
          title
          publicUsername
        }
      }
      count
      edges {
        node {
          id
          offeredPrice
          name
          thumbs
          isAvailable
        }
      }
    }
  }
`;

const ConfirmationDialog = ({
  handleClose,
  handleContinue,
  isOpen,
  title,
  content,
  cancelText,
  continueText,
  disabled,
  variables
}) => {
  // the handleContinue should be pre configured
  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      aria-labelledby='alert-dialog-title'
      aria-describedby='alert-dialog-description'>
      <DialogTitle id='alert-dialog-title'>
        {title ? title : 'Confirm your action ?'}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id='alert-dialog-description'>
          {content ? content : 'Click continue to proceed with action.'}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button disabled={disabled} onClick={handleClose} color='primary'>
          {cancelText ? cancelText : 'Cancel'}
        </Button>
        <Button
          disabled={disabled}
          onClick={() => handleContinue({ variables: { ...variables } })}
          color='primary'
          autoFocus>
          {continueText ? continueText : 'Continue'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const DELETE_COMBO = gql`
  mutation($comboId: ID!) {
    deleteCombo(input: { comboId: $comboId }) {
      deletedComboId
    }
  }
`;

const ComboGridItem = ({ shopComboNode, shopUsername, handleClickOpen }) => {
  const { id: comboId, name: comboName, thumbs, offeredPrice } = shopComboNode;

  const [newOfferedPrice, setNewOfferedPrice] = React.useState(offeredPrice);

  const handleChange = e => {
    let value = e.target.value;
    try {
      value = parseInt(value);
      setNewOfferedPrice(value);
    } catch {}
  };

  // const validChanges = () => {
  //   if (Number.isInteger(newOfferedPrice)) {
  //     if (
  //       (newOfferedPrice === offeredPrice && newInStock === inStock) ||
  //       newOfferedPrice > mrp
  //     ) {
  //       return false;
  //     }

  //     return true;
  //   } else return false;
  // };

  const comboSlug = slugGenerator(comboName);
  return (
    <Grid key={comboId} item xs={6} sm={4} md={3} lg={2}>
      <Box width='100%' px={1} my={2}>
        <Link to={`/shop/${shopUsername}/combo/${comboSlug}/${comboId}`}>
          <ProductCollage thumbs={thumbs} title={comboName}></ProductCollage>
          <Typography variant='body2'>{comboName}</Typography>
        </Link>

        <Typography style={{ color: 'green' }} variant='h6'>
          &#8377; {offeredPrice}
        </Typography>
        {/* <TextField
          onChange={handleChange}
          placeholder={'Offered Price'}
          id='newOfferedPrice'
          value={newOfferedPrice}
          name='newOfferedPrice'
          type='number'
          margin='dense'
          variant='outlined'
          InputProps={{
            startAdornment: (
              <InputAdornment position='start' style={{ color: 'green' }}>
                &#8377;
              </InputAdornment>
            )
          }}
          InputLabelProps={{
            shrink: true
          }}
        /> */}

        {/* <Button variant='contained' color='primary'>
          Edit
        </Button> */}
        <Grid container spacing={1}>
          <Grid item xs={6} md={6}>
            <Button
              onClick={() => handleClickOpen(comboId)}
              variant='contained'
              color='secondary'>
              Delete
            </Button>
          </Grid>
          <Grid item xs={6} md={6}>
            <Button
              variant='contained'
              color='primary'
              component={Link}
              to={`${window.location.pathname}/edit/${comboId}`}>
              Edit
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Grid>
  );
};

const ComboGrid = ({ data, phrase, fetchMore, shopUsername }) => {
  const [confirmationDialogOpen, setConfirmationDialogOpen] = React.useState(
    false
  );

  const [
    deleteComboMutationVariables,
    setDeleteComboMutationVariables
  ] = React.useState({});

  const handleClickOpen = comboId => {
    setDeleteComboMutationVariables({ comboId });
    setConfirmationDialogOpen(true);
  };

  const handleClose = () => {
    setConfirmationDialogOpen(false);
  };

  const [deleteCombo, { loading }] = useMutation(DELETE_COMBO, {
    onCompleted() {
      handleClose();
    },
    update(
      cache,
      {
        data: {
          deleteCombo: { deletedComboId }
        }
      }
    ) {
      const { shopCombos } = cache.readQuery({
        query: SHOP_COMBOS,
        variables: { shopUsername: shopUsername }
      });

      const newShopComboEdges = shopCombos.edges.filter(
        shopCombo => shopCombo.node.id !== deletedComboId
      );

      if (newShopComboEdges.length > 0) {
        cache.writeQuery({
          query: SHOP_COMBOS,
          variables: { shopUsername: shopUsername },
          data: { shopCombos: { ...shopCombos, edges: newShopComboEdges } }
        });
      } else {
        cache.writeQuery({
          query: SHOP_COMBOS,
          variables: { shopUsername: shopUsername },
          data: {
            shopCombos: {
              ...shopCombos,
              edges: [],
              pageInfo: emptyPageInfo
            }
          }
        });
      }
    }
  });

  const {
    shopCombos: { edges: shopComboEdges, shop }
  } = data;

  return (
    <Grid container>
      {shopComboEdges.map(shopCombo => {
        return (
          <ComboGridItem
            key={shopCombo.node.id}
            shopUsername={shopUsername}
            handleClickOpen={handleClickOpen}
            shopComboNode={shopCombo.node}
            shop={shop}></ComboGridItem>
        );
      })}
      {/* Confirmation dialog */}

      <ConfirmationDialog
        isOpen={confirmationDialogOpen}
        title='Are you sure to delete this combo ?'
        disabled={loading}
        handleClose={handleClose}
        handleContinue={deleteCombo}
        variables={deleteComboMutationVariables}></ConfirmationDialog>

      <br></br>
      <br></br>
      <PaginationWithState
        fetchMore={fetchMore}
        pageInfo={data.shopCombos.pageInfo}></PaginationWithState>
    </Grid>
  );
};

const MyCombos = ({ shopUsername, phrase }) => {
  const { loading, error, data, fetchMore } = useQuery(SHOP_COMBOS, {
    variables: { shopUsername, phrase }
  });

  if (loading) return <ProductGridSkeleton></ProductGridSkeleton>;
  if (error) return <ErrorPage></ErrorPage>;
  if (data && data.shopCombos.pageInfo.startCursor) {
    let addNewUrl = `${window.location.pathname}`;
    if (addNewUrl.includes('/search')) {
      addNewUrl = addNewUrl.split('/search')[0];
    }
    return (
      <>
        <SEO title='Combos'></SEO>
        <br></br>
        <center>
          <Button
            component={Link}
            to={`${addNewUrl}/create`}
            variant='contained'
            color='primary'>
            Add new Combos
          </Button>
        </center>
        <br></br>
        <SearchBar
          placeholder='Search your combos'
          defaultPhrase={phrase}
          searchUrlBase={window.location.pathname}></SearchBar>
        <br></br>
        <ComboGrid
          shopUsername={shopUsername}
          fetchMore={fetchMore}
          phrase={phrase}
          data={data}></ComboGrid>
      </>
    );
  }
  if (phrase) {
    return (
      <>
        <br></br>
        <SearchBar
          placeholder='Search your combos'
          defaultPhrase={phrase}
          searchUrlBase={window.location.pathname}></SearchBar>
        <br></br>
        <Typography align='center' style={{ margin: 4 }} variant='h5'>
          No results found for - <b>{phrase}</b>
        </Typography>
      </>
    );
  }
  return (
    <>
      <Typography variant='h5' style={{ marginTop: 20 }} align='center'>
        You do not have any combos in your shop.
      </Typography>
      <br></br>
      <center>
        <Typography
          variant='h5'
          component={Link}
          to={`${window.location.pathname}/create`}>
          Create Combo
        </Typography>
      </center>
    </>
  );
};

export default MyCombos;
