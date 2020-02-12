import React from 'react';
import { FormikProvider } from 'formik';

const CustomFormik = ({ children, formikBag }) => {
  return (
    <FormikProvider value={formikBag}>
      {typeof children === 'function' ? children(formikBag) : children}
    </FormikProvider>
  );
};

export default CustomFormik;
