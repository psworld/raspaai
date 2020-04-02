import {
  Avatar,
  Button,
  Card,
  CardMedia,
  Container,
  Grid,
  InputAdornment,
  InputLabel,
  List,
  ListItem,
  ListItemText,
  Typography,
  Table,
  TableRow,
  TableCell
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { Formik } from 'formik';
import { TextField } from 'formik-material-ui';
import gql from 'graphql-tag';
import React from 'react';
import { useQuery, useMutation } from 'react-apollo';
import * as yup from 'yup';
import ErrorPage from '../core/ErrorPage';
import Link from '../core/Link';
import Loading from '../core/Loading';
import { updatedDiff } from '../core/utils';
import GraphqlErrorMessage from '../core/GraphqlErrorMessage';
import SEO from '../seo';
import { VIEWER } from '../navbar/ToolBarMenu';

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

const SHOP_APPLICATION = gql`
  query($applicationId: ID!) {
    shopApplication(id: $applicationId) {
      id
      status {
        id
        title
        statusCode
        description
      }
      submittedAt
      updatedAt
      errors
      shop {
        id
        properties {
          title
          publicUsername
          contactNumber
          website
          heroImage
          address
        }
      }
    }
  }
`;

const MODIFY_SHOP_APPLICATION = gql`
  mutation($data: ModifyShopApplicationInput!) {
    modifyShopApplication(input: $data) {
      shopApplication {
        id
        updatedAt
        shop {
          id
          properties {
            title
            publicUsername
            contactNumber
            website
            heroImage
            address
          }
        }
        status {
          id
          statusCode
          title
          description
        }
        errors
      }
    }
  }
`;

const DELETE_SHOP_APPLICATION = gql`
  mutation($applicationId: ID!) {
    deleteShopApplication(input: { applicationId: $applicationId }) {
      resp
    }
  }
`;

const ShopApplicationStatus = ({ applicationId }) => {
  const classes = useStyles();

  const { loading, error, data } = useQuery(SHOP_APPLICATION, {
    variables: { applicationId }
  });
  const [saveChanges, mutationProps] = useMutation(MODIFY_SHOP_APPLICATION);
  const [deleteApplication, deleteApplicationProps] = useMutation(
    DELETE_SHOP_APPLICATION,
    {
      variables: { applicationId },
      update(store, { data }) {
        const { viewer } = store.readQuery({ query: VIEWER });
        viewer.shop = null;
        store.writeQuery({ query: VIEWER, data: { viewer } });
      },
      onCompleted() {
        window.scrollTo(0, 0);
      }
    }
  );

  if (loading) return <Loading></Loading>;
  if (error) return <ErrorPage></ErrorPage>;

  if (
    deleteApplicationProps.data &&
    deleteApplicationProps.data.deleteShopApplication
  ) {
    return (
      <div style={{ padding: 10 }}>
        <Typography style={{ color: 'green' }} variant='h4' align='center'>
          Application Deleted Successfully.
        </Typography>
        <br></br>
        <center>
          <Typography variant='h5' component={Link} to='/'>
            Back to home
          </Typography>
        </center>
      </div>
    );
  }

  if (data && data.shopApplication) {
    const {
      id,
      status: { title: status, statusCode, description: statusDescription },
      errors,
      submittedAt,
      updatedAt,
      shop: {
        properties: {
          title: shopName,
          contactNumber,
          publicUsername: shopUsername,
          address,
          heroImage,
          website
        }
      }
    } = data.shopApplication;

    let formikProps;

    return (
      <Formik
        initialValues={{
          shopName,
          shopUsername,
          address,
          contactNumber,
          website,
          heroImage
        }}
        validationSchema={yup.object().shape({
          shopName: yup
            .string()
            .required('Required')
            .max(100, 'Shop name can not be longer than 100 characters')
            .min(3, 'Shop name must be at least 3 character long'),
          shopUsername: yup
            .string()
            .matches(/^[a-zA-Z0-9_.]+$/, {
              message: 'Only letters numbers _ . are allowed. No empty spaces.',
              excludeEmptyString: true
            })
            .required('Required')
            .min(5, 'Username must be 5 characters long')
            .max(30, 'Username can be max 30 characters long'),
          address: yup
            .string()
            .required('Required')
            .min(10, 'Too short')
            .max(255, 'Too long'),
          contactNumber: yup
            .string()
            .matches(/^[1-9]\d{9}$/, {
              message: 'Please enter valid number.',
              excludeEmptyString: false
            })
            .required('Required'),
          website: yup.string().url('Invalid url'),
          heroImage: yup
            .string()
            .min(10)
            .required('Shop image is required')
        })}
        onSubmit={(values, { setSubmitting }) => {
          const updatedChanges = updatedDiff(formikProps.initialValues, values);

          if (formikProps.dirty) {
            saveChanges({
              variables: { data: { ...updatedChanges, applicationId } }
            });
          }
          setSubmitting(false);
        }}>
        {formik => {
          formikProps = formik;
          const { values } = formik;

          const handleFileChange = files => {
            const file = files[0];

            const reader = new FileReader();
            reader.readAsDataURL(file);

            reader.onload = fileLoadEvent => {
              const { result } = fileLoadEvent.target;
              formik.setFieldValue('heroImage', result);
            };
          };

          const preUrl = process.env.GATSBY_IMG_URL_PRE;

          const heroImage = values.heroImage.includes('base64')
            ? values.heroImage
            : `${preUrl}/${values.heroImage}`;

          return (
            <>
              <SEO
                title='Shop Application Status'
                description='Check status of your shop application.'></SEO>
              <Container maxWidth='sm'>
                <List>
                  <ListItem>
                    <ListItemText
                      primary={
                        <>
                          Application status : <span>{status}</span>
                        </>
                      }
                      secondary={statusDescription}></ListItemText>
                  </ListItem>
                </List>

                {statusCode !== 'under_review' && (
                  <Table>
                    {Object.keys(JSON.parse(errors)).map(key => {
                      const value = JSON.parse(errors)[key];
                      return (
                        <TableRow key={key}>
                          <TableCell component='th' scope='row'>
                            <Typography>{key}</Typography>
                          </TableCell>
                          <TableCell>
                            <Typography>{value}</Typography>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </Table>
                )}
              </Container>
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
                  {values.heroImage && (
                    <CardMedia
                      className={classes.cardMedia}
                      image={heroImage}
                      title='Shop owner(s) image in front of store.'
                    />
                  )}
                </Card>
              </InputLabel>
              {formik.touched.heroImage && formik.errors.heroImage && (
                <Typography style={{ color: 'red' }} align='center'>
                  {formik.errors.heroImage}
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
                  <form className={classes.form} noValidate>
                    <Grid container spacing={2} justify='center'>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          name='shopName'
                          label='Your Shop Name'
                          margin='none'
                          variant='outlined'
                          placeholder='Shop Name'
                          required
                          fullWidth></TextField>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          name='shopUsername'
                          label='Shop Username'
                          margin='none'
                          variant='outlined'
                          placeholder='Shop Username'
                          required
                          fullWidth></TextField>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          name='address'
                          label='Shop Address'
                          margin='none'
                          variant='outlined'
                          placeholder='Shop Address'
                          required
                          fullWidth
                          // multiline
                        ></TextField>
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
                              <InputAdornment position='start'>
                                +91
                              </InputAdornment>
                            )
                          }}
                          // multiline
                        ></TextField>
                      </Grid>

                      <Grid item xs={12} sm={12}>
                        <TextField
                          name='website'
                          label='Shop Website'
                          margin='none'
                          variant='outlined'
                          placeholder='eg. https://www.raspaai.tk or http://www.raspaai.tk'
                          fullWidth></TextField>
                      </Grid>
                      <br></br>

                      <Grid item xs={12} md={12}>
                        {mutationProps.error && (
                          <GraphqlErrorMessage
                            error={mutationProps.error}></GraphqlErrorMessage>
                        )}
                        <br></br>
                        {mutationProps.data && (
                          <Typography align='center' style={{ color: 'green' }}>
                            Changes saved successfully
                          </Typography>
                        )}
                        {deleteApplicationProps.error && (
                          <GraphqlErrorMessage
                            error={deleteApplicationProps.error}
                            critical></GraphqlErrorMessage>
                        )}
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <Button
                          fullWidth
                          onClick={formik.handleSubmit}
                          disabled={
                            !formik.dirty ||
                            mutationProps.loading ||
                            deleteApplicationProps.loading
                          }
                          variant='contained'
                          color='primary'>
                          Save changes
                        </Button>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Button
                          onClick={deleteApplication}
                          disabled={
                            mutationProps.loading ||
                            deleteApplicationProps.loading
                          }
                          fullWidth
                          variant='contained'
                          color='secondary'
                          className={classes.submit}>
                          Delete Application
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
  return (
    <Typography variant='h5' align='center'>
      No application with that id found
    </Typography>
  );
};

export default ShopApplicationStatus;
