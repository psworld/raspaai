import React from 'react';
import { Typography, Grid, Container, Button } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import { useQuery, useMutation } from 'react-apollo';
import { gql } from 'apollo-boost';
import SEO from '../../seo';
import Loading from '../../core/Loading';
import ErrorPage from '../../core/ErrorPage';
import Link from '../../core/Link';
import PaginationWithState from '../../templates/PaginationWithState';
import slugGenerator from '../../core/slugGenerator';
import ProductCollage from '../../templates/dashboard/ProductCollage';
import { emptyPageInfo } from '../../core/utils';

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
  mutation($comboId: String!) {
    deleteCombo(input: { clientMutationId: $comboId }) {
      clientMutationId
    }
  }
`;

const ComboGridItem = ({ shopComboNode, shopUsername, handleClickOpen }) => {
  const { id: comboId, name: comboName, thumbs, offeredPrice } = shopComboNode;

  const comboSlug = slugGenerator(comboName);
  return (
    <Grid key={comboId} item xs={6} sm={4} md={3} lg={2}>
      <Link to={`/shop/${shopUsername}/combo/${comboSlug}/${comboId}`}>
        <ProductCollage thumbs={thumbs} title={comboName}></ProductCollage>
        <Typography variant='body2'>{comboName}</Typography>
      </Link>
      <Typography
        variant='body2'
        style={{
          color: 'green'
        }}>
        &#8377; {offeredPrice}
      </Typography>

      <Button variant='contained' color='primary'>
        Edit
      </Button>
      <Button
        onClick={() => handleClickOpen(comboId)}
        variant='contained'
        color='secondary'>
        Delete
      </Button>
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

  const [
    deleteCombo,
    { loading, error, data: deleteComboData, called }
  ] = useMutation(DELETE_COMBO, {
    onCompleted() {
      handleClose();
    },
    update(
      cache,
      {
        data: {
          deleteCombo: { clientMutationId: deletedComboId }
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

  if (data.shopCombos.pageInfo.startCursor) {
    const {
      shopCombos: { edges: shopComboEdges, shop }
    } = data;

    return (
      <Container>
        <Grid container spacing={1}>
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
      </Container>
    );
  }
  if (phrase) {
    return (
      <Typography align='center' style={{ margin: 4 }} variant='h5'>
        No results found for - <b>{phrase}</b>
      </Typography>
    );
  }
  return (
    <>
      <Typography variant='h5' style={{ marginTop: 20 }} align='center'>
        You do not have any combos in your shop.
      </Typography>
      <br></br>
      <Typography
        variant='h5'
        component={Link}
        to={`${window.location.pathname}/create`}>
        Create Combo
      </Typography>
    </>
  );
};

const MyCombos = ({ shopUsername, phrase }) => {
  const { loading, error, data, fetchMore } = useQuery(SHOP_COMBOS, {
    variables: { shopUsername, phrase }
  });

  return (
    <>
      <SEO title='Combos'></SEO>
      {loading && <Loading></Loading>}
      {error && <ErrorPage></ErrorPage>}
      {data && (
        <ComboGrid
          shopUsername={shopUsername}
          fetchMore={fetchMore}
          phrase={phrase}
          data={data}></ComboGrid>
      )}
    </>
  );
};

export default MyCombos;
