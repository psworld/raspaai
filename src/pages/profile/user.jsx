import React from 'react';
import Layout from '../../components/layout';
import {
  Typography,
  ListItemText,
  ListItem,
  List,
  Container
} from '@material-ui/core';
import SEO from '../../components/seo';
import UserCheck from '../../components/core/UserCheck';

const UserDetails = ({ viewer }) => {
  const { firstName, lastName, email } = viewer;
  return (
    <Container maxWidth='sm'>
      <Typography variant='h3' align='center'>
        My Profile
      </Typography>
      <List>
        {/* <ListItem>
          <Typography variant='h5'>User Details</Typography>
        </ListItem> */}
        <ListItem>
          <ListItemText
            primary='Name'
            secondary={`${firstName} ${lastName}`}></ListItemText>
        </ListItem>
        <ListItem>
          <ListItemText primary='Email' secondary={`${email}`}></ListItemText>
        </ListItem>
      </List>
    </Container>
  );
};

const UserProfile = () => {
  return (
    <Layout>
      <SEO title='Profile' description='User Profile'></SEO>
      <UserCheck>
        <UserDetails></UserDetails>
      </UserCheck>
    </Layout>
  );
};

export default UserProfile;
