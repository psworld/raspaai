import React from 'react';
import {
  Button,
  Card,
  CardMedia,
  InputLabel,
  Typography,
  Container,
  Grid,
  TextField,
  Avatar,
  InputAdornment,
  useMediaQuery
} from '@material-ui/core';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { useTheme } from '@material-ui/core/styles';
import { makeStyles } from '@material-ui/core/styles';
import Link from '../../core/Link';
import gql from 'graphql-tag';
import { useMutation } from 'react-apollo';
import GraphqlErrorMessage from '../../core/GraphqlErrorMessage';

const useStyles = makeStyles(theme => ({
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    marginBottom: theme.spacing(2)
  },
  cardMediaMobile: {
    // paddingTop: "56.25%", // 16:9
    paddingTop: '75%' // 4:3
  },
  cardMediaTv: {
    // paddingTop: "56.25%", // 16:9
    paddingTop: '37.5%' // 4:3
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

const SUBMIT_BRAND_APPLICATION = gql`
  mutation(
    $publicUsername: String!
    $imgName: String!
    $heroImg64: String!
    $userEmail: String!
    $brandName: String!
  ) {
    brandRegisterApplication(
      input: {
        publicUsername: $publicUsername
        imgName: $imgName
        userEmail: $userEmail
        heroImg64: $heroImg64
        brandName: $brandName
      }
    ) {
      brandApplication {
        id
        brand {
          publicUsername
          application {
            id
            status {
              id
              statusCode
              title
              description
            }
          }
        }
      }
    }
  }
`;

const AddNewBrand = () => {
  const classes = useStyles();
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up('sm'));

  const [img, setImg] = React.useState(false);

  const [values, setValues] = React.useState({
    brandName: '',
    brandUsername: '',
    userEmail: ''
  });
  const { brandName, brandUsername, userEmail } = values;

  // Mutation for application submit
  const [submitApplication, { loading, error, data, called }] = useMutation(
    SUBMIT_BRAND_APPLICATION,
    {
      variables: {
        publicUsername: brandUsername,
        brandName,
        userEmail,
        imgName: img ? img.file.name : null,
        heroImg64: img ? img.base64 : null
      }
    }
  );

  // Form inputs handleChange
  const handleChange = event => {
    setValues({ ...values, [event.target.id]: event.target.value });
  };

  // Image handle change
  const handleFileChange = files => {
    const file = files[0];

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = fileLoadEvent => {
      const { result } = fileLoadEvent.target;
      const img = {
        base64: result,
        file: file
      };
      setImg(img);
    };
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
          {img ? (
            <CardMedia
              className={
                matches ? classes.cardMediaTv : classes.cardMediaMobile
              }
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
          <form className={classes.form} noValidate>
            <Grid container spacing={2} justify='center'>
              <Grid item xs={12} sm={6}>
                <TextField
                  id='userEmail'
                  defaultValue={userEmail}
                  onChange={handleChange}
                  margin='none'
                  variant='outlined'
                  name='Email'
                  placeholder='Email'
                  fullWidth></TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  id='brandName'
                  defaultValue={brandName}
                  onChange={handleChange}
                  // onBlur={handleBlur}
                  // label={
                  //   touched.brandName && errors.brandName
                  //     ? `${errors.brandName}`
                  //     : "Your Brand Name"
                  // }
                  // error={touched.brandName && errors.brandName && true}
                  margin='none'
                  variant='outlined'
                  placeholder='Brand Name'
                  fullWidth></TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  id='brandUsername'
                  // label={
                  //   touched.brandUsername && errors.brandUsername
                  //     ? `${errors.brandUsername}`
                  //     : "Brand Username"
                  // }
                  // error={touched.brandUsername && errors.brandUsername && true}
                  // onBlur={handleBlur}
                  defaultValue={brandUsername}
                  onChange={handleChange}
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
                onClick={submitApplication}
                fullWidth
                variant='contained'
                color='secondary'
                className={classes.submit}>
                {data ? 'Done' : 'Submit Application'}
              </Button>
              <br></br>

              <br></br>
              {/* <Grid item>
                <Link to='/brand-register' variant='body2'>
                  Need Help ?
                </Link>
              </Grid>
              <Grid item>
                <a href='/signup' variant='body2'>
                  Watch a video on how to register
                </a>
              </Grid> */}
            </Grid>
          </form>
        </div>
      </Container>
    </>
  );
};

export default AddNewBrand;
