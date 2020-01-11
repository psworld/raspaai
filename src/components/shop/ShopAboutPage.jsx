import {
  Container,
  List,
  ListItem,
  Paper,
  Typography
} from '@material-ui/core';
import { format } from 'date-fns';
import gql from 'graphql-tag';
import React from 'react';
import { useQuery } from 'react-apollo';
import ErrorPage from '../core/ErrorPage';
import { MenuItemLink } from '../core/Link';
import Loading from '../core/Loading';
import { getDayName, getIsStoreOpenNow } from '../core/utils';
import MainFeaturedPost from '../templates/MainFeaturedPost';

export const SHOP = gql`
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
        heroImage
        openAt
        closeAt
        offDays
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
          heroImage,
          openAt,
          closeAt,
          offDays,
          isOpenToday
        }
      }
    } = data;
    const lat = coordinates[1];
    const lng = coordinates[0];
    const isStoreOpenNow = getIsStoreOpenNow(
      openAt,
      closeAt,
      offDays,
      isOpenToday
    );

    openAt = format(new Date(`2002-10-06T${openAt}+05:30`), 'h:mm a');
    closeAt = format(new Date(`2002-10-06T${closeAt}+05:30`), 'h:mm a');

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
          <MainFeaturedPost img={heroImage} title={shopName}></MainFeaturedPost>
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
              <Typography
                style={isStoreOpenNow ? { color: 'green' } : { color: 'red' }}>
                {isStoreOpenNow ? 'Store is open now' : 'Store is closed now'}
              </Typography>
            </ListItem>
            <ListItem>
              <Typography>
                {JSON.parse(offDays).length === 0 ? (
                  <>Open on all days</>
                ) : (
                  <>
                    Close on{' '}
                    {JSON.parse(offDays).map(day => (
                      <>{getDayName(day)} </>
                    ))}
                  </>
                )}
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
            {JSON.parse(returnRefundPolicy).map((policy, index) => (
              <ListItem key={index}>
                <Typography>{policy}</Typography>
              </ListItem>
            ))}
          </List>
        </Paper>
      </Container>
    );
  }
};

export default ShopAboutPage;
