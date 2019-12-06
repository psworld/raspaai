import React from 'react';
import Layout from '../../components/layout';
import SEO from '../../components/seo';

import { makeStyles } from '@material-ui/core/styles';
import {
  Typography,
  Container,
  Avatar,
  Button,
  Grid,
  TextField,
  ListItem,
  ListItemText
} from '@material-ui/core';

import LockOutlinedIcon from '@material-ui/icons/LockOutlined';

import { Formik } from 'formik';
import * as yup from 'yup';

import EmailInput from '../../components/core/input/EmailInput';
import { Link } from 'gatsby';
import GraphqlErrorMessage from '../../components/core/GraphqlErrorMessage';
import gql from 'graphql-tag';
import { useMutation } from 'react-apollo';

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
  console.info(jwtData);
  const { jwtEncodedStr } = jwtData.forgotPasswordEmailVerification;

  const [setNewPassword, { loading, error, data, called }] = useMutation(
    RESET_PASSWORD,
    {
      onCompleted: () =>
        navigate('/signin', {
          state: {
            message: 'Password reset successful',
            redirectUrl: '/'
          }
        })
    }
  );

  return (
    <Formik
      validationSchema={yup.object().shape({
        keyCode: yup
          .string('Invalid key')
          .length(4, 'key must be 4 digit long')
          .required('Required'),
        password1: yup
          .string()
          .min(8, 'Password is too short')
          .max(16, 'Password is too long')
          .required('Required'),
        password2: yup
          .string()
          .oneOf([yup.ref('password1'), ''], 'Password do not match')
          .required('Required')
      })}
      onSubmit={(values, { setSubmitting }) => {
        setNewPassword({
          variables: { ...values, email, jwtEncodedStr }
        });
        setSubmitting(false);
      }}>
      {formik => {
        const {
          values: { password1, password2, keyCode },
          handleBlur,
          handleChange,
          touched,
          errors,
          handleSubmit,
          isSubmitting
        } = formik;

        function hasError(id, bool) {
          if (touched[id] && errors[id]) {
            return bool ? true : errors[id];
          } else {
            return false;
          }
        }
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
                  error={errors.keyCode && touched.keyCode}
                  name='keyCode'
                  value={keyCode}
                  label={
                    errors.keyCode && touched.keyCode
                      ? errors.keyCode
                      : '4 Digit Key'
                  }
                  type='number'
                  id='keyCode'
                  onChange={handleChange}
                  onBlur={handleBlur}
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
                  id='password1'
                  error={hasError('password1', true)}
                  label={
                    hasError('password1', true)
                      ? hasError('password1')
                      : 'New Password'
                  }
                  autoComplete='current-password'
                  value={password1}
                  onBlur={handleBlur}
                  onChange={handleChange}
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
                  id='password2'
                  error={hasError('password2', true)}
                  label={
                    hasError('password2', true)
                      ? hasError('password2')
                      : 'New Password Confirm'
                  }
                  autoComplete='current-password'
                  value={password2}
                  onBlur={handleBlur}
                  onChange={handleChange}
                />
              </Grid>
            </Grid>

            {error && (
              <GraphqlErrorMessage
                message={error.message}
                critical={true}></GraphqlErrorMessage>
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
  const {
    values: { email },
    handleBlur,
    handleChange,
    touched,
    errors,
    handleSubmit,
    isSubmitting
  } = formik;
  return (
    <form className={classes.form} noValidate>
      <EmailInput
        handleBlur={handleBlur}
        handleChange={handleChange}
        value={email}
        touched={touched.email}
        errors={errors.email}
        autoFocus={false}></EmailInput>

      {error && (
        <GraphqlErrorMessage
          message={error.message}
          critical={true}></GraphqlErrorMessage>
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
    </form>
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
    { onCompleted: () => nextStep() }
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
              email: '',
              password: ''
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
