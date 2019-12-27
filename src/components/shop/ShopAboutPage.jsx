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
import { MenuItemLink } from '../core/Link';

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
        isOpenToday
        openAt
        closeAt
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
    let {
      shop: {
        geometry: { coordinates },
        properties: {
          title: shopName,
          address,
          contactNumber,
          returnRefundPolicy,
          openAt,
          closeAt,
          isOpenToday
        }
      }
    } = data;
    const lat = coordinates[1];
    const lng = coordinates[0];

    openAt = new Date(`2002-10-06T${openAt}+05:30`).toLocaleTimeString();
    closeAt = new Date(`2002-10-06T${closeAt}+05:30`).toLocaleTimeString();

    return (
      <Container maxWidth='sm'>
        <Paper style={{ marginTop: 10 }}>
          <Typography
            id={shopUsername}
            variant='h3'
            component='h1'
            align='center'>
            <MenuItemLink to={`/shop/${shopUsername}`}>{shopName}</MenuItemLink>
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
              <Typography variant='h4' id='active-time'>
                Active time
              </Typography>
            </ListItem>
            <ListItem>
              <Typography>
                {isOpenToday ? 'Store is open today' : 'Store is closed today'}
              </Typography>
            </ListItem>
            <ListItem>
              <Typography>Opens at {openAt}</Typography>
            </ListItem>
            <ListItem>
              <Typography>Closes at {closeAt}</Typography>
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
