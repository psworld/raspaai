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
import { TextField } from 'formik-material-ui';
import React from 'react';
import Link from '../../core/Link';
import GraphqlErrorMessage from '../../core/GraphqlErrorMessage';
import { useQuery } from 'react-apollo';
import { VIEWER } from '../../navbar/ToolBarMenu';
import Loading from '../../core/Loading';
import ErrorPage from '../../core/ErrorPage';
import { navigate } from 'gatsby';

const useStyles = makeStyles(theme => ({
  card: {
    // height: "100%",
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

const CreateShopForm = ({
  handleBack,
  formik,
  mutationProps,
  handleFileChange,
  localLocation
}) => {
  const { loading } = mutationProps;
  const {
    handleSubmit,
    dirty,
    values: { heroImg64 }
  } = formik;

  const classes = useStyles();

  const { loading: userLoading, error, data } = useQuery(VIEWER);

  if (userLoading) return <Loading></Loading>;
  if (error) return <ErrorPage></ErrorPage>;

  if (data && data.viewer !== null) {
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
            {heroImg64 ? (
              <CardMedia
                className={classes.cardMedia}
                image={heroImg64}
                title='Shop owner(s) image in front of store.'
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
        {formik.touched.heroImg64 && formik.errors.heroImg64 && (
          <Typography style={{ color: 'red' }} align='center'>
            {formik.errors.heroImg64}
          </Typography>
        )}
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
                <Grid item xs={12} sm={6}>
                  <TextField
                    name='shopName'
                    label='Your Shop Name'
                    margin='none'
                    variant='outlined'
                    required
                    placeholder='Shop Name'
                    fullWidth></TextField>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name='shopUsername'
                    label='Shop Username'
                    margin='none'
                    variant='outlined'
                    required
                    placeholder='Shop Username'
                    fullWidth></TextField>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name='address'
                    label='Shop Address'
                    margin='none'
                    variant='outlined'
                    required
                    placeholder='Shop Address'
                    fullWidth></TextField>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name='contactNumber'
                    label='Shop Contact Number'
                    type='number'
                    margin='none'
                    variant='outlined'
                    placeholder='Shop Contact Number'
                    required
                    fullWidth
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position='start'>+91</InputAdornment>
                      )
                    }}></TextField>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name='website'
                    label='Shop Website'
                    margin='none'
                    variant='outlined'
                    placeholder='eg. https://www.raspaai.tk or http://www.raspaai.tk'
                    fullWidth></TextField>
                </Grid>

                {mutationProps.error && (
                  <GraphqlErrorMessage
                    error={mutationProps.error}></GraphqlErrorMessage>
                )}

                <Grid item xs={12} md={12}>
                  <Button
                    disabled={!dirty || loading}
                    onClick={handleSubmit}
                    fullWidth
                    variant='contained'
                    color='secondary'>
                    Submit Application
                  </Button>
                </Grid>
                {/* <Grid item xs>
                  <Link to='/shop-register' variant='body2'>
                    Need Help ?
                  </Link>
                </Grid>
                <Grid item>
                  <a href='/signup' variant='body2'>
                    Watch a video on how to register
                  </a>
                </Grid> */}
                <Grid item xs={12} md={12}>
                  <center>
                    <Button
                      style={{ marginTop: '10' }}
                      onClick={handleBack}
                      variant='contained'
                      color='primary'>
                      Back
                    </Button>
                  </center>
                </Grid>
              </Grid>
            </form>
          </div>
        </Container>
      </>
    );
  }
  navigate(`/signin/?next=${window.location.pathname}`);
  return (
    <Typography variant='h5' style={{ color: 'green' }} align='center'>
      You need to signin first
    </Typography>
  );
};

export default CreateShopForm;
