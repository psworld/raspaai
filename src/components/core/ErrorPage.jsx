import React from 'react';
import { Container, Typography } from '@material-ui/core';

export default () => (
  <Container maxWidth='sm'>
    <Typography
      component='h1'
      variant='h2'
      align='center'
      color='textPrimary'
      gutterBottom>
      Oops an error !
    </Typography>
    <Typography variant='h5' align='center' color='textSecondary' paragraph>
      We are trying to fix the problem as soon as possible. Please try again
      later !
    </Typography>
  </Container>
);
