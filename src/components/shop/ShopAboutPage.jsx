import React from 'react';
import {
  Typography,
  Container,
  List,
  ListItem,
  Paper
} from '@material-ui/core';
import Loading from '../core/Loading';
import ErrorPage from '../core/ErrorPage';
import gql from 'graphql-tag';
import { useQuery } from 'react-apollo';
import { getJsonFriendlyString } from './dashboard/components/ShopReturnRefundPolicy';

const SHOP = gql`
  query($publicShopUsername: String!) {
    shop(publicShopUsername: $publicShopUsername) {
      id
      geometry {
        coordinates
      }
      properties {
        publicUsername
        title
        address
        contactNumber
        returnRefundPolicy
      }
    }
  }
`;

const ShopAboutPage = ({ shopUsername }) => {
  const { loading, error, data } = useQuery(SHOP, {
    variables: { publicShopUsername: shopUsername }
  });

  if (loading) return <Loading></Loading>;
  if (error) return <ErrorPage></ErrorPage>;

  if (data) {
    const {
      shop: {
        geometry: { coordinates },
        properties: {
          title: shopName,
          address,
          contactNumber,
          returnRefundPolicy
        }
      }
    } = data;
    const lat = coordinates[1];
    const lng = coordinates[0];
    return (
      <Container maxWidth='sm'>
        <Paper style={{ marginTop: 10 }}>
          <Typography
            id={shopUsername}
            variant='h3'
            component='h1'
            align='center'>
            {shopName}
          </Typography>
          <br></br>
          <List>
            <ListItem>
              <Typography id='address' variant='h4'>
                Address
              </Typography>
            </ListItem>
            <ListItem>
              <Typography>
                <a
                  href={`${process.env.GATSBY_G_MAP_URL}${lat},${lng}`}
                  target='_blank'
                  rel='noopener noreferrer'>
                  {address}
                </a>
              </Typography>
            </ListItem>
            <ListItem>
              <a
                href={`${process.env.GATSBY_G_MAP_URL}${lat},${lng}`}
                target='_blank'
                rel='noopener noreferrer'>
                Click here to see address on google maps
              </a>
            </ListItem>

            <ListItem>
              <Typography id='contact' variant='h4'>
                Contact
              </Typography>
            </ListItem>
            <ListItem>
              <Typography>
                <a href={`tel:${contactNumber}`}>+91{contactNumber}</a>
              </Typography>
            </ListItem>

            <ListItem>
              <Typography id='return-refund-policy' variant='h4'>
                Return Refund Policy
              </Typography>
            </ListItem>
            {JSON.parse(getJsonFriendlyString(returnRefundPolicy)).map(
              (policy, index) => (
                <ListItem key={index}>
                  <Typography>{policy}</Typography>
                </ListItem>
              )
            )}
          </List>
        </Paper>
      </Container>
    );
  }
};

export default ShopAboutPage;
