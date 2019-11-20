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

export default function SignupForm({ formik, loading, error }) {
  const {
    values,
    touched,
    errors,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
  } = formik

  const { email, lastName, firstName, password1, password2 } = values

  const classes = useStyles()

  function hasError(id, bool) {
    if (touched[id] && errors[id]) {
      return bool ? true : errors[id]
    } else {
      return false
    }
  }

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
                error={hasError("firstName", true)}
                id="firstName"
                placeholder="First Name"
                label={
                  hasError("firstName", true)
                    ? hasError("firstName")
                    : "First Name"
                }
                // autoFocus
                onBlur={handleBlur}
                onChange={handleChange}
                value={firstName}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="lastName"
                error={hasError("lastName", true)}
                label={
                  hasError("lastName", true)
                    ? hasError("lastName")
                    : "Last Name"
                }
                placeholder="Last Name"
                name="lastName"
                autoComplete="lname"
                onBlur={handleBlur}
                onChange={handleChange}
                defaultValue={lastName}
              />
            </Grid>
            <Grid item xs={12}>
              <EmailInput
                handleBlur={handleBlur}
                handleChange={handleChange}
                value={email}
                touched={touched.email}
                errors={errors.email}
                autoFocus={false}
              ></EmailInput>
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="password1"
                type="password"
                id="password1"
                error={hasError("password1", true)}
                label={
                  hasError("password1", true)
                    ? hasError("password1")
                    : "Password"
                }
                autoComplete="current-password"
                value={password1}
                onBlur={handleBlur}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="password2"
                type="password"
                id="password2"
                error={hasError("password2", true)}
                label={
                  hasError("password2", true)
                    ? hasError("password2")
                    : "Password Confirm"
                }
                autoComplete="current-password"
                value={password2}
                onBlur={handleBlur}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <code>
                A confirmation email will be sent to your email address.
              </code>
            </Grid>
          </Grid>

          {error && <p style={{ color: "red" }}>{error.message}</p>}
          <Button
            onClick={handleSubmit}
            disabled={loading || isSubmitting}
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Sign Up
          </Button>

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
