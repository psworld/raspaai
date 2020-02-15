import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { TextField } from 'formik-material-ui';
import React from 'react';
import GraphqlErrorMessage from '../core/GraphqlErrorMessage';
import Link from '../core/Link';

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

export default function SignupForm({ formik, loading, error }) {
  const { isSubmitting, handleSubmit } = formik;

  const classes = useStyles();

  return (
    <Container maxWidth='xs'>
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component='h1' variant='h5'>
          Sign up
        </Typography>
        <form className={classes.form} noValidate>
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
                label={'Password'}
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
            <Grid item xs={12}>
              <code>
                A confirmation email will be sent to your email address.
              </code>
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
            Sign Up
          </Button>

          <Grid container justify='flex-end'>
            <Grid item>
              <Link to='/signin' variant='body2'>
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  );
}
