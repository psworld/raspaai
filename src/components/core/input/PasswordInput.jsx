import React from "react"
import TextField from "@material-ui/core/TextField"

const PasswordInput = props => {
  const { handleBlur, handleChange } = props
  return (
    <TextField
      variant="outlined"
      margin="normal"
      required
      fullWidth
      name="password"
      label="Password"
      type="password"
      id="password"
      autoComplete="current-password"
      onBlur={handleBlur}
      onChange={handleChange}
    />
  )
}

export default PasswordInput
