import React from 'react';
import Layout from '../components/layout';
import {
  Typography,
  Container,
  Paper,
  ListItem,
  List
} from '@material-ui/core';
import { useStaticQuery, graphql } from 'gatsby';
import { Link } from 'gatsby';
import SEO from '../components/seo';

const TermsOfUse = () => {
  const data = useStaticQuery(graphql`
    query SiteUrlQuery {
      site {
        siteMetadata {
          siteUrl
        }
      }
    }
  `);

  const { siteUrl } = data.site.siteMetadata;
  return (
    <Layout>
      <SEO
        title='Terms Of Use'
        description='Terms of use which a user must agree to use our service'></SEO>
      <Container style={{ marginTop: 10 }} maxWidth='md'>
        <Paper>
          <Typography variant='h3' component='h1' align='center'>
            Terms Of Use
          </Typography>
          <List>
            <ListItem>
              <Typography variant='h6'>
                Last updated:(30-November-2019)
              </Typography>
            </ListItem>

            <ListItem>
              <Typography>
                Please read these Terms of Use("Terms", "Terms of Use")
                carefully before using the <Link to='/'>{siteUrl}</Link>{' '}
                website.
              </Typography>
            </ListItem>

            <ListItem>
              <Typography>
                Your access to and use of the Service is conditioned on your
                acceptance of and compliance with these Terms. These Terms apply
                to all visitors, users and others who access or use the Service.
              </Typography>
            </ListItem>

            <ListItem>
              <Typography variant='h6'>
                By accessing or using the Service you agree to be bound by these
                Terms. If you disagree with any part of the terms then you may
                not access the Service.
              </Typography>
            </ListItem>

            <ListItem>
              <Typography variant='h5'>Purchase</Typography>
            </ListItem>
            <ListItem>
              <Typography>
                If you wish to purchase any product or service made available
                through the Service ("Purchase"), you may be asked to supply
                certain information relevant to your Purchase including your
                name, email and number. This purchase information will be only
                shared with the seller so that they can fulfil your purchase or
                order.
              </Typography>
            </ListItem>

            <ListItem>
              <Typography variant='h5'>Return And Refund</Typography>
            </ListItem>
            <ListItem>
              <Typography>
                Return and refund on the products sold by shops is completely a
                choice of shop whether they provide refund or return on that
                product or not. Raspaai is not responsible for any kind of
                damaged or wrong product received by the buyer. It is the
                responsibility of shops to provide the right and good product to
                their customers.
              </Typography>
            </ListItem>

            <ListItem>
              <Typography variant='h5'>Termination</Typography>
            </ListItem>
            <ListItem>
              <Typography>
                We may terminate or suspend access to our Service immediately,
                without prior notice or liability, for any reason whatsoever,
                including without limitation if you breach the Terms.
                <br></br>All provisions of the Terms which by their nature
                should survive termination shall survive termination, including,
                without limitation, ownership provisions, warranty disclaimers,
                indemnity and limitations of liability.
              </Typography>
            </ListItem>

            <ListItem>
              <Typography variant='h5'>Content</Typography>
            </ListItem>
            <ListItem>
              <Typography>
                Our Service allows brand owners to publish their products to
                this site. Brand owners are responsible for any false or
                mistaken information about their product.
              </Typography>
            </ListItem>

            <ListItem>
              <Typography variant='h5'>Links To Other Web Sites</Typography>
            </ListItem>
            <ListItem>
              <Typography>
                Our Service may contain links to third-party web sites or
                services that are not owned or controlled by Raspaai.
                <br></br>
                Raspaai has no control over, and assumes no responsibility for,
                the content, privacy policies, or practices of any third party
                web sites or services. You further acknowledge and agree that
                Raspaai shall not be responsible or liable, directly or
                indirectly, for any damage or loss caused or alleged to be
                caused by or in connection with use of or reliance on any such
                content, goods or services available on or through any such web
                sites or services.
              </Typography>
            </ListItem>

            <ListItem>
              <Typography variant='h5'>Changes</Typography>
            </ListItem>
            <ListItem>
              <Typography>
                We reserve the right, at our sole discretion, to modify or
                replace these Terms at any time. If a revision is material we
                will try to provide at least 30 days notice prior to any new
                terms taking effect. What constitutes a material change will be
                determined at our sole discretion.
              </Typography>
            </ListItem>

            <ListItem>
              <Typography variant='h5'>Contact Us</Typography>
            </ListItem>
            <ListItem>
              <Typography>
                If you have any questions about these Terms, please{' '}
                <Link to='/contact-us'>contact us</Link>.
              </Typography>
            </ListItem>
          </List>
        </Paper>
      </Container>
    </Layout>
  );
};

export default TermsOfUse;
