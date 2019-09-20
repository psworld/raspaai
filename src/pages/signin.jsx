import React from "react"
import { Formik } from "formik"
import * as yup from "yup"
import SigninForm from "../components/signin/SigninForm"

import SEO from "../components/seo"
import Layout from "../components/layout"

const Signin = props => {
  if (props && props.location && props.location.state) {
    var message = props.location.state.message
  }
  return (
    <Layout>
      <Formik
        initialValues={{
          email: "",
          password: "",
        }}
        validationSchema={yup.object().shape({
          email: yup
            .string()
            .email("Invalid Email")
            .required("Required"),
          password: yup
            .string()
            .min(8, "Invalid Password")
            .max(16, "Max limit")
            .required("Required"),
        })}
      >
        {props => {
          return (
            <>
              <SEO title={"Sign In"}></SEO>
              <SigninForm message={message} formik={props}></SigninForm>
            </>
          )
        }}
      </Formik>
    </Layout>
  )
}

export default Signin
