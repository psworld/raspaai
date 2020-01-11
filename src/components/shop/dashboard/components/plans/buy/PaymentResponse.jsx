import {
  Divider,
  Fab,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { gql } from 'apollo-boost';
import { format } from 'date-fns';
import { navigate } from 'gatsby';
import React from 'react';
import { useQuery } from 'react-apollo';
import ErrorPage from '../../../../../core/ErrorPage';
import { VIEWER } from '../../../../../navbar/ToolBarMenu';
import { BuyPlanLayout } from './BuyPlans';

const useStyles = makeStyles(theme => ({
  fab: {
    position: 'fixed',
    bottom: theme.spacing(1)
  },
  heading: {
    padding: theme.spacing(2, 2),
    marginBottom: theme.spacing(2),
    color: theme.palette.common.white,
    borderRadius: 0
    // backgroundColor: theme.palette.primary.main
  }
}));

const TRANSACTION_STATUS = gql`
  query($orderId: String!) {
    transactionStatus(orderId: $orderId)
  }
`;

const refundResp = {
  head: {
    clientId: 'C11',
    responseTimestamp: '1578566903452',
    signature:
      'SPeqJiMPg8j60IubTIAeRPyvpCfjYPWdNq9zhqD+24kvvJwLlNQeeBQSUcGBjVSzQxZ8TG0h7vrKyR8RtA8giFCh5nHUv84cxFF1b6j/X1s=',
    version: 'v1'
  },
  body: {
    orderId: 'd0fbce5e-872d-4847-ba40-0b9ca15f2aa5',
    mid: 'efRRgU07439610064194',
    resultInfo: {
      resultStatus: 'TXN_FAILURE',
      resultCode: '617',
      resultMsg: 'Refund Already Raised'
    },
    txnId: '20200109111212800110168115901172688',
    refundAmount: '98'
  }
};

const PaymentResponse = ({ status, orderId }) => {
  const classes = useStyles();

  const { loading, error, data } = useQuery(TRANSACTION_STATUS, {
    variables: { orderId }
  });

  const { data: viewerData } = useQuery(VIEWER);

  const resp = {};
  const getResp = () => {
    switch (status) {
      case 'TXN_SUCCESS':
        resp['msg'] = 'Payment successful';
        resp['color'] = 'green';
        break;

      case 'TXN_FAILURE':
        resp['msg'] = 'Payment unsuccessful';
        resp['color'] = 'red';
        break;

      case 'PENDING':
        resp['msg'] = 'Payment pending';
        resp['color'] = 'yellow';
        break;
      default:
        break;
    }
  };
  getResp();

  if (loading)
    return (
      <Typography style={{ marginTop: '10%' }} variant='h4' align='center'>
        Please do not refresh this page...
      </Typography>
    );

  if (error) return <ErrorPage></ErrorPage>;
  if (data) {
    const transactionStatusObj = JSON.parse(data.transactionStatus);
    if (transactionStatusObj['refundId']) {
      // refund has been initiated
      var resultMsg = transactionStatusObj.resultInfo.resultMsg;
      var transactionStatus = {
        'Refund Amount': <>&#8377;{transactionStatusObj['refundAmount']}</>,
        'Transaction Id': transactionStatusObj['txnId'],
        'Ref Id': transactionStatusObj['refId'],
        'Refund Id': transactionStatusObj['refundId'],
        'Txn Date': format(
          new Date(transactionStatusObj['txnTimestamp']),
          'MMM d, y h:m a'
        )
      };
    } else {
      var resultMsg = transactionStatusObj['RESPMSG'];
      var transactionStatus = {
        'Transaction Id': transactionStatusObj['TXNID'],
        'Order Id': transactionStatusObj['ORDERID'],
        Amount: <>&#8377;{transactionStatusObj['TXNAMOUNT']}</>,
        Date: format(
          new Date(transactionStatusObj['TXNDATE']),
          'MMM d, y h:m a'
        )
      };
    }

    const shopUsername =
      viewerData &&
      viewerData.viewer &&
      viewerData.viewer.shop &&
      viewerData.viewer.shop.properties.publicUsername;
    return (
      <BuyPlanLayout>
        <Paper
          style={{ backgroundColor: resp.color }}
          className={classes.heading}>
          <Typography variant='h5'>{resp.msg}</Typography>
        </Paper>

        <Divider></Divider>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableCell>Status</TableCell>
              <TableCell align='right'>
                <b>{resultMsg}</b>
              </TableCell>
            </TableHead>
            <TableBody>
              {Object.keys(transactionStatus).map(key => (
                <TableRow key={key}>
                  <TableCell component='th' scope='row'>
                    {key}
                  </TableCell>
                  <TableCell align='right'>{transactionStatus[key]}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Fab
          onClick={() =>
            window.location.href(
              `${window.location.origin}/dashboard/shop/${shopUsername}/plans`
            )
          }
          // disabled={loading || called || data}
          disabled={loading || !viewerData}
          color='primary'
          variant='extended'
          className={classes.fab}>
          Continue
        </Fab>
      </BuyPlanLayout>
    );
  }
};

export default PaymentResponse;
