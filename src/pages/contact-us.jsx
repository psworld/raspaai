import {
  Container,
  List,
  ListItem,
  Paper,
  Typography
} from '@material-ui/core';
import { graphql, useStaticQuery } from 'gatsby';
import React from 'react';
import Layout from '../components/layout';
import SEO from '../components/seo';

const ContactUs = () => {
  const data = useStaticQuery(graphql`
    query social {
      site {
        siteMetadata {
          title
          social {
            twitter
            facebook
            instagram
            youtube
          }
        }
      }
    }
  `);

  const social = data.site.siteMetadata.social;

  const socialHandleList = [
    {
      title: 'Facebook',
      url: `https://www.facebook.com/${social.facebook}/`
    },
    {
      title: 'Instagram',
      url: `https://www.instagram.com/${social.instagram}/`
    },
    {
      title: 'Youtube',
      url: `https://www.youtube.com/channel/${social.youtube}/`
    },
    { title: 'Twitter', url: `https://twitter.com/${social.twitter}` }
  ];

  return (
    <Layout>
      <SEO
        title='Contact us'
        description='Contact us if you are a shop owner, brand or for any query or feedback'></SEO>
      <Container style={{ marginTop: 10 }} maxWidth='md'>
        <Paper>
          <Typography variant='h3' align='center' component='h1'>
            Contact us
          </Typography>
          <List>
            <ListItem>
              <Typography variant='h5'>
                For any query you can write us on:
              </Typography>
            </ListItem>
            <ListItem>
              <Typography>
                Email:{' '}
                <a
                  id='email'
                  href='mailto:raspaai.in@gmail.com?Subject=Query'
                  target='_blank'>
                  raspaai.in@gmail.com
                </a>
              </Typography>
            </ListItem>

            <ListItem>
              <Typography variant='h5'>
                Shops or brands for registration can contact through
              </Typography>
            </ListItem>
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

            <ListItem>
              <Typography variant='h5'>
                Any kind of feedback is appreciated. You can give your feedback
                through:
              </Typography>
            </ListItem>
            <ListItem>
              <Typography>
                Facebook:{' '}
                <a
                  href='https://m.me/raspaai'
                  target='_blank'
                  rel='noopener noreferrer'>
                  @raspaai
                </a>
              </Typography>
            </ListItem>
            <ListItem>
              <Typography>
                Whats app:{' '}
                <a
                  href={`${process.env.GATSBY_WHATSAPP_RASPAAI_URL}text=Your%20Feedback`}
                  target='_blank'
                  rel='noopener noreferrer'>
                  Raspaai
                </a>
              </Typography>
            </ListItem>

            <ListItem>
              <Typography variant='h5'>
                Follow us on social media platforms for updates
              </Typography>
            </ListItem>
            {socialHandleList.map(item => (
              <ListItem key={item.title}>
                <a href={item.url} target='_blank' rel='noreferrer noopener'>
                  {item.title}
                </a>
              </ListItem>
            ))}
          </List>
        </Paper>
      </Container>
    </Layout>
  );
};

export default ContactUs;
