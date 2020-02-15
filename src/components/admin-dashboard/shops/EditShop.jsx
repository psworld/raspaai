import React from 'react';
import { Formik } from 'formik';
import { TextField } from 'formik-material-ui';
import {
  Grid,
  Container,
  Button,
  InputAdornment,
  Typography,
  InputLabel,
  Card,
  CardMedia
} from '@material-ui/core';
import { gql } from 'apollo-boost';
import { useMutation, useQuery } from 'react-apollo';
import GraphqlErrorMessage from '../../core/GraphqlErrorMessage';
import Loading from '../../core/Loading';
import * as yup from 'yup';
import { makeStyles } from '@material-ui/core/styles';
import { updatedDiff } from 'deep-object-diff';

const SHOP = gql`
  query($shopUsername: String!) {
    shop(publicShopUsername: $shopUsername) {
      id
      geometry {
        coordinates
      }
      properties {
        title
        publicUsername
        contactNumber
        heroImage
        address
        owner {
          id
          email
        }
      }
    }
  }
`;

const EDIT_SHOP = gql`
  mutation($data: AdminEditShopInput!) {
    adminEditShop(input: $data) {
      shop {
        id
        geometry {
          coordinates
        }
        properties {
          title
          publicUsername
          contactNumber
          heroImage
          address
          owner {
            id
            email
          }
        }
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
    // marginTop: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },

  form: {
    width: '100%', // Fix IE 11 issue.
    // marginTop: theme.spacing(1),
    margin: theme.spacing(1)
  }
}));

const EditShop = ({ shopUsername }) => {
  const classes = useStyles();

  const shopQuery = useQuery(SHOP, { variables: { shopUsername } });

  const [editShop, { loading, error, data }] = useMutation(EDIT_SHOP);

  if (shopQuery.loading) return <Loading></Loading>;
  if (shopQuery.error)
    return <GraphqlErrorMessage error={shopQuery.error}></GraphqlErrorMessage>;

  if (shopQuery.data) {
    const {
      id: shopId,
      geometry: { coordinates },
      properties: {
        title: shopName,
        publicUsername,
        contactNumber,
        heroImage,
        address,
        owner: { email: ownerEmail }
      }
    } = shopQuery.data.shop;
    const lat = coordinates[1];
    const lng = coordinates[0];
    const latLng = `${lat}, ${lng}`;

    let formikProps = {};
    return (
      <Formik
        initialValues={{
          shopId,
          publicUsername,
          ownerEmail,
          shopName,
          contactNumber: parseInt(contactNumber),
          heroImage: `${process.env.GATSBY_IMG_URL_PRE}/${heroImage}`,
          address,
          latLng
        }}
        validationSchema={yup.object().shape({
          ownerEmail: yup
            .string()
            .email('Invalid email')
            .required('Email is required'),
          shopName: yup
            .string()
            .required('Shop name required')
            .max(100, 'Shop name can not be longer than 100 characters')
            .min(3, 'Shop name must be at least 3 character long'),
          publicUsername: yup
            .string()
            .matches(/^[a-zA-Z0-9_.]+$/, {
              message: 'Only letters numbers _ . are allowed. No empty spaces.',
              excludeEmptyString: true
            })
            .required('Shop username required')
            .min(5, 'Username must be 5 characters long')
            .max(30, 'Username can be max 30 characters long'),
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
          latLng: yup.string().required('Lat Lng string required'),
          heroImage: yup.string().required('Shop image required')
        })}
        onSubmit={(values, { setSubmitting }) => {
          const updatedDifference = updatedDiff(
            formikProps.initialValues,
            values
          );
          editShop({ variables: { data: { shopId, ...updatedDifference } } });
          setSubmitting(false);
        }}>
        {formik => {
          formikProps = formik;

          const { values } = formik;
          const handleFileChange = e => {
            const files = e.target.files;
            const file = files[0];

            const reader = new FileReader();
            reader.readAsDataURL(file);

            reader.onload = fileLoadEvent => {
              const { result } = fileLoadEvent.target;
              const heroImage = result;
              formik.setFieldValue('heroImage', heroImage);
            };
          };

          return (
            <>
              <input
                accept='image/jpeg, image/png'
                onChange={handleFileChange}
                style={{ display: 'none' }}
                id='shop-hero-img'
                aria-label='shop-hero-img'
                type='file'
              />

              <InputLabel htmlFor='shop-hero-img'>
                <Card component='span' className={classes.card}>
                  {values.heroImage ? (
                    <CardMedia
                      className={classes.cardMedia}
                      image={values.heroImage}
                      title={values.shopName}
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
                        Upload a picture of the shop owner(s)/manager in front
                        of the store.
                      </Typography>
                    </Container>
                  )}
                </Card>
              </InputLabel>
              <Container maxWidth='md'>
                <div className={classes.paper}>
                  <Typography component='h1' variant='h5'>
                    Shop Edit
                  </Typography>
                  <form className={classes.form}>
                    <Grid container spacing={2} justify='center'>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          name='shopName'
                          label='Your Shop Name'
                          margin='none'
                          variant='outlined'
                          placeholder='Shop Name'
                          fullWidth></TextField>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          name='publicUsername'
                          label='Shop Username'
                          margin='none'
                          variant='outlined'
                          placeholder='Shop Username'
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
                          label='Shop Address'
                          margin='none'
                          variant='outlined'
                          placeholder='Shop Address'
                          fullWidth
                          multiline></TextField>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          name='contactNumber'
                          label='Shop Contact Number'
                          type='number'
                          margin='none'
                          variant='outlined'
                          placeholder='Shop Contact Number'
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
                          name='latLng'
                          label='Lat, Lng'
                          margin='none'
                          variant='outlined'
                          placeholder='Lat, Lng'
                          fullWidth></TextField>
                      </Grid>
                      <br></br>
                      {data && (
                        <p style={{ color: 'green' }}>
                          Changes saved successfully
                        </p>
                      )}
                      <Button
                        disabled={
                          loading || formik.isSubmitting || !formik.dirty
                        }
                        onClick={formik.handleSubmit}
                        fullWidth
                        variant='contained'
                        color='secondary'>
                        Save changes
                      </Button>
                      {error && (
                        <GraphqlErrorMessage
                          error={error}></GraphqlErrorMessage>
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
  }
};

export default EditShop;
