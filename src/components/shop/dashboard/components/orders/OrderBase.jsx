import React from 'react';
import {
  Typography,
  Collapse,
  Paper,
  Grid,
  ListItem,
  Divider,
  Button,
  Container,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  IconButton,
  InputBase,
  List,
  ListItemText
} from '@material-ui/core';
import gql from 'graphql-tag';
import { useQuery, useMutation } from 'react-apollo';
import { VIEWER } from '../../../../navbar/ToolBarMenu';

import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import SearchIcon from '@material-ui/icons/Search';
import CloseIcon from '@material-ui/icons/Close';

import { yellow, green } from '@material-ui/core/colors';
import Link from '../../../../core/Link';
import ProductThumb from '../../../../templates/ProductThumb';
import { makeStyles } from '@material-ui/core/styles';
import Loading from '../../../../core/Loading';
import ResponseSnackbar from './ResponseSnackbar';
import PaginationWithState from '../../../../templates/PaginationWithState';
import ProductCollage from '../../../../templates/dashboard/ProductCollage';
import { slugGenerator } from '../../../../core/utils';

const useStyles = makeStyles(theme => ({
  order: {
    backgroundColor: theme.palette.grey[100],
    width: '100%',
    padding: theme.spacing(2)
  },
  orderItem: {
    backgroundColor: theme.palette.grey[50],
    width: '100%',
    // padding: theme.spacing(1),
    marginBottom: theme.spacing(1)
  },
  nested: {
    paddingLeft: theme.spacing(2)
  },
  grey: {
    backgroundColor: theme.palette.grey[100],
    marginBottom: theme.spacing(2)
  },
  address: {
    paddingBottom: theme.spacing(3)
  },
  searchRoot: {
    padding: '2px 4px',
    display: 'flex',
    alignItems: 'center',
    width: 400
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

export const SHOP_ORDERS = gql`
  query(
    $shopId: ID!
    $status: String!
    $endCursor: String
    $shopOrderTrackingId: String
  ) {
    shopOrders(
      shop: $shopId
      status: $status
      after: $endCursor
      first: 10
      orderBy: "order__created"
      clientTrackingId: $shopOrderTrackingId
    ) @connection(key: "shopOrders", filter: ["status", "shop"]) {
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      edges {
        node {
          id
          status
          clientTrackingId
          total
          totalItems
          order {
            id
            created
            userFullName
            userPhone
            user {
              id
              email
            }
          }
          orderItems {
            edges {
              node {
                id
                productTitle
                quantity
                unitPrice
                combo {
                  id
                  thumbs
                }
                shopProduct {
                  id
                  product {
                    id
                    thumb
                    brand {
                      id
                      publicUsername
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;
export const MODIFY_ORDER_STATUS = gql`
  mutation($shopOrderId: ID!, $shopId: ID!, $status: String!) {
    modifyOrderStatus(
      input: { shopOrderId: $shopOrderId, shopId: $shopId, status: $status }
    ) {
      shopOrder {
        id
        status
      }
    }
  }
`;

export const OrderItem = ({
  orderItemNode,
  classes,
  shopUsername,
  shopName
}) => {
  const {
    productTitle,
    shopProduct,
    combo,
    quantity,
    unitPrice
  } = orderItemNode;

  // available if the shopProduct or combo is not deleted in db for which orderItem is created.
  // we do not allow orderItem to deleted for now. But shopProduct or combo
  // can be deleted.
  const available = shopProduct || combo;

  const isCombo = available && shopProduct ? false : true;

  const productSlug = slugGenerator(productTitle);

  if (shopProduct) {
    var {
      id: shopProductId,
      product: {
        thumb,
        brand: { publicUsername: brandPublicUsername }
      }
    } = shopProduct;
  } else if (combo) {
    var { id: comboId, thumbs } = combo;
  }

  const productUrl = isCombo
    ? `/shop/${shopUsername}/combo/${productSlug}/${comboId}`
    : `/shop/${shopUsername}/product/${productSlug}/${shopProductId}`;

  return (
    <Grid container>
      <Grid item xs={2} sm={2} md={1}>
        {available && (
          <Link to={productUrl}>
            {isCombo ? (
              <ProductCollage
                thumbs={thumbs}
                title={productTitle}></ProductCollage>
            ) : (
              <ProductThumb
                src={thumb}
                alt={productTitle}
                title={productTitle}></ProductThumb>
            )}
          </Link>
        )}
      </Grid>
      <Grid item xs={9} sm={9} md={10}>
        <div style={{ paddingLeft: 6 }}>
          {available && (
            <Typography component={Link} to={productUrl} variant='subtitle1'>
              {productTitle.substring(0, 60)}
              {productTitle.length > 60 && '...'}
            </Typography>
          )}
          {!available && (
            <Typography variant='subtitle1'>
              {productTitle.substring(0, 60)}
              {productTitle.length > 60 && '...'}
            </Typography>
          )}
          <br></br>
          <Typography variant='caption'>
            {available ? (
              <>
                {!isCombo && (
                  <>
                    By{' '}
                    <Link to={`/brand/${brandPublicUsername}`}>
                      {brandPublicUsername}
                    </Link>
                  </>
                )}
              </>
            ) : (
              <>This product was deleted.</>
            )}
          </Typography>
          <Grid container>
            <Grid item xs={4} md={4}>
              <Typography>Quantity: {quantity}</Typography>
            </Grid>
            <Grid item xs={4} md={4}></Grid>
            <Grid item xs={4}>
              <Typography variant='h6' style={{ color: green[800] }}>
                &#x20b9; {unitPrice}
              </Typography>
            </Grid>
          </Grid>
        </div>
      </Grid>
    </Grid>
  );
};

export const ShopOrder = ({
  shopOrderNode,
  shopId,
  shopUsername,
  shopName,
  currentShopOrderStatus,
  setShowResponseSnackbar
}) => {
  const classes = useStyles();
  const {
    id: shopOrderId,
    clientTrackingId: shopOrderTrackingId,
    total,
    totalItems,
    order: {
      created: dateStr,
      userFullName,
      userPhone,
      user: { email: userEmail }
    },
    orderItems: { edges: orderItems }
  } = shopOrderNode;

  // Formatting date and time
  const dateObj = new Date(dateStr);
  const date = `${dateObj.getDate()} ${dateObj.toLocaleString('default', {
    month: 'short'
  })}`;
  const orderPlacedTime = dateObj.toLocaleTimeString('default', {
    timeStyle: 'short'
  });

  // For collapse and show
  const [open, setOpen] = React.useState(false);

  const handleClick = () => {
    setOpen(!open);
  };

  // The confirmation screen
  const [confirmationDialog, setConfirmationDialog] = React.useState({
    isOpen: false,
    action: false
  });

  function handleClickOpen(action) {
    setConfirmationDialog({ isOpen: true, action });
  }

  function handleClose() {
    setConfirmationDialog({ ...confirmationDialog, isOpen: false });
  }

  // Mutation for changing order statuses
  const [modifyOrderStatus, { loading, error, data }] = useMutation(
    MODIFY_ORDER_STATUS,
    {
      variables: { shopOrderId, shopId },
      update: (
        store,
        {
          data: {
            modifyOrderStatus: {
              shopOrder: { status: newStatus }
            }
          }
        }
      ) => {
        const { shopOrders: oldStatusShopOrders } = store.readQuery({
          query: SHOP_ORDERS,
          variables: {
            shopId,
            status: currentShopOrderStatus
          }
        });

        // getting the shop order whose status has been changed
        const statusChangedShopOrder = oldStatusShopOrders.edges.find(
          e => e.node.id === shopOrderId
        );

        // removing the order whose status has been changed, from the old status order list
        store.writeQuery({
          query: SHOP_ORDERS,
          variables: {
            shopId,
            status: currentShopOrderStatus
          },
          data: {
            shopOrders: {
              ...oldStatusShopOrders,
              edges: oldStatusShopOrders.edges.filter(
                e => e.node.id !== shopOrderId
              )
            }
          }
        });

        try {
          const { shopOrders: newStatusShopOrders } = store.readQuery({
            query: SHOP_ORDERS,
            variables: {
              shopId,
              status: newStatus.toLowerCase()
            }
          });
          store.writeQuery({
            query: SHOP_ORDERS,
            variables: {
              shopId,
              status: newStatus.toLowerCase()
            },
            data: {
              shopOrders: {
                ...newStatusShopOrders,
                edges: [statusChangedShopOrder, ...newStatusShopOrders.edges]
              }
            }
          });
        } catch (e) {}
      },
      onCompleted: () => handleClose() & setShowResponseSnackbar(true)
    }
  );

  const ConfirmationDialog = ({ title, content, status }) => (
    <>
      <DialogTitle id='alert-dialog-title'>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText id='alert-dialog-description'>
          {content}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color='secondary'>
          Cancel
        </Button>
        <Button
          disabled={loading}
          onClick={() =>
            modifyOrderStatus({
              variables: { status }
            })
          }
          color='primary'
          autoFocus>
          Confirm
        </Button>
      </DialogActions>
    </>
  );

  const getButtonText = status => {
    switch (status) {
      case 'fulfilled':
        return 'Order delivered';

      case 'unfulfilled':
        return 'Pending order';

      case 'canceled':
        return 'Cancel order';

      default:
        break;
    }
  };

  const getButtonColor = status => {
    switch (status) {
      case 'fulfilled':
        return green[700];

      case 'unfulfilled':
        return yellow[900];

      default:
        break;
    }
  };

  // Actions a user can take on current shop order based on its status
  const all_actions = ['fulfilled', 'unfulfilled', 'canceled'];
  const availableActions = all_actions.filter(
    e => e !== currentShopOrderStatus
  );

  return (
    <>
      <ListItem button onClick={handleClick}>
        <Grid container>
          <Grid item xs={3} md={3}>
            <Typography variant='subtitle2'>Placed</Typography>
            <Typography style={{ color: green[600] }} variant='caption'>
              {orderPlacedTime}
            </Typography>
            <br></br>
            <Typography style={{ color: green[600] }} variant='caption'>
              {date}
            </Typography>
          </Grid>
          <Grid item xs={3} md={3}>
            <Typography variant='subtitle2'>Buyer</Typography>
            <Typography variant='caption'>{userFullName}</Typography>
          </Grid>
          <Grid item xs={3} md={3}>
            <Typography variant='subtitle2'>
              Total ({totalItems} items)
            </Typography>
            <Typography
              align='center'
              style={{ color: green[600] }}
              variant='caption'>
              &#x20b9;{total}
            </Typography>
          </Grid>
          <Grid item xs={3} md={3}>
            <Typography variant='subtitle2'>Tracking id</Typography>
            <Typography color='primary' variant='caption'>
              {shopOrderTrackingId}
            </Typography>
          </Grid>
        </Grid>
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItem>
      <Collapse in={open} timeout='auto'>
        {orderItems.map(orderItem => {
          const orderItemNode = orderItem.node;
          return (
            <Paper key={orderItemNode.id} className={classes.orderItem}>
              <OrderItem
                orderItemNode={orderItemNode}
                classes={classes}
                shopUsername={shopUsername}
                shopName={shopName}></OrderItem>
            </Paper>
          );
        })}
        <Container maxWidth='md'>
          <Typography variant='h6' align='center'>
            Buyer details
          </Typography>
          <List>
            <Grid container>
              <Grid item xs={12} md={6}>
                <ListItem>
                  <ListItemText
                    primary='Name'
                    secondary={userFullName}></ListItemText>
                </ListItem>
              </Grid>
              <Grid item xs={12} md={6}>
                <ListItem>
                  <ListItemText
                    primary='Phone'
                    secondary={
                      <a href={`tel:+91${userPhone}`}>{userPhone}</a>
                    }></ListItemText>
                </ListItem>
              </Grid>
              <Grid item xs={12} md={6}>
                <ListItem>
                  <ListItemText
                    primary='Email'
                    secondary={userEmail}></ListItemText>
                </ListItem>
              </Grid>
            </Grid>
          </List>
          <Grid container spacing={3}>
            {availableActions.map(action => (
              <Grid key={action} item xs={6} md={6}>
                <Button
                  style={{ color: getButtonColor(action) }}
                  color={action === 'canceled' ? 'secondary' : 'inherit'}
                  onClick={() => handleClickOpen(action)}>
                  {getButtonText(action)}
                </Button>
              </Grid>
            ))}
          </Grid>
        </Container>
        <Dialog
          open={confirmationDialog.isOpen}
          onClose={handleClose}
          aria-labelledby='alert-dialog-title'
          aria-describedby='alert-dialog-description'>
          {confirmationDialog.action === 'fulfilled' && (
            <ConfirmationDialog
              title={'This order is delivered ?'}
              content={'This order has been delivered and fulfilled.'}
              status={confirmationDialog.action}></ConfirmationDialog>
          )}
          {confirmationDialog.action === 'unfulfilled' && (
            <ConfirmationDialog
              title={'This order is pending ?'}
              content={'This order is pending and unfulfilled.'}
              status={confirmationDialog.action}></ConfirmationDialog>
          )}
          {confirmationDialog.action === 'canceled' && (
            <ConfirmationDialog
              title={'Cancel this order ?'}
              status={confirmationDialog.action}></ConfirmationDialog>
          )}
        </Dialog>
      </Collapse>
      <Divider></Divider>
    </>
  );
};

const OrderBase = ({ status }) => {
  const {
    data: {
      viewer: {
        shop: {
          id: shopId,
          properties: { title: shopName, publicUsername: shopUsername }
        }
      }
    }
  } = useQuery(VIEWER);

  const [search, setSearch] = React.useState({
    phrase: '',
    shopOrderTrackingId: null
  });

  const { phrase, shopOrderTrackingId } = search;

  const { loading, error, data, fetchMore } = useQuery(SHOP_ORDERS, {
    variables: {
      shopId,
      status,
      shopOrderTrackingId
    }
  });

  const handleSearch = () => {
    if (phrase.length === 6 || phrase.length === 7) {
      if (phrase.includes === '-') {
        setSearch({ ...search, shopOrderTrackingId: phrase });
      } else {
        const goodSearchPhrase =
          phrase.substring(0, 3) + '-' + phrase.substring(3);

        setSearch({ ...search, shopOrderTrackingId: goodSearchPhrase });
      }
    } else if (phrase.length === 0) {
      setSearch({ ...search, shopOrderTrackingId: null });
    }
  };

  const handleClearSearch = () => {
    setSearch({ ...search, phrase: '', shopOrderTrackingId: null });
  };

  const [showResponseSnackbar, setShowResponseSnackbar] = React.useState(false);

  const classes = useStyles();
  const handleResponseSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setShowResponseSnackbar(false);
  };

  if (data) {
    var {
      shopOrders: { pageInfo, edges: shopOrdersEdges }
    } = data;
  }

  return (
    <>
      <ResponseSnackbar
        open={showResponseSnackbar}
        handleClose={handleResponseSnackbarClose}
        variant='success'
        message='Status changed successfully'></ResponseSnackbar>
      {shopOrdersEdges && shopOrdersEdges.length !== 0 && (
        <Paper className={classes.searchRoot}>
          <InputBase
            className={classes.input}
            value={phrase}
            onChange={e => setSearch({ ...search, phrase: e.target.value })}
            onKeyPress={e => e.key === 'Enter' && handleSearch()}
            placeholder='Search Tracking Id'
            inputProps={{ 'aria-label': 'search tracking id' }}
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
            aria-label='directions'>
            <SearchIcon />
          </IconButton>
        </Paper>
      )}
      {loading && (
        <>
          <br></br>
          <Loading></Loading>
        </>
      )}
      <br></br>
      <br></br>
      {shopOrdersEdges && shopOrdersEdges.length === 0 && (
        <Typography align='center' variant='h5'>
          There are no orders here.
        </Typography>
      )}
      {shopOrdersEdges &&
        shopOrdersEdges.map(shopOrderNodeObj => {
          return (
            <ShopOrder
              key={shopOrderNodeObj.node.id}
              currentShopOrderStatus={status}
              setShowResponseSnackbar={setShowResponseSnackbar}
              shopId={shopId}
              shopUsername={shopUsername}
              shopName={shopName}
              shopOrderNode={shopOrderNodeObj.node}></ShopOrder>
          );
        })}

      {shopOrdersEdges && shopOrdersEdges.length !== 0 && (
        <PaginationWithState
          fetchMore={fetchMore}
          pageInfo={pageInfo}></PaginationWithState>
      )}
    </>
  );
};

export default OrderBase;
