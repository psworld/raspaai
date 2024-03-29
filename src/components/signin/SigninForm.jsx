import { Drawer } from '@material-ui/core';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { Form, Formik } from 'formik';
import { TextField } from 'formik-material-ui';
import { navigate } from 'gatsby';
import gql from 'graphql-tag';
import React from 'react';
import { useMutation } from 'react-apollo';
import * as yup from 'yup';
import GraphqlErrorMessage from '../core/GraphqlErrorMessage';
import Link from '../core/Link';
import { VIEWER } from '../navbar/ToolBarMenu';

const useStyles = makeStyles(theme => ({
  '@global': {
    body: {
      backgroundColor: theme.palette.common.white
    }
  },
  paper: {
    marginTop: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1)
  },
  submit: {
    margin: theme.spacing(3, 0, 2)
  },
  message: {
    margin: theme.spacing(0),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  }
}));

const SIGNIN = gql`
  mutation($email: String!, $password: String!, $rememberMe: Boolean) {
    loginUser(
      input: { email: $email, password: $password, rememberMe: $rememberMe }
    ) {
      token
      rememberMe
      user {
        id
        email
        firstName
        lastName
        isShopOwner
        isBrandOwner
        isSuperuser
        totalCartItems
        brand {
          id
          publicUsername
          isActive
        }
        shop {
          id
          properties {
            publicUsername
            isActive
          }
        }
      }
    }
  }
`;

export default function SigninForm({ message, redirectUrl }) {
  const classes = useStyles();
  const [signin, { loading, error }] = useMutation(SIGNIN, {
    // refetchQueries: [{ query: CART_ITEMS }],
    update(
      store,
      {
        data: {
          loginUser: { user, token }
        }
      }
    ) {
      localStorage.setItem('token', token);
      store.writeQuery({
        query: VIEWER,
        data: { viewer: user }
      });
    },
    onCompleted: data => {
      redirectUrl ? navigate(redirectUrl) : navigate('/');
    }
    // data.loginUser.rememberMe
    //   ? localStorage.setItem('token', data.loginUser.token)
    //   : sessionStorage.setItem('token', data.loginUser.token)
  });

  return (
    <Formik
      initialValues={{
        email: '',
        password: ''
      }}
      validationSchema={yup.object().shape({
        email: yup
          .string()
          .email('Invalid Email')
          .required('Email required'),
        password: yup
          .string()
          .min(8, 'Too short!')
          .max(16, 'Too long!')
          .required('Password required')
      })}
      onSubmit={(values, { setSubmitting }) => {
        const { email, password } = values;

        signin({
          variables: { email, password }
        });

        setSubmitting(false);
      }}>
      {formik => {
        const { handleSubmit, isSubmitting } = formik;
        return (
          <>
            {message && (
              <code className={classes.message}>
                <Typography
                  style={{ color: 'green' }}
                  component='h1'
                  variant='h5'>
                  {message}
                </Typography>
              </code>
            )}
            <Drawer open={loading || isSubmitting}></Drawer>
            <Container maxWidth='xs'>
              <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                  <LockOutlinedIcon />
                </Avatar>
                <Typography component='h1' variant='h5'>
                  Sign in
                </Typography>
                <Form className={classes.form}>
                  <TextField
                    name='email'
                    label='Email'
                    variant='outlined'
                    margin='normal'
                    required
                    fullWidth
                    placeholder='Email'
                    autoComplete='email'></TextField>
                  <TextField
                    variant='outlined'
                    margin='normal'
                    required
                    fullWidth
                    name='password'
                    label='Password'
                    type='password'
                    id='password'
                    autoComplete='current-password'
                  />
                  {error && (
                    <GraphqlErrorMessage
                      error={error}
                      critical></GraphqlErrorMessage>
                  )}

                  <Button
                    // type="submit"
                    disabled={loading || isSubmitting}
                    onClick={handleSubmit}
                    fullWidth
                    variant='contained'
                    color='primary'
                    className={classes.submit}>
                    {loading ? 'Signing In' : 'Sign In'}
                  </Button>
                  <Grid container>
                    <Grid item xs>
                      <Link to='/reset-password' variant='body2'>
                        Forgot password?
                      </Link>
                    </Grid>
                    <Grid item>
                      <Link to='/signup' variant='body2'>
                        Don't have an account? Sign Up
                      </Link>
                    </Grid>
                  </Grid>
                </Form>
              </div>
            </Container>
          </>
        );
      }}
    </Formik>
  );
}
