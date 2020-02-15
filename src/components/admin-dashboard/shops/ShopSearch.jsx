import React from 'react';
import { useMutation } from 'react-apollo';
import {
  Grid,
  Container,
  Button,
  Box,
  Typography,
  TextField
} from '@material-ui/core';
import GraphqlErrorMessage from '../../core/GraphqlErrorMessage';
import { gql } from 'apollo-boost';
import MainFeaturedPost from '../../templates/MainFeaturedPost';
import Link from '../../core/Link';

const GET_SHOP = gql`
  mutation($shopUsername: String, $ownerEmail: String) {
    adminGetShopInfo(
      input: { shopUsername: $shopUsername, ownerEmail: $ownerEmail }
    ) {
      shop {
        id
        properties {
          title
          publicUsername
          heroImage
        }
      }
    }
  }
`;

const ShopElement = ({ shop }) => {
  const {
    id: shopId,
    properties: { title: shopName, publicUsername: shopUsername, heroImage }
  } = shop;
  return (
    <Grid item xs={12} md={4}>
      <Box px={1} my={1}>
        <Link to={`/shop/${shopUsername}`}>
          <MainFeaturedPost img={heroImage} title={shopName}></MainFeaturedPost>
          <Typography variant='subtitle1' color='textPrimary'>
            {shopName}
          </Typography>
        </Link>
        <Button
          component={Link}
          to={`/raspaai/dashboard/shops/edit/${shopUsername}`}
          variant='contained'
          color='primary'>
          Edit
        </Button>
      </Box>
    </Grid>
  );
};

const ShopSearch = () => {
  const [shopInput, setShopInput] = React.useState({});

  const handleChange = e => {
    setShopInput({ [e.target.name]: e.target.value });
  };

  const [getShop, getShopProps] = useMutation(GET_SHOP, {
    variables: { ...shopInput }
  });
  return (
    <Container maxWidth='md'>
      <br></br>
      <br></br>
      <Grid container spacing={1}>
        <Grid item xs={12} md={6}>
          <TextField
            name='shopUsername'
            variant='outlined'
            label='Shop username'
            onChange={handleChange}
            placeholder='Shop username'></TextField>
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            name='ownerEmail'
            variant='outlined'
            label='Owner email'
            onChange={handleChange}
            placeholder='Owner email'></TextField>
        </Grid>
        <Grid item xs={12} md={12}>
          <Button onClick={getShop} variant='contained' color='primary'>
            Search Shop
          </Button>
        </Grid>
        {getShopProps.loading && 'Loading'}
        {getShopProps.error && (
          <GraphqlErrorMessage error={getShopProps.error}></GraphqlErrorMessage>
        )}
        {getShopProps.data && (
          <ShopElement
            shop={getShopProps.data.adminGetShopInfo.shop}></ShopElement>
        )}
      </Grid>
    </Container>
  );
};

export default ShopSearch;
