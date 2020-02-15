import {
  Avatar,
  Button,
  Card,
  CardMedia,
  Container,
  Grid,
  InputAdornment,
  InputLabel,
  Typography
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import React from 'react';
import GraphqlErrorMessage from '../../../core/GraphqlErrorMessage';
import Link from '../../../core/Link';
import AvailablePlans from '../../../shop/dashboard/components/plans/buy/AvailablePlans';
import { TextField } from 'formik-material-ui';

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
    marginTop: theme.spacing(1)
  }
}));

const AddShopForm = ({
  handleBack,
  formik,
  handleFileChange,
  loading,
  error,
  data
}) => {
  const {
    values: { planId, heroImage },
    setFieldValue,
    isSubmitting,
    handleSubmit
  } = formik;

  const classes = useStyles();

  const handlePlanSelect = (planId, amount) => {
    setFieldValue('planId', planId);
  };

  return (
    <>
      <input
        accept='image/jpeg, image/png'
        onChange={e => handleFileChange(e.target.files)}
        style={{ display: 'none' }}
        id='shop-hero-img'
        aria-label='shop-hero-img'
        type='file'
      />

      <InputLabel htmlFor='shop-hero-img'>
        <Card component='span' className={classes.card}>
          {heroImage ? (
            <CardMedia
              className={classes.cardMedia}
              image={heroImage.base64}
              title={heroImage.name}
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
                Upload a picture of the shop owner(s)/manager in front of the
                store.
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
            Shop Registration
          </Typography>
          <form className={classes.form}>
            <Grid container spacing={2} justify='center'>
              <Grid item xs={12} md={12}>
                <AvailablePlans
                  handlePlanSelect={handlePlanSelect}
                  selectedPlan={planId}
                  filterFreePlans={false}></AvailablePlans>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name='keyCode'
                  label='Key'
                  margin='none'
                  variant='outlined'
                  placeholder='Key'
                  fullWidth></TextField>
              </Grid>
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
                      <InputAdornment position='start'>+91</InputAdornment>
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
                <p style={{ color: 'green' }}>Shop added successfully</p>
              )}
              <Button
                disabled={loading || isSubmitting || data}
                onClick={handleSubmit}
                fullWidth
                variant='contained'
                color='secondary'
                className={classes.submit}>
                Add Shop
              </Button>
              {error && (
                <GraphqlErrorMessage error={error}></GraphqlErrorMessage>
              )}
              <Grid item xs>
                <Link to='/shop-register' variant='body2'>
                  Need Help ?
                </Link>
              </Grid>
              <Grid item>
                <a href='/signup' variant='body2'>
                  Watch a video on how to register
                </a>
              </Grid>
            </Grid>
          </form>
          <Button
            style={{ marginTop: 10 }}
            onClick={handleBack}
            variant='contained'
            color='primary'>
            Back
          </Button>
        </div>
      </Container>
    </>
  );
};

export default AddShopForm;
