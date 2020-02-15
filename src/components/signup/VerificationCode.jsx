import { ListItem, ListItemText } from '@material-ui/core';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import AccountCircle from '@material-ui/icons/AccountCircle';
import { Formik } from 'formik';
import { TextField } from 'formik-material-ui';
import { navigate } from 'gatsby';
import gql from 'graphql-tag';
import React from 'react';
import { useMutation, useQuery } from 'react-apollo';
import * as yup from 'yup';

const useStyles = makeStyles(theme => ({
  '@global': {
    body: {
      backgroundColor: theme.palette.common.white
    }
  },
  paper: {
    marginTop: theme.spacing(1),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  sent: {
    // marginTop: theme.spacing(1),
    // marginBottom: theme.spacing(1),
    margin: theme.spacing(1),
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

const CREATE_USER = gql`
  mutation($jwtEncodedStr: String!, $keyCode: Int!, $email: String!) {
    createUser(
      input: { jwtEncodedStr: $jwtEncodedStr, keyCode: $keyCode, email: $email }
    ) {
      user {
        id
        email
      }
    }
  }
`;

const JWT_ENC_STR = gql`
  {
    enc @client
  }
`;

const VerificationCode = props => {
  const classes = useStyles();

  const { email, prevStep } = props;

  const {
    data: { enc: jwtEncodedStr }
  } = useQuery(JWT_ENC_STR);

  const [createUser, { loading, error }] = useMutation(CREATE_USER);
  return (
    <React.Fragment>
      <code className={classes.sent}>
        <Typography component='h1' variant='h5'>
          Verification code has been sent to your email. Check you email
        </Typography>
      </code>
      <Container component='main' maxWidth='xs'>
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <AccountCircle />
          </Avatar>
          <Typography component='h1' variant='h5'>
            Verify
          </Typography>
          <form className={classes.form} noValidate>
            <Formik
              initialValues={{ key: null }}
              validationSchema={yup.object().shape({
                key: yup
                  .number('Invalid key')
                  .integer('Invalid key')
                  .min(1000, 'key must be 4 digit long')
                  .max(9999, 'Key must be 4 digit long')
                  .required('Required')
              })}
              onSubmit={(values, { setSubmitting }) => {
                const { key: keyCode } = values;
                createUser({
                  variables: {
                    jwtEncodedStr,
                    keyCode,
                    email
                  }
                })
                  .then(() =>
                    navigate('/signin/?next=/', {
                      state: {
                        message: 'Account created successfully'
                      }
                    })
                  )
                  .catch(err => {
                    setTimeout(() => prevStep(), 1000);
                  });
              }}>
              {props => {
                const { isSubmitting, handleSubmit } = props;
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
                          name='key'
                          label='4 Digit Key'
                          type='number'
                          id='key'
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <ListItem>
                          <code>
                            <ListItemText
                              color='red'
                              secondary='If you would like to edit your email you can click back.'
                            />
                          </code>
                        </ListItem>
                      </Grid>
                    </Grid>

                    {error && (
                      <p style={{ color: 'red' }}>
                        An error occurred. Please try again
                      </p>
                    )}
                    <Button
                      onClick={handleSubmit}
                      fullWidth
                      variant='contained'
                      color='primary'
                      className={classes.submit}
                      disabled={isSubmitting || loading}>
                      Continue
                    </Button>

                    <Button
                      onClick={prevStep}
                      fullWidth
                      variant='contained'
                      color='default'
                      // className={classes.submit}
                    >
                      Back
                    </Button>
                  </>
                );
              }}
            </Formik>
          </form>
        </div>
      </Container>
    </React.Fragment>
  );
};

export default VerificationCode;
