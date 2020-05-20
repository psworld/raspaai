import { Container } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { Formik } from 'formik';
import { navigate } from 'gatsby';
import React from 'react';
import { useApolloClient } from 'react-apollo';
import { usePosition } from 'use-position';
import * as yup from 'yup';
import Link from '../../components/core/Link';
import { encryptText } from '../../components/core/utils';
import Layout from '../../components/layout';
import { TextField } from 'formik-material-ui';

const useStyles = makeStyles(theme => ({
  container: {
    // width: "100%",
    margin: 4
    // backgroundColor: theme.palette.background.paper,
  },
  nested: {
    paddingLeft: theme.spacing(4)
  }
}));

const errorMessageList = [
  {
    primary: 'Device GPS is turned off',
    secondary: <span>Turn on your device GPS and reload this page.</span>
  },
  {
    primary: 'User denied to give permission',
    secondary: (
      <span>Reload the page and give us permission to access the location</span>
    )
  },
  {
    primary: 'Geo location is not supported by browser',
    secondary: (
      <span>
        You can always choose from one of the saved places. Click below to
        choose a popular place.
      </span>
    )
  }
];

const AutomaticLocation = () => {
  const classes = useStyles();
  const { latitude, longitude, timestamp, accuracy, error } = usePosition();

  const client = useApolloClient();

  return (
    <Layout>
      {error ? (
        <div className={classes.container}>
          <Typography variant='h6' color='secondary'>
            Getting location automatically failed due to one of the following
            reasons.
          </Typography>
          <List>
            {errorMessageList.map((message, index) => (
              <ListItem key={index}>
                <ListItemText
                  primary={message.primary}
                  secondary={
                    <span>&ensp;&ensp; {message.secondary}</span>
                  }></ListItemText>
              </ListItem>
            ))}
          </List>
          <Button
            component={Link}
            to='/set-location/#places'
            color='primary'
            variant='contained'>
            Set Location
          </Button>
        </div>
      ) : longitude && latitude ? (
        <Formik
          initialValues={{ name: '' }}
          validationSchema={yup.object().shape({
            name: yup
              .string('Invalid name')
              .min(1, 'Too small!')
              .max(30, 'Too large!')
              .required('Required!')
          })}
          onSubmit={(values, { setSubmitting }) => {
            const location = {
              name: values.name,
              lat: latitude,
              lng: longitude
            };
            const encLocation = encryptText(JSON.stringify(location));

            localStorage.setItem('lla', encLocation);
            client.writeData({
              data: { localSavedLocation: encLocation }
            });
            navigate('/');

            setSubmitting(false);
          }}>
          {formik => {
            return (
              <Container maxWidth='sm'>
                <Typography
                  color='secondary'
                  style={{ margin: 8 }}
                  align='center'
                  variant='h6'>
                  Enter the name of the location and click save.
                </Typography>

                <br></br>
                <TextField
                  name='name'
                  variant='outlined'
                  fullWidth
                  required
                  label='Location Name'></TextField>
                <br></br>
                <br></br>
                <center>
                  <Button
                    disabled={formik.isSubmitting}
                    onClick={() => formik.handleSubmit()}
                    variant='contained'
                    color='primary'>
                    Save
                  </Button>
                </center>
              </Container>
            );
          }}
        </Formik>
      ) : (
        <div>
          <Typography style={{ margin: 5 }} align='center' variant='h4'>
            We are fetching you current location.
          </Typography>
          <br></br>
          <Typography
            style={{ marginBottom: 3 }}
            variant='body2'
            align='center'
            color='primary'
            paragraph>
            * Allow us to access your location. Requires GPS for accuracy.
          </Typography>
        </div>
      )}
    </Layout>
  );
};

export default AutomaticLocation;
