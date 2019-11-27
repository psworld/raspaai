import React from 'react';

import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';

import EmailInput from '../core/input/EmailInput';
import PasswordInput from '../core/input/PasswordInput';

import { useMutation } from 'react-apollo';
import gql from 'graphql-tag';
import Link from '../core/Link';
import { VIEWER } from '../navbar/ToolBarMenu';
import GraphqlErrorMessage from '../core/GraphqlErrorMessage';
import { Formik } from 'formik';
import * as yup from 'yup';
import { Drawer } from '@material-ui/core';
import { navigate } from 'gatsby';

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
  mutation($email: String!, $password: String!) {
    loginUser(input: { email: $email, password: $password }) {
      token
      user {
        id
        email
        firstName
        lastName
        isShopOwner
        isSuperuser
        totalCartItems
        brand {
          id
          publicUsername
          isApplication
          applicationStatus {
            id
            statusCode
            title
          }
        }
        shop {
          id
          properties {
            publicUsername
            isApplication
            applicationStatus {
              id
              statusCode
              title
            }
          }
        }
        isBrandOwner
      }
    }
  }
`;

export function hasError(errors) {
  if (Object.keys(errors).length === 0 && errors.constructor === Object) {
    return false;
  } else return true;
}

export default function SigninForm({ message, redirectUrl }) {
  const classes = useStyles();

  const [signin, { called, loading, error, data }] = useMutation(SIGNIN);

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
          .required('Required'),
        password: yup
          .string()
          .min(8, 'Too short!')
          .max(16, 'Too long!')
          .required('Required')
      })}
      onSubmit={(values, { setSubmitting }) => {
        const { email, password } = values;

        signin({
          variables: { email, password },
          update(
            store,
            {
              data: {
                loginUser: {token, user}
              }
            }
          ) {
            store.writeQuery({
              query: VIEWER,
              data: { viewer: user }
            });
            redirectUrl ? navigate(redirectUrl) : window.history.back();
          }
        });
        setSubmitting(false);
      }}>
      {formik => {
        const {
          values: { email, password },
          handleBlur,
          handleChange,
          touched,
          errors,
          handleSubmit,
          isSubmitting
        } = formik;

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
                <form className={classes.form} noValidate>
                  <EmailInput
                    handleBlur={handleBlur}
                    handleChange={handleChange}
                    value={email}
                    touched={touched.email}
                    errors={errors.email}
                    autoFocus={false}></EmailInput>
                  <PasswordInput
                    handleChange={handleChange}
                    handleBlur={handleBlur}
                    touched={touched.password}
                    errors={errors.password}
                    value={password}></PasswordInput>
                  {error && (
                    <GraphqlErrorMessage
                      message={error.message}
                      critical={true}></GraphqlErrorMessage>
                  )}
                  <FormControlLabel
                    control={<Checkbox value='remember' color='primary' />}
                    label='Remember me'
                  />
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
                        {"Don't have an account? Sign Up"}
                      </Link>
                    </Grid>
                  </Grid>
                </form>
              </div>
            </Container>
          </>
        );
      }}
    </Formik>
  );
}
