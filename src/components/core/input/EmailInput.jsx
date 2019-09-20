import React from "react"
import TextField from "@material-ui/core/TextField"

const EmailInput = props => {
  const { handleBlur, handleChange, defaultValue, autoFocus } = props
  return (
    <TextField
      variant="outlined"
      margin="normal"
      required
      fullWidth
      id="email"
      label="Email Address"
      name="email"
      autoComplete="email"
      autoFocus={autoFocus}
      defaultValue={defaultValue}
      onBlur={handleBlur}
      onChange={handleChange}
    />
  )
}

export default EmailInput
