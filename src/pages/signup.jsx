import { Formik } from 'formik';
import gql from 'graphql-tag';
import React, { useState } from 'react';
import { useMutation } from 'react-apollo';
import * as yup from 'yup';
import Layout from '../components/layout';
import SEO from '../components/seo';
import SignupForm from '../components/signup/SignupForm';
import VerificationCode from '../components/signup/VerificationCode';

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
`;

const Signup = () => {
  const [step, setStep] = useState(1);
  const [sendEmailVerification, { loading, error, client }] = useMutation(
    SEND_EMAIL_VERIFICATION
  );
  const nextStep = () => {
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  return (
    <Layout>
      <SEO title='Sign Up'></SEO>
      <Formik
        initialValues={{
          email: '',
          firstName: '',
          lastName: ''
        }}
        validationSchema={yup.object().shape({
          email: yup
            .string()
            .email('Invalid Email')
            .required('Email required'),
          firstName: yup
            .string()
            .min(2, 'Too Short!')
            .max(30, 'Too Long!')
            .required('First name required'),
          lastName: yup
            .string()
            .min(2, 'Too Short!')
            .max(30, 'Too Long!')
            .required('Last name required'),
          password1: yup
            .string()
            .min(8, 'Password is too short')
            .max(16, 'Password is too long')
            .required('Password required'),
          password2: yup
            .string()
            .oneOf([yup.ref('password1'), ''], 'Password do not match')
            .required('Confirm password required')
        })}
        onSubmit={(values, { setSubmitting }) => {
          // const { email, lastName, firstName, password1, password2 } = values
          sendEmailVerification({
            variables: {
              ...values
            },
            update(
              store,
              {
                data: {
                  signupEmailVerification: { jwtEncodedStr }
                }
              }
            ) {
              client.writeData({
                data: { enc: jwtEncodedStr }
              });
              nextStep();
            }
          });
          setSubmitting(false);
        }}>
        {props => {
          // eslint-disable-next-line default-case
          switch (step) {
            case 1:
              return (
                <SignupForm
                  loading={loading}
                  error={error}
                  nextStep={nextStep}
                  formik={props}
                />
              );
            case 2:
              return (
                <VerificationCode
                  email={props.values.email}
                  prevStep={prevStep}></VerificationCode>
              );
          }
        }}
      </Formik>
    </Layout>
  );
};

export default Signup;
