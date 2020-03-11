import {
  Avatar,
  Button,
  Card,
  CardMedia,
  Container,
  Grid,
  InputLabel,
  Typography
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { Formik } from 'formik';
import { navigate } from 'gatsby';
import gql from 'graphql-tag';
import React from 'react';
import { useMutation } from 'react-apollo';
import * as yup from 'yup';
import AvailablePlans from '../../../brand/Dashboard/plans/buy/AvailablePlans';
import GraphqlErrorMessage from '../../../core/GraphqlErrorMessage';
import { TextField } from 'formik-material-ui';

const useStyles = makeStyles(theme => ({
  card: {
    height: '100%',
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

const ADMIN_ADD_BRAND = gql`
  mutation($data: AdminAddBrandInput!) {
    adminAddBrand(input: $data) {
      brand {
        id
        publicUsername
      }
    }
  }
`;

const AddNewBrand = () => {
  const classes = useStyles();

  // Mutation for creating brand
  const [createBrand, { loading, error, data }] = useMutation(ADMIN_ADD_BRAND, {
    onCompleted(data) {
      const brandUsername = data.adminAddBrand.brand.publicUsername;
      navigate(`/brand/${brandUsername}`);
    }
  });

  return (
    <Formik
      initialValues={{
        brandName: '',
        brandUsername: '',
        ownerEmail: '',
        planId: ''
      }}
      validationSchema={yup.object().shape({
        brandName: yup.string().required('Required!'),
        brandUsername: yup.string().required('Required!'),
        ownerEmail: yup
          .string()
          .email('Invalid email')
          .required('Required!'),
        heroImg64: yup
          .string()
          .min(100)
          .required('Required!'),
        planId: yup
          .string()
          .min(3)
          .required('Required!')
      })}
      onSubmit={(values, { setSubmitting }) => {
        createBrand({
          variables: {
            data: { ...values }
          }
        });
        setSubmitting(false);
      }}>
      {formik => {
        const { values } = formik;

        // Image handle change
        const handleFileChange = files => {
          const file = files[0];

          const reader = new FileReader();
          reader.readAsDataURL(file);

          reader.onload = fileLoadEvent => {
            const { result } = fileLoadEvent.target;
            formik.setFieldValue('heroImg64', result);
          };
        };

        const handlePlanSelect = (planId, amount) => {
          formik.setFieldValue('planId', planId);
        };

        return (
          <>
            <input
              accept='image/jpeg, image/png'
              onChange={e => handleFileChange(e.target.files)}
              style={{ display: 'none' }}
              id='brand-hero-img'
              aria-label='brand-hero-img'
              type='file'
            />

            <InputLabel htmlFor='brand-hero-img'>
              <Card component='span' className={classes.card}>
                {values.heroImg64 ? (
                  <CardMedia
                    className={classes.cardMedia}
                    image={values.heroImg64}
                    title='Brand hero image'
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
                      Upload a picture of the Brand/company Logo.
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
                  Brand Registration
                </Typography>
                <form className={classes.form}>
                  <Grid container justify='center'>
                    <Grid item xs={12} md={12}>
                      <AvailablePlans
                        filterFreePlans={false}
                        handlePlanSelect={handlePlanSelect}
                        selectedPlan={values.planId}></AvailablePlans>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        name='ownerEmail'
                        label='Owner email'
                        margin='none'
                        variant='outlined'
                        placeholder='Email'
                        fullWidth></TextField>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        name='brandName'
                        margin='none'
                        variant='outlined'
                        placeholder='Brand Name'
                        fullWidth></TextField>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        name='brandUsername'
                        margin='none'
                        variant='outlined'
                        placeholder='Brand Username'
                        fullWidth></TextField>
                    </Grid>
                    <Grid item md={12} xs={12}>
                      {error && (
                        <GraphqlErrorMessage
                          error={error}></GraphqlErrorMessage>
                      )}
                    </Grid>
                    <Button
                      disabled={loading || data}
                      onClick={formik.handleSubmit}
                      fullWidth
                      variant='contained'
                      color='secondary'
                      className={classes.submit}>
                      {data ? 'Done' : 'Add brand'}
                    </Button>
                    <br></br>
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

export default AddNewBrand;
