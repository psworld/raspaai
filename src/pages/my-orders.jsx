import React from 'react';
import Layout from '../components/layout';
import {
  Typography,
  Container,
  ListItem,
  Grid,
  List,
  Paper,
  Collapse,
  Divider,
  Button
} from '@material-ui/core';
import SEO from '../components/seo';
import gql from 'graphql-tag';
import { useQuery } from 'react-apollo';
import ErrorPage from '../components/core/ErrorPage';
import Loading from '../components/core/Loading';
import { makeStyles } from '@material-ui/core/styles';
import { green, yellow } from '@material-ui/core/colors';

import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import ProductThumb from '../components/templates/ProductThumb';
import Link from '../components/core/Link';
import slugGenerator from '../components/core/slugGenerator';
import UserCheck from '../components/core/UserCheck';
import PaginationWithState from '../components/templates/PaginationWithState';

export const MY_ORDERS = gql`
  query($userId: ID!, $endCursor: String) {
    userOrders(user: $userId, after: $endCursor, first: 5, orderBy: "-created")
      @connection(key: "userOrders", filter: ["user"]) {
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      edges {
        node {
          id
          created
          referenceId
          user {
            email
          }
          status
          userPhone
          userFullName
          total
          totalItems
          shopOrders {
            edges {
              node {
                id
                totalItems
                status
                shop {
                  id
                  geometry {
                    coordinates
                  }
                  properties {
                    publicUsername
                    title
                    address
                  }
                }
                clientTrackingId
                total
                orderItems {
                  edges {
                    node {
                      id
                      productTitle
                      item {
                        id
                        product {
                          id
                          thumb
                        }
                      }
                      quantity
                      unitPrice
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

const useStyles = makeStyles(theme => ({
  order: {
    backgroundColor: theme.palette.grey[100],
    width: '100%',
    padding: theme.spacing(2)
  },
  orderItem: {
    backgroundColor: theme.palette.grey[50],
    width: '100%',
    padding: theme.spacing(1),
    marginBottom: theme.spacing(2)
  },
  nested: {
    paddingLeft: theme.spacing(2)
  },
  grey: {
    backgroundColor: theme.palette.grey[100],
    marginBottom: theme.spacing(2)
  },
  address: {
    paddingBottom: theme.spacing(3),
    paddingRight: theme.spacing(1)
  }
}));

const getReadableStatus = status => {
  switch (status) {
    case 'UNFULFILLED':
      return 'Pending';
    case 'FULFILLED':
      return 'Delivered';
    case 'PARTIALLY_FULFILLED':
      return 'Partially fulfilled';
    case 'CANCELED':
      return 'Canceled';
    default:
      break;
  }
};

const getStatusColor = status => {
  switch (status) {
    case 'UNFULFILLED':
      return yellow[900];
    case 'FULFILLED':
      return 'green';
    case 'PARTIALLY_FULFILLED':
      return 'blue';
    case 'CANCELED':
      return 'red';
    default:
      return 'inherit';
  }
};

const OrderItem = ({ orderItemObj, classes, shopUsername, shopName }) => {
  const {
    productTitle,
    item: {
      id: shopProductId,
      product: { thumb }
    },
    quantity,
    unitPrice
  } = orderItemObj.node;

  const productSlug = slugGenerator(productTitle);
  return (
    <Grid container>
      <Grid item xs={3} sm={3} md={2}>
        <Link
          to={`/shop/${shopUsername}/product/${productSlug}/${shopProductId}`}>
          <ProductThumb
            src={thumb}
            alt={productTitle}
            title={productTitle}></ProductThumb>
        </Link>
      </Grid>
      <Grid item xs={9} sm={9} md={10}>
        <div style={{ paddingLeft: 6 }}>
          <Typography
            component={Link}
            to={`/shop/${shopUsername}/product/${productSlug}/${shopProductId}`}
            variant='subtitle1'>
            {productTitle.substring(0, 60)}
            {productTitle.length > 60 && '...'}
          </Typography>
          <br></br>
          <Typography variant='caption'>
            Sold by <Link to={`/shop/${shopUsername}`}>{shopName}</Link>
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

const ShopOrder = ({ shopOrderObj, classes }) => {
  const [open, setOpen] = React.useState(false);

  const handleClick = () => {
    setOpen(!open);
  };

  const {
    id: shopOrderId,
    totalItems: shopOrderTotalItems,
    status: shopOrderStatus,
    shop: {
      geometry: { coordinates },
      properties: {
        publicUsername: shopUsername,
        title: shopName,
        address: shopAddress
      }
    },
    clientTrackingId: shopOrderTrackingId,
    total: shopOrderTotal,
    orderItems: { edges: orderItems }
  } = shopOrderObj.node;

  const lat = coordinates[1];
  const lng = coordinates[0];
  return (
    <>
      <ListItem button onClick={handleClick} className={classes.ShopOrder}>
        <Grid container spacing={1}>
          <Grid item xs={3} md={3}>
            <Typography component={Link} to={`/shop/${shopUsername}`}>
              {shopName}
            </Typography>
          </Grid>
          <Grid item xs={3} md={3}>
            <Typography
              style={{ color: getStatusColor(shopOrderStatus) }}
              variant='subtitle2'>
              {getReadableStatus(shopOrderStatus)}
            </Typography>
          </Grid>
          <Grid item xs={3} md={3}>
            <Typography variant='subtitle2'>
              Subtotal ({shopOrderTotalItems} items)
            </Typography>
            <Typography style={{ color: green[600] }} variant='caption'>
              &#x20b9;{shopOrderTotal}
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
        {orderItems.map(orderItemObj => {
          return (
            <Paper key={orderItemObj.node.id} className={classes.orderItem}>
              <OrderItem
                orderItemObj={orderItemObj}
                classes={classes}
                shopUsername={shopUsername}
                shopName={shopName}></OrderItem>
            </Paper>
          );
        })}
        {shopOrderStatus !== 'FULFILLED' && (
          <Typography variant='h6' align='right' className={classes.address}>
            Collect your order at{' '}
            <a
              href={`${process.env.GATSBY_G_MAP_URL}${lat},${lng}`}
              target='_blank'
              rel='noopener noreferrer'>
              {shopAddress}
            </a>
          </Typography>
        )}
      </Collapse>
    </>
  );
};

const Order = ({ orderNodeObj, classes }) => {
  const {
    referenceId,
    created: orderPlacedStr,
    status: orderStatus,
    total: orderTotal,
    totalItems: orderTotalItems,
    shopOrders: { edges: shopOrders }
  } = orderNodeObj.node;
  const orderPlacedDateObj = new Date(orderPlacedStr);
  const orderPlaced = `${orderPlacedDateObj.getDate()} ${orderPlacedDateObj.toLocaleString(
    'default',
    { month: 'short' }
  )} ${orderPlacedDateObj.getFullYear()}`;
  return (
    <>
      <ListItem className={classes.order}>
        <Grid container spacing={1}>
          <Grid item xs={3} md={3}>
            <Typography variant='subtitle2'>Status</Typography>
            <Typography
              align='left'
              style={{ color: getStatusColor(orderStatus) }}
              variant='caption'>
              {getReadableStatus(orderStatus)}
            </Typography>
          </Grid>
          <Grid item xs={3} md={3}>
            <Typography variant='subtitle2'>Placed</Typography>
            <Typography variant='caption'>{orderPlaced}</Typography>
          </Grid>
          <Grid item xs={3} md={3}>
            <Typography variant='subtitle2'>Order</Typography>
            <Typography align='center' color='primary' variant='caption'>
              #{referenceId}
            </Typography>
          </Grid>
          <Grid item xs={3} md={3}>
            <Typography align='right' variant='subtitle2'>
              Total ({orderTotalItems} items)
            </Typography>
            <Typography
              align='right'
              style={{ color: green[600] }}
              variant='subtitle1'>
              &#x20b9;{orderTotal}
            </Typography>
          </Grid>
        </Grid>
      </ListItem>
      <Divider></Divider>

      <div className={classes.nested}>
        {shopOrders.map(shopOrderObj => {
          return (
            <>
              <ShopOrder
                key={shopOrderObj.node.id}
                classes={classes}
                shopOrderObj={shopOrderObj}></ShopOrder>
              <Divider></Divider>
            </>
          );
        })}
      </div>
    </>
  );
};

const OrderList = ({ viewer, classes }) => {
  const { id: userId } = viewer;
  const { loading, error, data, fetchMore } = useQuery(MY_ORDERS, {
    variables: { userId }
  });

  if (loading) return <Loading></Loading>;
  if (error) return <ErrorPage></ErrorPage>;

  if (data && data.userOrders) {
    const {
      userOrders: { pageInfo, edges: orders }
    } = data;
    return (
      <Grid container>
        {orders.length === 0 ? (
          <div>
            <Typography variant='h4' align='center'>
              You do not have any orders right now ...
            </Typography>
            <br></br>
            <Button color='primary' component={Link} to='/' variant='contained'>
              Continue Shopping
            </Button>
          </div>
        ) : (
          <>
            <Typography align='center' component='h1' variant='h4'>
              Your Orders
            </Typography>
            {orders.map(orderNodeObj => (
              <Grid key={orderNodeObj.node.id} item xs={12}>
                <List>
                  <Order classes={classes} orderNodeObj={orderNodeObj}></Order>
                </List>
              </Grid>
            ))}
            <PaginationWithState
              fetchMore={fetchMore}
              pageInfo={pageInfo}></PaginationWithState>
          </>
        )}
      </Grid>
    );
  }
  return <Typography>No orders found</Typography>;
};

const MyOrders = () => {
  const classes = useStyles();
  return (
    <Layout>
      <SEO
        title='Your orders'
        description='Your Orders | Track all of your orders'></SEO>
      <Container style={{ padding: 0 }} maxWidth='md'>
        <UserCheck>
          <OrderList classes={classes}></OrderList>
        </UserCheck>
      </Container>
    </Layout>
  );
};

export default MyOrders;
