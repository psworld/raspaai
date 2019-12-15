import React from 'react';
import {
  Typography,
  List,
  ListItem,
  Button,
  Container,
  TextField
} from '@material-ui/core';

import { useQuery, useMutation } from 'react-apollo';
import gql from 'graphql-tag';
import Loading from '../../../core/Loading';
import ErrorPage from '../../../core/ErrorPage';
import Link from '../../../core/Link';
import { resolve } from 'url';
import { GraphQLError } from 'graphql';

const SHOP_RETURN_REFUND_POLICY = gql`
  query($publicShopUsername: String!) {
    shop(publicShopUsername: $publicShopUsername) {
      id
      properties {
        returnRefundPolicy
      }
    }
  }
`;

const MODIFY_RETURN_REFUND_POLICY = gql`
  mutation($returnRefundPolicy: JSONString!) {
    modifyShopReturnRefundPolicy(
      input: { returnRefundPolicy: $returnRefundPolicy }
    ) {
      shop {
        id
        properties {
          returnRefundPolicy
        }
      }
    }
  }
`;

export function getJsonFriendlyString(string) {
  return string.replace(/\'/g, '"');
}
const EditPolicy = ({ defaultReturnRefundPolicy }) => {
  const [returnRefundPolicy, setReturnRefundPolicy] = React.useState(
    defaultReturnRefundPolicy
  );

  console.info('returnRefundPolicy', returnRefundPolicy)
  
  const [modify, { loading, error, data }] = useMutation(
    MODIFY_RETURN_REFUND_POLICY,
    {
      variables: {
        returnRefundPolicy: JSON.stringify(returnRefundPolicy)
      }
    }
  );

  const lengthLimit = 200;

  const handleReturnRefundPolicyChange = e => {
    if (e.target.value > lengthLimit) {
    } else {
      returnRefundPolicy[e.target.id] = e.target.value;
      setReturnRefundPolicy([...returnRefundPolicy]);
    }
  };

  return (
    <List>
      {returnRefundPolicy.map((policy, index) => {
        const validationError = policy.length > lengthLimit;
        return (
          <ListItem key={index}>
            <TextField
              key={index}
              id={`${index}`}
              value={policy}
              error={validationError}
              label={
                validationError
                  ? `A policy can not be grater than ${lengthLimit} characters`
                  : ''
              }
              onChange={e => handleReturnRefundPolicyChange(e)}
              fullWidth
              margin='normal'
              placeholder='Return refund policy'
              multiline
            />
          </ListItem>
        );
      })}
      {error && (
        <ListItem>
          <GraphQLError error={error} critical={true}></GraphQLError>
        </ListItem>
      )}
      {data && (
        <ListItem>
          <Typography variant='h6' style={{ color: 'green' }}>
            Saved successfully
          </Typography>
        </ListItem>
      )}
      <ListItem>
        <Button
          disabled={loading}
          onClick={() => modify()}
          variant='contained'
          color='primary'>
          Save
        </Button>
      </ListItem>
    </List>
  );
};

export const EditReturnRefundPolicy = ({ shopUsername }) => {
  const { loading, error, data } = useQuery(SHOP_RETURN_REFUND_POLICY, {
    variables: { publicShopUsername: shopUsername }
  });

  return (
    <Container maxWidth='md'>
      <Typography variant='h4' align='center'>
        Edit return refund policy of your shop.
      </Typography>
      {loading && <Loading></Loading>}
      {error && <ErrorPage error={error}></ErrorPage>}
      {data && data.shop && (
        <EditPolicy
          defaultReturnRefundPolicy={JSON.parse(
            getJsonFriendlyString(data.shop.properties.returnRefundPolicy)
          )}></EditPolicy>
      )}
    </Container>
  );
};

const ShopReturnRefundPolicy = ({ publicUsername }) => {
  const { loading, error, data } = useQuery(SHOP_RETURN_REFUND_POLICY, {
    variables: { publicShopUsername: publicUsername }
  });
  return (
    <>
      <Typography variant='h5'>Shop Return Refund Policy</Typography>
      {loading && <Loading></Loading>}
      {error && <ErrorPage error={error}></ErrorPage>}
      {data && data.shop && (
        <List>
          {JSON.parse(
            getJsonFriendlyString(data.shop.properties.returnRefundPolicy)
          ).map((policy, index) => (
            <ListItem key={index}>
              <Typography>{policy}</Typography>
            </ListItem>
          ))}
          <ListItem>
            <Button
              variant='contained'
              color='primary'
              component={Link}
              to={`${window.location.pathname}/return-refund-policy/edit`}>
              Edit Policy
            </Button>
          </ListItem>
        </List>
      )}
    </>
  );
};

export default ShopReturnRefundPolicy;
