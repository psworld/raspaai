import {
  Container,
  List,
  ListItem,
  Paper,
  Typography,
  Grid
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
import TwitterIcon from '@material-ui/icons/Twitter';
import WhatsAppIcon from '@material-ui/icons/WhatsApp';
import FacebookIcon from '@material-ui/icons/Facebook';

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
        about
        address
        contactNumber
        website
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

export const ShopActiveTime = ({ shopProperties }) => {
  let { openAt, closeAt, offDays, isOpenToday } = shopProperties;

  const isStoreOpenNow = getIsStoreOpenNow(
    openAt,
    closeAt,
    offDays,
    isOpenToday
  );

  openAt = format(new Date(`2002-10-06T${openAt}+05:30`), 'h:mm a');
  closeAt = format(new Date(`2002-10-06T${closeAt}+05:30`), 'h:mm a');
  return (
    <>
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
    </>
  );
};

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
          about,
          address,
          contactNumber,
          returnRefundPolicy,
          heroImage,
          website
        }
      }
    } = data;
    const lat = coordinates[1];
    const lng = coordinates[0];

    const SHOP_URL = encodeURI(
      `${window.location.origin}/shop/${shopUsername}`
    );
    const THANKYOU_TEXT = `Raspaai ❤`;

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
              <Typography variant='h4' id='shop-about'>
                About
              </Typography>
            </ListItem>
            <ListItem>
              <Typography variant='h6'>{about}</Typography>
            </ListItem>
            {website && (
              <ListItem>
                <Typography variant='body2'>
                  Checkout more at our website{' '}
                  <a href={website} rel='noopener noreferrer' target='_blank'>
                    {website}
                  </a>
                </Typography>
              </ListItem>
            )}

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
            <ShopActiveTime
              shopProperties={data.shop.properties}></ShopActiveTime>

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
              <Typography id='share' variant='h4'>
                Share on
              </Typography>
            </ListItem>
            <ListItem>
              <Grid container spacing={1}>
                <Grid item xs={3} md={3}>
                  <a
                    href={`https://wa.me/?text=${shopName}%0a${about}%0a%0aCheckout this shop at%0a${SHOP_URL}%0a%0a${THANKYOU_TEXT}`}
                    target='_blank'
                    rel='noopener noreferrer'
                    style={{ color: 'green' }}>
                    <WhatsAppIcon></WhatsAppIcon>
                  </a>
                </Grid>

                <Grid item xs={3} md={3}>
                  <a
                    style={{ color: '#38A1F3' }}
                    href={`https://twitter.com/intent/tweet?text=${shopName}%0a${about}%0a%0aCheckout this shop at &url=${SHOP_URL}&text=%0a${THANKYOU_TEXT}`}
                    target='_blank'
                    rel='noopener noreferrer'>
                    <TwitterIcon></TwitterIcon>
                  </a>
                </Grid>

                <Grid item xs={3} md={3}>
                  <a
                    style={{ color: '#3b5998' }}
                    href={`https://www.facebook.com/sharer/sharer.php?u=${SHOP_URL}`}
                    target='_blank'
                    rel='noopener noreferrer'>
                    <FacebookIcon></FacebookIcon>
                  </a>
                </Grid>
              </Grid>
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
