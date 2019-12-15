import React from 'react';

import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Link, { MenuItemLink } from './core/Link';
import { Container, Grid, Box } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  '@global': {
    body: {
      backgroundColor: theme.palette.common.white
    },
    ul: {
      margin: 0,
      padding: 0
    },
    li: {
      listStyle: 'none'
    },
    a: {
      textDecoration: 'none',
      '&:hover': {
        textDecoration: 'underline'
      }
    }
  },
  footer: {
    borderTop: `1px solid ${theme.palette.divider}`,
    marginTop: theme.spacing(8),
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
    [theme.breakpoints.up('sm')]: {
      paddingTop: theme.spacing(6),
      paddingBottom: theme.spacing(6)
    }
  }
}));

function Copyright() {
  return (
    <Typography variant='body2' color='textSecondary' align='center'>
      {'Copyright © '}
      <Link color='inherit' to='/'>
        Raspaai
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const Footer = ({ social }) => {
  const classes = useStyles();

  const footers = [
    {
      title: 'Raspaai',
      description: [
        {
          id: 'home',
          value: <MenuItemLink to='/'>Home</MenuItemLink>
        },
        {
          id: 'contact-us',
          value: <MenuItemLink to='/contact-us'>Contact us</MenuItemLink>
        }
      ]
    },
    {
      title: 'Features',
      description: [
        {
          id: 'shop-owner',
          value: (
            <MenuItemLink to='/register-with-us/shop-owner'>
              Shop Owner ?
            </MenuItemLink>
          )
        },
        {
          id: 'brand-owner',
          value: (
            <MenuItemLink to='/register-with-us/brand-owner'>
              A Brand ?
            </MenuItemLink>
          )
        }
      ]
    },
    {
      title: 'Legal',
      description: [
        {
          id: 'privacy-policy',
          value: (
            <MenuItemLink to='/privacy-policy'>Privacy policy</MenuItemLink>
          )
        },
        {
          id: 'terms-of-use',
          value: <MenuItemLink to='/terms-of-use'>Terms of use</MenuItemLink>
        }
      ]
    }
  ];

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
    <Container component='footer' className={classes.footer}>
      <Grid container spacing={4} justify='space-evenly'>
        {footers.map(footer => (
          <Grid item xs={6} sm={3} key={footer.title}>
            <Typography variant='h6' color='textPrimary' gutterBottom>
              {footer.title}
            </Typography>
            <ul>
              {footer.description.map(item => (
                <li key={item.id}>{item.value}</li>
              ))}
            </ul>
          </Grid>
        ))}
        <Grid item xs={6} sm={3}>
          <Typography variant='h6' color='textPrimary' gutterBottom>
            Social
          </Typography>
          <ul>
            {socialHandleList.map(item => (
              <li key={item.title}>
                <Typography>
                  <a
                    style={{ color: 'inherit' }}
                    href={item.url}
                    target='_blank'
                    rel='noreferrer noopener'>
                    {item.title}
                  </a>
                </Typography>
              </li>
            ))}
          </ul>
        </Grid>
      </Grid>
      <br></br>
      <Typography variant='caption' align='center'>
        By using our site you agree to our{' '}
        <Link to='/privacy-policy'>privacy policy</Link> and{' '}
        <Link to='/terms-of-use'>terms and conditions</Link>.
      </Typography>
      <Box mt={5}>
        <Copyright />
      </Box>
    </Container>
  );
};

export default Footer;
