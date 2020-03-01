import React from 'react';
import { Container, Typography, List, ListItem } from '@material-ui/core';
import Layout from '../../components/layout';
import SEO from '../../components/seo';

const BrandOwner = () => {
  return (
    <Layout>
      <SEO
        title='Are you a brand owner ?'
        description='Are you a brand owner ? register with raspaai enjoy benefits of a free website'></SEO>
      <Container maxWidth='md'>
        <Typography
          component='h1'
          variant='h4'
          align='center'
          color='textPrimary'
          gutterBottom>
          Do you own a brand ?
        </Typography>

        <Typography
          variant='h5'
          align='center'
          // color='textSecondary'
          component='p'>
          Register with us and get reach for your products.<br></br>
          Get your brand online and make it easy for your customers to discover
          your great products.
        </Typography>

        <br></br>
        <Typography variant='h6'>Contact us</Typography>
        <List>
          <ListItem>
            <Typography>
              Whats app:{' '}
              <a
                href={`${process.env.GATSBY_WHATSAPP_RASPAAI_URL}text=Registration`}
                target='_blank'
                rel='noopener noreferrer'>
                Raspaai
              </a>
            </Typography>
          </ListItem>
          <ListItem>
            <Typography>
              Email:{' '}
              <a
                href='mailto:raspaai.in@gmail.com?Subject=Registration'
                target='_top'>
                raspaai.in@gmail.com
              </a>
            </Typography>
          </ListItem>
        </List>
      </Container>
    </Layout>
  );
};

export default BrandOwner;
