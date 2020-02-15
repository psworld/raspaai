import {
  Button,
  Container,
  List,
  ListItem,
  Typography
} from '@material-ui/core';
import gql from 'graphql-tag';
import React from 'react';
import { useMutation, useQuery } from 'react-apollo';
import ErrorPage from '../../../core/ErrorPage';
import Link from '../../../core/Link';
import Loading from '../../../core/Loading';
import { Formik } from 'formik';
import * as yup from 'yup';
import { TextField } from 'formik-material-ui';
import GraphqlErrorMessage from '../../../core/GraphqlErrorMessage';

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

const EditPolicy = ({ defaultReturnRefundPolicy }) => {
  const [modify, { loading, error, data }] = useMutation(
    MODIFY_RETURN_REFUND_POLICY
  );

  return (
    <Formik
      initialValues={{ returnRefundPolicy: defaultReturnRefundPolicy }}
      validationSchema={yup.object().shape({
        returnRefundPolicy: yup
          .array()
          .of(
            yup
              .string()
              .required('Required!')
              .max(200)
          )
          .required('Required!')
      })}
      onSubmit={(values, { setSubmitting }) => {
        modify({
          variables: {
            returnRefundPolicy: JSON.stringify(values.returnRefundPolicy)
          }
        });
        setSubmitting(false);
      }}>
      {formik => {
        return (
          <List>
            {formik.values.returnRefundPolicy.map((policy, index) => {
              return (
                <ListItem key={index}>
                  <TextField
                    name={`returnRefundPolicy[${index}]`}
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
                <GraphqlErrorMessage
                  error={error}
                  critical></GraphqlErrorMessage>
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
                disabled={loading || formik.isSubmitting || !formik.dirty}
                onClick={formik.handleSubmit}
                variant='contained'
                color='primary'>
                Save
              </Button>
            </ListItem>
          </List>
        );
      }}
    </Formik>
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
            data.shop.properties.returnRefundPolicy
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
          {JSON.parse(data.shop.properties.returnRefundPolicy).map(
            (policy, index) => (
              <ListItem key={index}>
                <Typography>{policy}</Typography>
              </ListItem>
            )
          )}
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
