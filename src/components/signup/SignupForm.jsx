import React from "react"
import Avatar from "@material-ui/core/Avatar"
import Button from "@material-ui/core/Button"
import CssBaseline from "@material-ui/core/CssBaseline"
import TextField from "@material-ui/core/TextField"
import Grid from "@material-ui/core/Grid"
import LockOutlinedIcon from "@material-ui/icons/LockOutlined"
import Typography from "@material-ui/core/Typography"
import { makeStyles } from "@material-ui/core/styles"
import Container from "@material-ui/core/Container"
import EmailInput from "../core/input/EmailInput"
import Link from "../core/Link"
import gql from "graphql-tag"
import { Mutation } from "react-apollo"

const useStyles = makeStyles(theme => ({
  "@global": {
    body: {
      backgroundColor: theme.palette.common.white,
    },
  },
  paper: {
    marginTop: theme.spacing(8),
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

const SEND_EMAIL_VERIFICATION = gql`
  mutation(
    $firstName: String!
    $lastName: String!
    $email: String!
    $password1: String!
    $password2: String!
  ) {
    signupEmailVerification(
      input: {
        firstName: $firstName
        lastName: $lastName
        email: $email
        password1: $password1
        password2: $password2
      }
    ) {
      jwtEncodedStr
    }
  }
`

function hasError(errors) {
  if (Object.keys(errors).length === 0 && errors.constructor === Object) {
    return false
  } else return true
}

export default function SignupForm(props) {
  const {
    values,
    touched,
    errors,
    dirty,
    isSubmitting,
    handleChange,
    handleBlur,
    handleReset,
  } = props.formik

  const { nextStep } = props

  const { email, lastName, firstName, password1, password2 } = values

  const classes = useStyles()

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <form className={classes.form} noValidate>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                autoComplete="fname"
                name="firstName"
                variant="outlined"
                required
                fullWidth
                id="firstName"
                label="First Name"
                // autoFocus
                onBlur={handleBlur}
                onChange={handleChange}
                defaultValue={firstName}
              />
              {errors.firstName && touched.firstName && (
                <div style={{ color: "red" }} className="input-feedback">
                  {errors.firstName}
                </div>
              )}
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="lastName"
                label="Last Name"
                name="lastName"
                autoComplete="lname"
                onBlur={handleBlur}
                onChange={handleChange}
                defaultValue={lastName}
              />
              {errors.lastName && touched.lastName && (
                <div style={{ color: "red" }} className="input-feedback">
                  {errors.lastName}
                </div>
              )}
            </Grid>
            <Grid item xs={12}>
              <EmailInput
                handleBlur={handleBlur}
                handleChange={handleChange}
                defaultValue={email}
                autoFocus={false}
              ></EmailInput>
              {errors.email && touched.email && (
                <div style={{ color: "red" }} className="input-feedback">
                  {errors.email}
                </div>
              )}
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="password1"
                label="Password"
                type="password"
                id="password1"
                autoComplete="current-password"
                defaultValue={password1}
                onBlur={handleBlur}
                onChange={handleChange}
              />
              {errors.password1 && touched.password1 && (
                <div style={{ color: "red" }} className="input-feedback">
                  {errors.password1}
                </div>
              )}
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="password2"
                label="Password Confirm"
                type="password"
                id="password2"
                autoComplete="current-password"
                defaultValue={password2}
                onBlur={handleBlur}
                onChange={handleChange}
              />
              {errors.password2 && touched.password2 && (
                <div style={{ color: "red" }} className="input-feedback">
                  {errors.password2}
                </div>
              )}
            </Grid>
            <Grid item xs={12}>
              <code>
                A confirmation email will be sent to your email address.
              </code>
            </Grid>
          </Grid>
          <Mutation
            mutation={SEND_EMAIL_VERIFICATION}
            variables={{ firstName, lastName, email, password1, password2 }}
          >
            {(sendEmailVerification, { called, loading, error, data }) => {
              if (!called || error) {
                return (
                  <>
                    {error && <p style={{ color: "red" }}>{error.message}</p>}
                    <Button
                      onClick={sendEmailVerification}
                      disabled={!dirty || hasError(errors)}
                      fullWidth
                      variant="contained"
                      color="primary"
                      className={classes.submit}
                    >
                      Sign Up
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
                sessionStorage.setItem(
                  "enc",
                  data.signupEmailVerification.jwtEncodedStr
                )
                return <>{nextStep()}</>
              }
            }}
          </Mutation>

          <Grid container justify="flex-end">
            <Grid item>
              <Link to="/signin" variant="body2">
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  )
}
