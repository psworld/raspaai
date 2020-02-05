import {
  Avatar,
  Button,
  Card,
  CardMedia,
  Container,
  Grid,
  InputAdornment,
  InputLabel,
  TextField,
  Typography
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import React from 'react';
import GraphqlErrorMessage from '../../../core/GraphqlErrorMessage';
import Link from '../../../core/Link';
import AvailablePlans from '../../../shop/dashboard/components/plans/buy/AvailablePlans';

const useStyles = makeStyles(theme => ({
  card: {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: theme.spacing(2)
  },
  cardMedia: {
    // paddingTop: "56.25%", // 16:9
    paddingTop: '75%', // 4:3
    [theme.breakpoints.up('sm')]: {
      paddingTop: '37.5%'
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
  img,
  localLocation,
  loading,
  error,
  data
}) => {
  const {
    values: {
      keyCode,
      shopName,
      publicUsername,
      address,
      contactNumber,
      latLng,
      planId
    },
    touched,
    errors,
    handleChange,
    setFieldValue,
    isSubmitting,
    handleSubmit,
    handleBlur
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
          {img ? (
            <CardMedia
              className={classes.cardMedia}
              image={img.base64}
              title={img.file.name}
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
          <form className={classes.form} noValidate>
            <Grid container spacing={2} justify='center'>
              <Grid item xs={12} md={12}>
                <AvailablePlans
                  handlePlanSelect={handlePlanSelect}
                  selectedPlan={planId}
                  filterFreePlans={false}></AvailablePlans>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  id='keyCode'
                  defaultValue={keyCode}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  label={
                    touched.keyCode && errors.keyCode
                      ? `${errors.keyCode}`
                      : 'Key'
                  }
                  error={touched.keyCode && errors.keyCode && true}
                  margin='none'
                  variant='outlined'
                  placeholder='Key'
                  fullWidth></TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  id='shopName'
                  defaultValue={shopName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  label={
                    touched.shopName && errors.shopName
                      ? `${errors.shopName}`
                      : 'Your Shop Name'
                  }
                  error={touched.shopName && errors.shopName && true}
                  margin='none'
                  variant='outlined'
                  placeholder='Shop Name'
                  fullWidth></TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  id='publicUsername'
                  label={
                    touched.publicUsername && errors.publicUsername
                      ? `${errors.publicUsername}`
                      : 'Shop Username'
                  }
                  error={
                    touched.publicUsername && errors.publicUsername && true
                  }
                  defaultValue={publicUsername}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  margin='none'
                  variant='outlined'
                  placeholder='Shop Username'
                  fullWidth></TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  id='address'
                  label={
                    touched.address && errors.address
                      ? `${errors.address}`
                      : 'Shop Address'
                  }
                  error={touched.address && errors.address && true}
                  defaultValue={address}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  margin='none'
                  variant='outlined'
                  placeholder='Shop Address'
                  fullWidth
                  // multiline
                ></TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  id='contactNumber'
                  label={
                    touched.contactNumber && errors.contactNumber
                      ? `${errors.contactNumber}`
                      : 'Shop Contact Number'
                  }
                  error={touched.contactNumber && errors.contactNumber && true}
                  defaultValue={contactNumber}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  type='number'
                  margin='none'
                  variant='outlined'
                  placeholder='Shop Contact Number'
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position='start'>+91</InputAdornment>
                    )
                  }}
                  // multiline
                ></TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  id='latLng'
                  defaultValue={latLng}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  label={
                    touched.latLng && errors.latLng
                      ? `${errors.latLng}`
                      : 'Lat, Lng'
                  }
                  error={touched.latLng && errors.latLng && true}
                  margin='none'
                  variant='outlined'
                  placeholder='Lat, Lng'
                  fullWidth></TextField>
              </Grid>
              <br></br>
              {/* <Grid item xs={12} sm={12} md={12}>
                <Typography variant='h4' align='center'>
                  Return Refund Policy
                </Typography>
                {returnRefundPolicy.map((policy, index) => (
                  <TextField
                    key={index}
                    id={`${index}`}
                    value={policy}
                    onChange={e => handleReturnRefundPolicyChange(e)}
                    fullWidth
                    margin='normal'
                    placeholder='Return refund policy'
                    multiline
                  />
                ))}
              </Grid> */}

              <Button
                // type="submit"
                disabled={loading || isSubmitting}
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
