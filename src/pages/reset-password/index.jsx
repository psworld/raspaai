import {
  Avatar,
  Button,
  Container,
  Grid,
  ListItem,
  ListItemText,
  Typography
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { Form, Formik } from 'formik';
import { Link, navigate } from 'gatsby';
import gql from 'graphql-tag';
import React from 'react';
import { useMutation } from 'react-apollo';
import * as yup from 'yup';
import GraphqlErrorMessage from '../../components/core/GraphqlErrorMessage';
import Layout from '../../components/layout';
import SEO from '../../components/seo';
import { TextField } from 'formik-material-ui';

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

const RESET_PASSWORD = gql`
  mutation(
    $email: String!
    $jwtEncodedStr: String!
    $keyCode: Int!
    $password1: String!
    $password2: String!
  ) {
    resetPassword(
      input: {
        jwtEncodedStr: $jwtEncodedStr
        keyCode: $keyCode
        email: $email
        password1: $password1
        password2: $password2
      }
    ) {
      success
    }
  }
`;

const SetNewPasswordForm = ({ classes, email, data: jwtData }) => {
  const { jwtEncodedStr } = jwtData.forgotPasswordEmailVerification;

  const [setNewPassword, { loading, error }] = useMutation(RESET_PASSWORD, {
    onCompleted: () =>
      navigate('/signin/?next=/', {
        state: {
          message: 'Password reset successful'
        }
      })
  });

  return (
    <Formik
      initialValues={{
        email,
        password1: '',
        password2: '',
        keyCode: '',
        jwtEncodedStr
      }}
      validationSchema={yup.object().shape({
        email: yup
          .string()
          .email('Invalid Email')
          .required('Email required'),
        jwtEncodedStr: yup.string().required('Required'),
        keyCode: yup
          .number('Invalid key')
          .integer('Invalid key')
          .positive('Invalid key')
          .min(1000, 'Key must be 4 digit long')
          .max(9999, 'Key must be 4 digit long')
          .required('Key required'),
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
        setNewPassword({
          variables: { ...values, jwtEncodedStr }
        });
        setSubmitting(false);
      }}>
      {formik => {
        const { handleSubmit, isSubmitting } = formik;

        return (
          <>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <ListItem>
                  <ListItemText primary='Email' secondary={email} />
                </ListItem>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant='outlined'
                  margin='normal'
                  required
                  fullWidth
                  name='keyCode'
                  label='4 Digit Key'
                  type='number'
                  id='key'
                />
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
                  label={'Password Confirm'}
                  autoComplete='current-password'
                />
              </Grid>
            </Grid>

            {error && (
              <GraphqlErrorMessage error={error} critical></GraphqlErrorMessage>
            )}
            <Button
              onClick={handleSubmit}
              disabled={loading || isSubmitting}
              fullWidth
              variant='contained'
              color='primary'
              className={classes.submit}>
              Set password
            </Button>
          </>
        );
      }}
    </Formik>
  );
};

const ForgotPasswordEmailForm = ({ formik, loading, error, classes }) => {
  const { handleSubmit, isSubmitting } = formik;
  return (
    <Form className={classes.form}>
      <TextField
        variant='outlined'
        margin='normal'
        required
        fullWidth
        id='email'
        placeholder='Email'
        name='email'
        autoComplete='email'></TextField>

      {error && (
        <GraphqlErrorMessage error={error} critical></GraphqlErrorMessage>
      )}
      <code>A confirmation email will be sent to your email address.</code>

      <Button
        // type="submit"
        disabled={loading || isSubmitting}
        onClick={handleSubmit}
        fullWidth
        variant='contained'
        color='primary'
        className={classes.submit}>
        Continue
      </Button>

      <Grid container>
        <Grid item xs>
          <Link to='/signin' variant='body2'>
            Sign in
          </Link>
        </Grid>
        <Grid item>
          <Link to='/signup' variant='body2'>
            Don't have an account? Sign Up
          </Link>
        </Grid>
      </Grid>
    </Form>
  );
};

const FORGOT_PASSWORD_EMAIL_VERIFICATION = gql`
  mutation($email: String!) {
    forgotPasswordEmailVerification(input: { email: $email }) {
      jwtEncodedStr
    }
  }
`;

const ResetPassword = () => {
  const classes = useStyles();

  const [step, setStep] = React.useState(1);

  const nextStep = () => {
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };
  const [sendConfirmationEmail, { loading, error, data }] = useMutation(
    FORGOT_PASSWORD_EMAIL_VERIFICATION,
    {
      onCompleted: () => nextStep()
    }
  );

  return (
    <Layout>
      <SEO title='Reset password'></SEO>
      <Container maxWidth='xs'>
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>

          <Typography component='h1' variant='h5'>
            Forgot Password ?
          </Typography>
          <Formik
            initialValues={{
              email: ''
            }}
            validationSchema={yup.object().shape({
              email: yup
                .string()
                .email('Invalid Email')
                .required('Email required')
            })}
            onSubmit={(values, { setSubmitting }) => {
              const { email } = values;
              sendConfirmationEmail({
                variables: {
                  email
                }
              });
              setSubmitting(false);
            }}>
            {formik => {
              // eslint-disable-next-line default-case
              switch (step) {
                case 1:
                  return (
                    <ForgotPasswordEmailForm
                      classes={classes}
                      formik={formik}
                      loading={loading}
                      error={error}></ForgotPasswordEmailForm>
                  );

                case 2:
                  return (
                    <SetNewPasswordForm
                      classes={classes}
                      email={formik.values.email}
                      data={data}></SetNewPasswordForm>
                  );
              }
            }}
          </Formik>
        </div>
      </Container>
    </Layout>
  );
};

export default ResetPassword;
