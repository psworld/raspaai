import React from 'react';
import { Formik, Form } from 'formik';

import * as yup from 'yup';
import { Container, Avatar, Typography, Grid, Button } from '@material-ui/core';

import { makeStyles } from '@material-ui/core/styles';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { TextField } from 'formik-material-ui';
import GraphqlErrorMessage from '../../core/GraphqlErrorMessage';
import { gql } from 'apollo-boost';
import { useMutation } from 'react-apollo';
import Link from '../../core/Link';

const useStyles = makeStyles(theme => ({
  '@global': {
    body: {
      backgroundColor: theme.palette.common.white
    }
  },
  paper: {
    marginTop: theme.spacing(8),
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
    marginTop: theme.spacing(3)
  },
  submit: {
    margin: theme.spacing(3, 0, 2)
  }
}));

const ADMIN_CREATE_USER = gql`
  mutation($data: AdminCreateUserInput!) {
    adminCreateUser(input: $data) {
      user {
        id
        email
      }
    }
  }
`;

const AddUser = () => {
  const classes = useStyles();

  const [createUser, { loading, error, data }] = useMutation(ADMIN_CREATE_USER);
  return (
    <Formik
      initialValues={{
        email: '',
        firstName: '',
        lastName: ''
      }}
      validationSchema={yup.object().shape({
        email: yup
          .string()
          .email('Invalid Email')
          .required('Email required'),
        firstName: yup
          .string()
          .min(2, 'Too Short!')
          .max(30, 'Too Long!')
          .required('First name required'),
        lastName: yup
          .string()
          .min(2, 'Too Short!')
          .max(30, 'Too Long!')
          .required('Last name required'),
        password1: yup
          .string()
          .min(8, 'Password is too short')
          .max(16, 'Password is too long')
          .required('Password required'),
        password2: yup
          .string()
          .oneOf([yup.ref('password1'), ''], 'Password do not match')
          .required('Confirm password required')
      })}
      onSubmit={(values, { setSubmitting }) => {
        createUser({
          variables: { data: values }
        });
        setSubmitting(false);
      }}>
      {formik => {
        return (
          <Container maxWidth='xs'>
            <div className={classes.paper}>
              <Avatar className={classes.avatar}>
                <LockOutlinedIcon />
              </Avatar>
              <Typography component='h1' variant='h5'>
                Sign up
              </Typography>
              <Form className={classes.form}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      autoComplete='fname'
                      name='firstName'
                      variant='outlined'
                      required
                      fullWidth
                      placeholder='First Name'
                      label='First Name'
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      name='lastName'
                      variant='outlined'
                      required
                      fullWidth
                      label='Last Name'
                      placeholder='Last Name'
                      autoComplete='lname'
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      variant='outlined'
                      margin='normal'
                      required
                      fullWidth
                      id='email'
                      placeholder='Email'
                      name='email'
                      autoComplete='email'></TextField>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      variant='outlined'
                      margin='normal'
                      required
                      fullWidth
                      name='password1'
                      type='password'
                      label='Password'
                      autoComplete='current-password'
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      variant='outlined'
                      margin='normal'
                      required
                      fullWidth
                      name='password2'
                      type='password'
                      label='Password Confirm'
                      autoComplete='current-password'
                    />
                  </Grid>
                </Grid>

                {error && (
                  <GraphqlErrorMessage
                    error={error}
                    critical></GraphqlErrorMessage>
                )}
                {data && (
                  <p style={{ color: 'green' }}>Account created successfully</p>
                )}
                <Button
                  type='submit'
                  disabled={loading}
                  fullWidth
                  variant='contained'
                  color='primary'
                  className={classes.submit}>
                  Add User
                </Button>

                <Grid container justify='flex-end'>
                  <Grid item>
                    <Link to='/signin' variant='body2'>
                      Already have an account? Sign in
                    </Link>
                  </Grid>
                </Grid>
              </Form>
            </div>
          </Container>
        );
      }}
    </Formik>
  );
};

export default AddUser;
