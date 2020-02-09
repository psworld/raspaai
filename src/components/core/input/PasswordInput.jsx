import React from 'react';
import TextField from '@material-ui/core/TextField';

const PasswordInput = props => {
  const {
    handleBlur,
    handleChange,
    handleSubmit,
    value,
    errors,
    touched
  } = props;
  const error = touched && errors;

  return (
    <TextField
      variant='outlined'
      margin='normal'
      required
      fullWidth
      name='password'
      value={value}
      label={error ? errors : 'Password'}
      error={error}
      type='password'
      id='password'
      autoComplete='current-password'
      onBlur={handleBlur}
      onChange={handleChange}
    />
  );
};

export default PasswordInput;
