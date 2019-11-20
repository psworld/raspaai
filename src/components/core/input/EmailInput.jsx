import React from "react"
import TextField from "@material-ui/core/TextField"

const EmailInput = props => {
  const { handleBlur, handleChange, value, autoFocus, errors, touched } = props
  const error = touched && errors

  return (
    <TextField
      variant="outlined"
      margin="normal"
      required
      fullWidth
      id="email"
      label={error ? errors : "Email Address"}
      error={error}
      name="email"
      autoComplete="email"
      autoFocus={autoFocus}
      value={value}
      onBlur={handleBlur}
      onChange={handleChange}
    />
  )
}

export default EmailInput
