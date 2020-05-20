import React from 'react';
import { useMutation } from 'react-apollo';
import * as yup from 'yup';
import { gql } from 'apollo-boost';
import { Formik } from 'formik';
import Resizer from 'react-image-file-resizer';
import {
  InputLabel,
  Card,
  CardMedia,
  Container,
  Typography,
  Avatar,
  Grid,
  InputAdornment,
  Button
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { TextField } from 'formik-material-ui';
import GraphqlErrorMessage from '../../core/GraphqlErrorMessage';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Link from '../../core/Link';

const ADD_WHOLESALER = gql`
  mutation($data: AdminAddWholesalerInput!) {
    adminAddWholesaler(input: $data) {
      wholesaler {
        id
        name
      }
    }
  }
`;

const useStyles = makeStyles(theme => ({
  card: {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: theme.spacing(2)
  },
  cardMedia: {
    // paddingTop: "56.25%", // 16:9
    paddingTop: '75%', // 4:3
    backgroundSize: 'contain',
    [theme.breakpoints.up('md')]: {
      paddingTop: '45%'
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
    // marginTop: theme.spacing(2)
    margin: theme.spacing(1)
  }
}));

const AddWholesaler = () => {
  const classes = useStyles();
  const [addWholesaler, { loading, error, data }] = useMutation(ADD_WHOLESALER);
  return (
    <Formik
      initialValues={{
        ownerEmail: '',
        name: '',
        address: '',
        contactNumber: '',
        lat: '',
        lng: '',
        image: ''
      }}
      validationSchema={yup.object().shape({
        ownerEmail: yup
          .string()
          .email('Invalid email')
          .required('Email is required'),
        name: yup
          .string()
          .required('Shop name required')
          .max(100, 'Shop name can not be longer than 100 characters')
          .min(3, 'Shop name must be at least 3 character long'),
        // publicUsername: yup
        //   .string()
        //   .matches(/^[a-zA-Z0-9_.]+$/, {
        //     message: 'Only letters numbers _ . are allowed. No empty spaces.',
        //     excludeEmptyString: true
        //   })
        //   .required('Shop username required')
        //   .min(5, 'Username must be 5 characters long')
        //   .max(30, 'Username can be max 30 characters long'),
        address: yup
          .string()
          .required('Shop address required')
          .min(10, 'Too short')
          .max(150, 'Too long'),
        contactNumber: yup
          .string()
          .matches(/^[1-9]\d{9}$/, {
            message: 'Please enter valid number.',
            excludeEmptyString: false
          })
          .required('Contact number required'),
        lat: yup.number('Invalid number'),
        lng: yup.number('Invalid number'),
        image: yup
          .object({ name: yup.string(), base64: yup.string() })
          .required()
      })}
      onSubmit={(values, { setSubmitting }) => {
        addWholesaler({
          variables: {
            data: { ...values, image: JSON.stringify(values.image) }
          }
        });
        setSubmitting(false);
      }}>
      {formik => {
        const formikValues = formik.values;
        const image = formikValues.image;

        const handleFileChange = files => {
          const file = files[0];

          try {
            Resizer.imageFileResizer(file, 720, 700, 'JPEG', 100, 0, base64 => {
              formik.setFieldValue('image', { base64, name: file['name'] });
            });
          } catch {
            Resizer.imageFileResizer(file, 720, 700, 'JPEG', 100, 0, base64 => {
              formik.setFieldValue('image', {
                base64,
                name: 'Wholesaler image'
              });
            });
          }
        };

        return (
          <>
            <input
              accept='image/jpeg, image/png'
              onChange={e => handleFileChange(e.target.files)}
              style={{ display: 'none' }}
              id='wholesaler-img'
              aria-label='wholesaler-img'
              type='file'
            />
            <InputLabel htmlFor='wholesaler-img'>
              <Card component='span' className={classes.card}>
                {image ? (
                  <CardMedia
                    className={classes.cardMedia}
                    image={image.base64}
                    title={image.name}
                  />
                ) : (
                  <Container maxWidth='sm'>
                    <Typography
                      component='h1'
                      variant='h3'
                      align='center'
                      color='textPrimary'
                      gutterBottom>
                      Click here to upload a photo
                    </Typography>
                    <Typography
                      variant='h5'
                      align='center'
                      color='textSecondary'
                      paragraph>
                      Upload a picture of the shop owner(s)/manager in front of
                      the store.
                    </Typography>
                  </Container>
                )}
              </Card>
            </InputLabel>
            <Container maxWidth='md'>
              <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                  <LockOutlinedIcon />
                </Avatar>
                <Typography component='h1' variant='h5'>
                  Wholesaler Registration
                </Typography>
                <form className={classes.form}>
                  <Grid container spacing={2} justify='center'>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        name='name'
                        label='Wholesaler Name'
                        margin='none'
                        variant='outlined'
                        placeholder='Wholesaler name'
                        fullWidth></TextField>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        name='ownerEmail'
                        label='Owner Email'
                        margin='none'
                        variant='outlined'
                        placeholder='Owner Email'
                        fullWidth></TextField>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        name='address'
                        label='Wholesaler Office Address'
                        margin='none'
                        variant='outlined'
                        placeholder='Address'
                        fullWidth
                        multiline></TextField>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        name='contactNumber'
                        label='Contact Number'
                        type='number'
                        margin='none'
                        variant='outlined'
                        placeholder='Contact Number'
                        fullWidth
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position='start'>
                              +91
                            </InputAdornment>
                          )
                        }}></TextField>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        name='lat'
                        type='number'
                        label='Latitude'
                        margin='none'
                        variant='outlined'
                        placeholder='Lat'
                        fullWidth></TextField>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        name='lng'
                        type='number'
                        label='Longitude'
                        margin='none'
                        variant='outlined'
                        placeholder='Lng'
                        fullWidth></TextField>
                    </Grid>
                    <br></br>
                    {data && (
                      <>
                        <p style={{ color: 'green' }}>
                          Wholesaler added successfully
                        </p>
                        <br />
                        <Link
                          to={`/supply-chain/wholesaler/${data.adminAddWholesaler.wholesaler.name}/${data.adminAddWholesaler.wholesaler.id}`}>
                          See wholesaler page
                        </Link>
                      </>
                    )}

                    <Button
                      disabled={loading || formik.isSubmitting || data}
                      onClick={formik.handleSubmit}
                      fullWidth
                      variant='contained'
                      color='secondary'
                      className={classes.submit}>
                      Add Wholesaler
                    </Button>
                    {error && (
                      <GraphqlErrorMessage error={error}></GraphqlErrorMessage>
                    )}
                  </Grid>
                </form>
              </div>
            </Container>
          </>
        );
      }}
    </Formik>
  );
};

export default AddWholesaler;
