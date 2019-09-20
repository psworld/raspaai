import React from "react"
import Avatar from "@material-ui/core/Avatar"
import Button from "@material-ui/core/Button"

import Grid from "@material-ui/core/Grid"

import Typography from "@material-ui/core/Typography"
import { makeStyles } from "@material-ui/core/styles"
import Container from "@material-ui/core/Container"
import { ListItem, ListItemText, TextField } from "@material-ui/core"
import AccountCircle from "@material-ui/icons/AccountCircle"
import gql from "graphql-tag"
import { Mutation } from "react-apollo"
import { Formik } from "formik"
import * as yup from "yup"
import FormError from "../core/FormError"
import { hasErrors } from "../core/HasError"
import { navigate } from "gatsby"

const useStyles = makeStyles(theme => ({
  "@global": {
    body: {
      backgroundColor: theme.palette.common.white,
    },
  },
  paper: {
    marginTop: theme.spacing(1),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  sent: {
    // marginTop: theme.spacing(1),
    // marginBottom: theme.spacing(1),
    margin: theme.spacing(1),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}))

const CREATE_USER = gql`
  mutation($jwtEncodedStr: String!, $keyCode: Int!, $email: String!) {
    createUser(
      input: { jwtEncodedStr: $jwtEncodedStr, keyCode: $keyCode, email: $email }
    ) {
      user {
        email
      }
    }
  }
`

const VerificationCode = props => {
  const classes = useStyles()

  const { email, prevStep } = props

  const jwtEncodedStr = sessionStorage.getItem("enc")
  return (
    <React.Fragment>
      <code className={classes.sent}>
        <Typography component="h1" variant="h5">
          Verification code has been sent to your email. Check you email
        </Typography>
      </code>
      <Container component="main" maxWidth="xs">
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <AccountCircle />
          </Avatar>
          <Typography component="h1" variant="h5">
            Verify
          </Typography>
          <form className={classes.form} noValidate>
            <Formik
              initialValues={{ key: null }}
              validationSchema={yup.object().shape({
                key: yup
                  .number("Invalid key")
                  .positive("Invalid key")
                  .integer("Invalid key")
                  .required("Required"),
              })}
            >
              {props => {
                const {
                  values,
                  touched,
                  errors,
                  dirty,
                  isSubmitting,
                  handleChange,
                  handleBlur,
                  handleReset,
                } = props
                return (
                  <>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <ListItem>
                          <ListItemText primary="Email" secondary={email} />
                        </ListItem>
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          variant="outlined"
                          margin="normal"
                          required
                          fullWidth
                          name="key"
                          label="4 Digit Key"
                          type="text"
                          id="key"
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                        <FormError
                          errors={errors.key}
                          touched={touched.key}
                        ></FormError>
                      </Grid>
                      <Grid item xs={12}>
                        <ListItem>
                          <code>
                            <ListItemText
                              color="red"
                              secondary="If you would like to edit your email you can click back."
                            />
                          </code>
                        </ListItem>
                      </Grid>
                    </Grid>
                    <Mutation
                      mutation={CREATE_USER}
                      variables={{ jwtEncodedStr, keyCode: values.key, email }}
                    >
                      {(createUser, { called, loading, error, data }) => {
                        if (!called || error) {
                          return (
                            <>
                              {error && (
                                <p style={{ color: "red" }}>{error.message}</p>
                              )}
                              <Button
                                onClick={createUser}
                                fullWidth
                                variant="contained"
                                color="primary"
                                className={classes.submit}
                                disabled={
                                  hasErrors(errors) ||
                                  !dirty ||
                                  String(values.key).length !== 4
                                }
                              >
                                Continue
                              </Button>
                            </>
                          )
                        }
                        if (loading)
                          return (
                            <Button fullWidth className={classes.submit}>
                              Loading...
                            </Button>
                          )
                        if (data) {
                          return (
                            <>
                              {navigate("/signin", {
                                state: {
                                  message: "Account created successfully",
                                },
                              })}
                            </>
                            // {/* {data.createUser.user.email} */}
                          )
                        }
                      }}
                    </Mutation>

                    <Button
                      onClick={prevStep}
                      fullWidth
                      variant="contained"
                      color="default"
                      // className={classes.submit}
                    >
                      Back
                    </Button>
                  </>
                )
              }}
            </Formik>

            {/* <Grid container justify='flex-end'>
              <Grid item>
                <Link to='/login' variant='body2'>
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid> */}
          </form>
        </div>
      </Container>
    </React.Fragment>
  )
}

export default VerificationCode
