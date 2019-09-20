import React, { useState } from "react"
import Layout from "../components/layout"
import SignupForm from "../components/signup/SignupForm"
import SEO from "../components/seo"

import { Formik } from "formik"
import * as yup from "yup"
import VerificationCode from "../components/signup/VerificationCode"

const Signup = () => {
  const [step, setStep] = useState(1)

  const nextStep = () => {
    setStep(step + 1)
  }

  const prevStep = () => {
    setStep(step - 1)
  }

  return (
    <Layout>
      <SEO title="Sign Up"></SEO>
      <Formik
        initialValues={{
          email: "",
          firstName: "",
          lastName: "",
        }}
        validationSchema={yup.object().shape({
          email: yup
            .string()
            .email("Invalid Email")
            .required("Required"),
          firstName: yup
            .string()
            .min(2, "Too Short!")
            .max(30, "Too Long")
            .required("Required"),
          lastName: yup
            .string()
            .min(2, "Too Short!")
            .max(30, "Too Long")
            .required("Required"),
          password1: yup
            .string()
            .min(8, "Password is too short")
            .max(16, "Password is too long")
            .required("Required"),
          password2: yup
            .string()
            .oneOf([yup.ref("password1"), ""], "Password do not match")
            .required("Required"),
        })}
      >
        {props => {
          // eslint-disable-next-line default-case
          switch (step) {
            case 1:
              return <SignupForm nextStep={nextStep} formik={props} />
            case 2:
              return (
                <VerificationCode
                  email={props.values.email}
                  prevStep={prevStep}
                ></VerificationCode>
              )
          }
        }}
      </Formik>
    </Layout>
  )
}

export default Signup
