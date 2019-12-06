import React from 'react';
import Layout from '../components/layout';
import {
  Typography,
  Container,
  List,
  ListItem,
  Paper
} from '@material-ui/core';
import { Link } from 'gatsby';
import SEO from '../components/seo';

const PrivacyPolicy = () => {
  return (
    <Layout>
      <SEO title='Privacy Policy' description='Privacy Policy'></SEO>
      <Container style={{ marginTop: 10 }} maxWidth='md'>
        <Paper>
          <Typography variant='h3' component='h1' align='center'>
            Privacy Policy
          </Typography>
          <List>
            <ListItem>
              <Typography variant='h6'>
                Last updated: (30-November-2019)
              </Typography>
            </ListItem>
            <ListItem>
              <Typography>
                My company operates at{' '}
                <Link to='/'>https://www.raspaai.tk</Link>. This page informs
                you of our policies regarding the collection, use and disclosure
                of Personal Information we receive from users of our Site.
                <br></br>
                By using our site you agree to our privacy policy.
              </Typography>
            </ListItem>

            <ListItem>
              <Typography variant='h5'>
                Information Collection And Use
              </Typography>
            </ListItem>
            <ListItem>
              <Typography>
                No personal information of any kind is collected while using our
                site. Only when signing up for an account at{' '}
                <Link to='/signup'>/signup</Link> we may ask for your name and
                email so that we can uniquely identify or contact you if in any
                case needed. Other than that no information is collected.
              </Typography>
            </ListItem>

            <ListItem>
              <Typography variant='h5'>Communications</Typography>
            </ListItem>
            <ListItem>
              <Typography>
                We may use your email to contact you with newsletters,
                marketing, promotional materials, order updates and other
                information
              </Typography>
            </ListItem>

            <ListItem>
              <Typography variant='h5'>Security</Typography>
            </ListItem>
            <ListItem>
              <Typography>
                The security of your Personal Information is important to us,
                but remember that no method of transmission over the Internet,
                or method of electronic storage, is 100% secure. While we strive
                to use commercially acceptable means to protect your Personal
                Information, we cannot guarantee its absolute security.
              </Typography>
            </ListItem>

            <ListItem>
              <Typography variant='h5'>
                Changes To This Privacy Policy
              </Typography>
            </ListItem>
            <ListItem>
              <Typography>
                This Privacy Policy is effective as of (30-November-2019) and
                will remain in effect except with respect to any changes in its
                provisions in the future, which will be in effect immediately
                after being posted on this page.
                <br></br>
                <br></br>
                We reserve the right to update or change our Privacy Policy at
                any time and you should check this Privacy Policy periodically.
                Your continued use of the Service after we post any
                modifications to the Privacy Policy on this page will constitute
                your acknowledgment of the modifications and your consent to
                abide and be bound by the modified Privacy Policy.
                <br></br>
                <br></br>
                If we make any material changes to this Privacy Policy, we will
                notify you either through the email address you have provided
                us, or by placing a prominent notice on our website.
              </Typography>
            </ListItem>

            <ListItem>
              <Typography variant='h5'>Contact Us</Typography>
            </ListItem>
            <ListItem>
              <Typography>
                If you have any questions about this Privacy Policy, please{' '}
                <Link to='/contact-us'>contact us</Link>.
              </Typography>
            </ListItem>
          </List>
        </Paper>
      </Container>
    </Layout>
  );
};

export default PrivacyPolicy;
