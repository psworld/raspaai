import {
  Button,
  Container,
  Grid,
  List,
  ListItem,
  ListItemText,
  TableCell,
  TableRow,
  TextField as MuiTextField,
  Typography,
  Snackbar
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { gql } from 'apollo-boost';
import { Formik } from 'formik';
import { TextField } from 'formik-material-ui';
import React from 'react';
import { useQuery, useMutation } from 'react-apollo';
import * as yup from 'yup';
import GraphqlErrorMessage from '../../core/GraphqlErrorMessage';
import Link from '../../core/Link';
import Loading from '../../core/Loading';
import MainFeaturedPost from '../../templates/MainFeaturedPost';
import AddBoxIcon from '@material-ui/icons/AddBox';
import DeleteIcon from '@material-ui/icons/Delete';
import AvailablePlans from '../../shop/dashboard/components/plans/buy/AvailablePlans';
import ResponseSnackbar from '../../templates/ResponseSnackbar';
import { format } from 'date-fns';

const useStyles = makeStyles(theme => ({
  paper: {
    marginTop: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },

  form: {
    width: '100%', // Fix IE 11 issue.
    margin: theme.spacing(1)
  }
}));

const SHOP_APPLICATIONS = gql`
  query($status: String!) {
    shopApplications(
      orderBy: "updatedAt"
      status_StatusCode: $status
      first: 10
    ) {
      edges {
        node {
          id
          shop {
            id
            properties {
              title
              publicUsername
            }
          }
          updatedAt
        }
      }
    }
  }
`;

const SHOP_APPLICATION = gql`
  query($applicationId: ID!) {
    shopApplication(id: $applicationId) {
      id
      status {
        id
        statusCode
        title
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
          owner {
            id
            email
            firstName
            lastName
            isShopOwner
          }
        }
      }
    }
  }
`;

const REVIEW_SHOP_APPLICATION = gql`
  mutation($data: ReviewShopApplicationInput!) {
    reviewShopApplication(input: $data) {
      shopApplication {
        id
        updatedAt
        errors
        status {
          id
          statusCode
          title
          description
        }
      }
    }
  }
`;

export const ShopApplication = ({ applicationId }) => {
  const classes = useStyles();
  const [newField, setNewField] = React.useState({ key: '', value: '' });
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [loadPlans, setLoadPlans] = React.useState(false);
  const { loading, error, data } = useQuery(SHOP_APPLICATION, {
    variables: { applicationId }
  });

  const [review, reviewProps] = useMutation(REVIEW_SHOP_APPLICATION, {
    onCompleted() {
      setSnackbarOpen(true);
    }
  });

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  if (loading) return <Loading></Loading>;
  if (error) return <GraphqlErrorMessage error={error}></GraphqlErrorMessage>;
  if (data && data.shopApplication) {
    const {
      id,
      status: { title: status, statusCode, description: statusDescription },
      submittedAt,
      updatedAt,
      shop,
      shop: {
        properties: {
          title: shopName,
          contactNumber,
          publicUsername: shopUsername,
          address,
          heroImage,
          website,
          owner: { email, firstName, lastName, isShopOwner }
        }
      },
      errors
    } = data.shopApplication;

    let formikProps;

    const applicationSubmittedAt = format(
      new Date(submittedAt),
      'MMM d, y h:m a'
    );
    const applicationUpdatedAt = format(new Date(updatedAt), 'MMM d, y h:m a');

    return (
      <Formik
        initialValues={{
          errors: JSON.parse(errors),
          statusCode
        }}
        validationSchema={yup.object().shape({
          errors: yup.lazy(obj => {
            const errorsShape = {};
            Object.keys(obj).forEach(key => {
              errorsShape[key] = yup.string().max(500, 'Too long!');
            });
            return yup.object().shape({ ...errorsShape });
          }),
          latLngObj: yup.object({
            lat: yup.lazy(() => {
              const statusCode = formikProps.values.statusCode;
              if (statusCode === 'accepted') {
                return yup.number('Invalid number').required('Required !');
              } else {
                return yup.number('Invalid number');
              }
            }),
            lng: yup.lazy(() => {
              const statusCode = formikProps.values.statusCode;
              if (statusCode === 'accepted') {
                return yup.number('Invalid number').required('Required !');
              } else {
                return yup.number('Invalid number');
              }
            })
          }),
          planId: yup.lazy(value => {
            const statusCode = formikProps.values.statusCode;
            if (statusCode === 'accepted') {
              return yup.string().required('Plan id required !');
            } else {
              return yup.string();
            }
          }),
          statusCode: yup.string().required('No status code provided')
        })}
        onSubmit={(values, { setSubmitting }) => {
          review({
            variables: {
              data: {
                ...values,
                applicationId,
                errors: JSON.stringify(values.errors),
                latLngObj: JSON.stringify(values.latLngObj)
              }
            },
            update(
              store,
              {
                data: {
                  reviewShopApplication: { shopApplication }
                }
              }
            ) {
              const oldStatusCode = statusCode;
              const newStatusCode = shopApplication.status.statusCode;

              const {
                shopApplications: oldStatusShopApplications
              } = store.readQuery({
                query: SHOP_APPLICATIONS,
                variables: { status: oldStatusCode }
              });

              store.writeQuery({
                query: SHOP_APPLICATIONS,
                variables: { status: oldStatusCode },
                data: {
                  shopApplications: {
                    ...oldStatusShopApplications,
                    edges: oldStatusShopApplications.edges.filter(
                      e => e.node.id !== applicationId
                    )
                  }
                }
              });

              // Add the changed status application to new list
              // Do it only when status === rejected || error not when application is accepted
              if (newStatusCode !== 'accepted') {
                const {
                  shopApplications: newStatusShopApplications
                } = store.readQuery({
                  query: SHOP_APPLICATIONS,
                  variables: { status: newStatusCode }
                });

                store.writeQuery({
                  query: SHOP_APPLICATIONS,
                  variables: { status: newStatusCode },
                  data: {
                    shopApplications: {
                      ...newStatusShopApplications,
                      edges: newStatusShopApplications.edges.concat({
                        node: { ...shopApplication, shop },
                        __typename: 'ShopApplicationNodeEdge'
                      })
                    }
                  }
                });
              }
            }
          });
          setSubmitting(false);
        }}>
        {formik => {
          formikProps = formik;
          const { values } = formik;

          const handlePlanSelect = planId => {
            formik.setFieldValue('planId', planId);
          };

          const handleErrorFieldChange = e => {
            setNewField({ ...newField, [e.target.name]: e.target.value });
          };

          const handleAddKey = e => {
            const key = newField.key;
            const value = newField.value;
            formik.setFieldValue('errors', { ...values.errors, [key]: value });
            setNewField({ key: '', value: '' });
          };

          const handleDeleteKey = key => {
            const errors = values.errors;
            delete errors[key];
            formik.setFieldValue('errors', { ...errors });
          };
          return (
            <>
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
                  <ListItem>
                    <ListItemText
                      primary='Submitted at'
                      secondary={applicationSubmittedAt}></ListItemText>
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary='Updated at'
                      secondary={applicationUpdatedAt}></ListItemText>
                  </ListItem>
                </List>
                <TableRow>
                  <TableCell component='th' scope='row'>
                    <MuiTextField
                      name='key'
                      value={newField.key}
                      onChange={handleErrorFieldChange}></MuiTextField>
                  </TableCell>
                  <TableCell>
                    <MuiTextField
                      name='value'
                      value={newField.value}
                      onChange={handleErrorFieldChange}
                      margin='dense'></MuiTextField>
                  </TableCell>
                  <TableCell>
                    <Button onClick={handleAddKey}>
                      <AddBoxIcon></AddBoxIcon>
                    </Button>
                  </TableCell>
                </TableRow>
                {Object.keys(values.errors).map(key => {
                  return (
                    <TableRow key={key}>
                      <TableCell component='th' scope='row'>
                        <Typography>{key}</Typography>
                      </TableCell>
                      <TableCell>
                        <TextField
                          name={`errors.${key}`}
                          required
                          margin='dense'></TextField>
                      </TableCell>
                      <TableCell>
                        <Button onClick={() => handleDeleteKey(key)}>
                          <DeleteIcon></DeleteIcon>
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </Container>

              <MainFeaturedPost img={heroImage}></MainFeaturedPost>
              <Container maxWidth='md'>
                <div className={classes.paper}>
                  <Typography component='h1' variant='h5'>
                    Shop Registration Application
                  </Typography>
                  <form className={classes.form} noValidate>
                    <Grid container spacing={2} justify='center'>
                      <Grid item xs={12} sm={12}>
                        <Typography align='center' variant='h5'>
                          Shop Info
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant='caption'>Shop Name</Typography>
                        <Typography variant='h6'>
                          <Link to={`/shop/${shopUsername}`}>{shopName}</Link>
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant='caption'>Shop Username</Typography>
                        <Typography variant='h6'>
                          <Link to={`/shop/${shopUsername}`}>
                            {shopUsername}
                          </Link>
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant='caption'>Address</Typography>
                        <Typography variant='h6'>
                          <a
                            href={`https://www.google.com/search?q=${encodeURIComponent(
                              address
                            )}`}
                            target='_blank'
                            rel='noopener noreferrer'>
                            {address}
                          </a>
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant='caption'>
                          Contact Number
                        </Typography>
                        <Typography variant='h6'>
                          <a
                            href={`https://wa.me/91${contactNumber}?`}
                            target='_blank'
                            rel='noopener noreferrer'>
                            {contactNumber}
                          </a>
                        </Typography>
                      </Grid>

                      <Grid item xs={12} sm={12}>
                        <Typography variant='caption'>Website</Typography>
                        <Typography variant='h6'>
                          <a
                            href={website}
                            target='_blank'
                            rel='noopener noreferrer'>
                            {website}
                          </a>
                        </Typography>
                      </Grid>

                      <Grid item xs={6} sm={6}>
                        <TextField
                          name={`latLngObj.lat`}
                          label='Lat'
                          type='number'
                          required
                          fullWidth
                          margin='dense'></TextField>
                      </Grid>
                      <Grid item xs={6} sm={6}>
                        <TextField
                          name={`latLngObj.lng`}
                          label='Lng'
                          type='number'
                          required
                          fullWidth
                          margin='dense'></TextField>
                      </Grid>

                      <br></br>
                      <Grid item xs={12} sm={12}>
                        <Typography align='center' variant='h5'>
                          Owner Info
                        </Typography>
                      </Grid>
                      <br></br>
                      <Grid item xs={12} sm={6}>
                        <Typography variant='caption'>Email</Typography>
                        <Typography variant='h6'>
                          <a href={`mailto:${email}`} target='_top'>
                            {email}
                          </a>
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant='caption'>Full Name</Typography>
                        <Typography variant='h6'>
                          {firstName} {lastName}
                        </Typography>
                      </Grid>

                      <Grid item xs={12} sm={12}>
                        <Typography
                          component={Button}
                          onClick={() => setLoadPlans(!loadPlans)}
                          align='center'
                          variant='h5'>
                          Select Plan
                        </Typography>
                      </Grid>
                      {formik.touched.planId && formik.errors.planId && (
                        <p>{formik.errors.planId}</p>
                      )}
                      <br></br>
                      {loadPlans && (
                        <Grid item xs={12} md={12}>
                          <AvailablePlans
                            handlePlanSelect={handlePlanSelect}
                            selectedPlan={values.planId}
                            filterFreePlans={false}></AvailablePlans>
                        </Grid>
                      )}

                      <Grid item xs={12} md={12}>
                        {reviewProps.error && (
                          <GraphqlErrorMessage
                            error={reviewProps.error}
                            critical></GraphqlErrorMessage>
                        )}
                      </Grid>

                      <ResponseSnackbar
                        open={snackbarOpen}
                        handleClose={handleSnackbarClose}
                        variant='success'
                        message='Status changes successfully'></ResponseSnackbar>

                      <Grid item xs={12} md={6}>
                        <Button
                          onClick={() => {
                            formik.setFieldValue('statusCode', 'accepted');
                            formik.handleSubmit();
                          }}
                          disabled={reviewProps.loading}
                          fullWidth
                          variant='contained'
                          color='primary'>
                          Accept
                        </Button>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Button
                          onClick={() => {
                            formik.setFieldValue('statusCode', 'rejected');
                            formik.handleSubmit();
                          }}
                          disabled={reviewProps.loading}
                          fullWidth
                          variant='contained'
                          color='secondary'>
                          Reject
                        </Button>
                      </Grid>
                      <Grid item xs={12} md={12}>
                        <Button
                          onClick={() => {
                            formik.setFieldValue('statusCode', 'error');
                            formik.handleSubmit();
                          }}
                          disabled={reviewProps.loading}
                          fullWidth
                          variant='contained'>
                          Return Error
                        </Button>
                      </Grid>
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

export const ShopApplicationList = ({ applicationStatus }) => {
  const { loading, error, data, refetch } = useQuery(SHOP_APPLICATIONS, {
    variables: { status: applicationStatus }
  });
  if (loading) return <Loading></Loading>;
  if (error) return <GraphqlErrorMessage error={error}></GraphqlErrorMessage>;
  if (
    data &&
    data.shopApplications &&
    data.shopApplications.edges.length !== 0
  ) {
    const { edges: shopApplicationNodeEdges } = data.shopApplications;
    return (
      <Container maxWidth='md'>
        <Grid container spacing={2}>
          <Grid item xs={12} md={12}>
            <Button
              variant='outlined'
              color='primary'
              onClick={() => refetch()}>
              Refresh
            </Button>
          </Grid>
          {shopApplicationNodeEdges.map(shopApplication => {
            const {
              id: applicationId,
              submittedAt,
              updatedAt,
              shop: {
                properties: { title, publicUsername }
              }
            } = shopApplication.node;
            return (
              <Grid item key={shopApplication.node.id} xs={12} md={4}>
                <Link
                  to={`/raspaai/dashboard/shops/review/application/${applicationId}`}>
                  <Typography variant='h6'>{title}</Typography>
                  <Typography>{publicUsername}</Typography>
                </Link>
              </Grid>
            );
          })}
        </Grid>
      </Container>
    );
  }

  return (
    <>
      <Button
        variant='outlined'
        color='primary'
        onClick={() => refetch()}>
        Refresh
      </Button>
      <Typography variant='h5' align='center'>
        No applications here
      </Typography>
    </>
  );
};

const ReviewShopApplications = () => {
  const actionList = [
    { title: 'Under review', url: 'under_review' },
    { title: 'With Errors', url: 'error' },
    { title: 'Rejected', url: 'rejected' }
  ];

  return (
    <div>
      <List>
        {actionList.map(action => (
          <ListItem key={action.title}>
            <Button
              component={Link}
              variant='outlined'
              to={`${window.location.pathname}/status/${action.url}`}>
              {action.title}
            </Button>
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default ReviewShopApplications;
