import React from "react"

import Avatar from "@material-ui/core/Avatar"
import Button from "@material-ui/core/Button"
import FormControlLabel from "@material-ui/core/FormControlLabel"
import Checkbox from "@material-ui/core/Checkbox"
import Grid from "@material-ui/core/Grid"
import LockOutlinedIcon from "@material-ui/icons/LockOutlined"
import Typography from "@material-ui/core/Typography"
import { makeStyles } from "@material-ui/core/styles"
import Container from "@material-ui/core/Container"

import EmailInput from "../core/input/EmailInput"
import PasswordInput from "../core/input/PasswordInput"
import Loading from "../core/Loading"

import { Mutation } from "react-apollo"
import gql from "graphql-tag"
import Link from "../core/Link"
import ErrorPage from "../core/ErrorPage"
import { VIEWER } from "../navbar/ToolBarMenu"

const useStyles = makeStyles(theme => ({
  "@global": {
    body: {
      backgroundColor: theme.palette.common.white,
    },
  },
  paper: {
    marginTop: theme.spacing(2),
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
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  message: {
    margin: theme.spacing(0),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
}))

const SIGNIN = gql`
  mutation($email: String!, $password: String!) {
    loginUser(input: { email: $email, password: $password }) {
      user {
        email
        firstName
        lastName
      }
      msg
    }
  }
`

function hasError(errors) {
  if (Object.keys(errors).length === 0 && errors.constructor === Object) {
    return false
  } else return true
}

export default function SigninForm(props) {
  const classes = useStyles()
  const {
    formik: { values, touched, errors, handleChange, handleBlur },
    message,
  } = props
  const { email, password } = values

  return (
    <Mutation
      mutation={SIGNIN}
      variables={{ email, password }}
      refetchQueries={[{ query: VIEWER }]}
    >
      {(signin, { called, loading, error, data }) => {
        if (!called) {
          return (
            <>
              {message && (
                <code className={classes.message}>
                  <Typography
                    style={{ color: "green" }}
                    component="h1"
                    variant="h5"
                  >
                    {message}
                  </Typography>
                </code>
              )}
              <Container component="main" maxWidth="xs">
                <div className={classes.paper}>
                  <Avatar className={classes.avatar}>
                    <LockOutlinedIcon />
                  </Avatar>
                  <Typography component="h1" variant="h5">
                    Sign in
                  </Typography>
                  <form className={classes.form} noValidate>
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
                    <PasswordInput
                      handleChange={handleChange}
                      handleBlur={handleBlur}
                    ></PasswordInput>
                    {errors.password && touched.password && (
                      <div className="input-feedback">{errors.password}</div>
                    )}
                    <FormControlLabel
                      control={<Checkbox value="remember" color="primary" />}
                      label="Remember me"
                    />
                    <Button
                      // type="submit"
                      disabled={hasError(errors)}
                      onClick={signin}
                      fullWidth
                      variant="contained"
                      color="primary"
                      className={classes.submit}
                    >
                      Sign In
                    </Button>
                    <Grid container>
                      <Grid item xs>
                        <Link to="/reset-password" variant="body2">
                          Forgot password?
                        </Link>
                      </Grid>
                      <Grid item>
                        <Link to="/signup" variant="body2">
                          {"Don't have an account? Sign Up"}
                        </Link>
                      </Grid>
                    </Grid>
                  </form>
                </div>
              </Container>
            </>
          )
        }
        if (loading) return <Loading></Loading>
        if (error) return <ErrorPage></ErrorPage>
        if (data) {
          !message && window.history.back()
          return <p style={{ color: "green" }}>Logged in Successfully</p>
        }
      }}
    </Mutation>
  )
}
