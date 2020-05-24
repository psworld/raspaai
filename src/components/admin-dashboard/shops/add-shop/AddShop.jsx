import { Button, Container, Typography } from '@material-ui/core';
import { gql } from 'apollo-boost';
import { Formik } from 'formik';
import { CheckboxWithLabel, TextField } from 'formik-material-ui';
import { navigate } from 'gatsby';
import React from 'react';
import { useMutation } from 'react-apollo';
import * as yup from 'yup';
import GraphqlErrorMessage from '../../../core/GraphqlErrorMessage';
import AddShopForm from './AddShopForm';
import Resizer from 'react-image-file-resizer';

const REGISTER_SHOP = gql`
  mutation($data: AdminAddShopInput!) {
    adminAddShop(input: $data) {
      shop {
        id
        properties {
          title
          publicUsername
          isActive
          returnRefundPolicy
          haveActivePlan
        }
      }
    }
  }
`;

// indra market 31.708506, 76.931866

const SHOP_OWNER_EMAIL_VERIFICATION = gql`
  mutation($email: String!) {
    adminAddShopVerifyEmail(input: { email: $email }) {
      jwtEncodedStr
    }
  }
`;

const ShopOwnerEmailVerification = ({ formik, handleNext }) => {
  const {
    values: { ownerEmail, verifyEmail }
  } = formik;

  const [sendEmail, { loading, error }] = useMutation(
    SHOP_OWNER_EMAIL_VERIFICATION,
    {
      variables: { email: ownerEmail },
      onCompleted: data => {
        const {
          adminAddShopVerifyEmail: { jwtEncodedStr }
        } = data;
        formik.setFieldValue('jwtEncodedStr', jwtEncodedStr);
        handleNext();
      }
    }
  );
  return (
    <Container maxWidth='sm'>
      <br></br>
      <br></br>
      <TextField
        name='ownerEmail'
        label='Owner Email'
        margin='normal'
        variant='outlined'
        placeholder='Owner Email'
        fullWidth></TextField>
      <br></br>

      <CheckboxWithLabel
        name='verifyEmail'
        Label={{
          label: 'Verify email'
        }}></CheckboxWithLabel>

      <br></br>
      <Typography>Owner should be registered raspaai user</Typography>
      <br></br>
      <Button
        variant='contained'
        color='primary'
        disabled={loading}
        onClick={() => (verifyEmail ? sendEmail() : handleNext())}>
        Continue
      </Button>
      {error && <GraphqlErrorMessage error={error}></GraphqlErrorMessage>}
    </Container>
  );
};

const AddShop = () => {
  const [step, setStep] = React.useState(1);

  const nextStep = () => {
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const [addShop, { loading, error, data }] = useMutation(REGISTER_SHOP, {
    onCompleted: data => {
      const {
        adminAddShop: {
          shop: {
            properties: { publicUsername }
          }
        }
      } = data;
      navigate(`/shop/${publicUsername}`);
    }
  });

  let formikValues = {};

  return (
    <Formik
      initialValues={{
        ownerEmail: '',
        shopName: '',
        publicUsername: '',
        address: '',
        contactNumber: '',
        latLng: '',
        keyCode: '',
        verifyEmail: false,
        heroImage: '',
        jwtEncodedStr: '',
        planId: ''
      }}
      validationSchema={yup.object().shape({
        ownerEmail: yup
          .string()
          .email('Invalid email')
          .required('Email is required'),
        shopName: yup
          .string()
          .required('Shop name required')
          .max(100, 'Shop name can not be longer than 100 characters')
          .min(3, 'Shop name must be at least 3 character long'),
        publicUsername: yup
          .string()
          .matches(/^[a-zA-Z0-9_.]+$/, {
            message: 'Only letters numbers _ . are allowed. No empty spaces.',
            excludeEmptyString: true
          })
          .required('Shop username required')
          .min(5, 'Username must be 5 characters long')
          .max(30, 'Username can be max 30 characters long'),
        address: yup
          .string()
          .required('Shop address required')
          .min(10, 'Too short')
          .max(150, 'Too long'),
        contactNumber: yup
          .string()
          .matches(/^[1-9]\d{9}$/, {
            message: 'Please enter valid number.',
            excludeEmptyString: false
          })
          .required('Contact number required'),
        latLng: yup.string().required('Lat Lng string required'),
        keyCode: yup.lazy(() => {
          return formikValues.verifyEmail
            ? yup
                .string('Invalid key')
                .length(4, 'key must be 4 digit long')
                .required('Required')
            : yup.string('Invalid key').length(4, 'key must be 4 digit long');
        }),
        jwtEncodedStr: yup.lazy(() => {
          return formikValues.verifyEmail
            ? yup.string('Invalid key').required('Required')
            : yup.string('Invalid key');
        }),
        planId: yup.string().required('No plan selected'),
        verifyEmail: yup.boolean('Not a boolean').required('Required'),
        heroImage: yup
          .object({ name: yup.string(), base64: yup.string() })
          .required()
      })}
      onSubmit={(values, { setSubmitting }) => {
        addShop({
          variables: {
            data: { ...values, heroImage: JSON.stringify(values.heroImage) }
          }
        });
        setSubmitting(false);
      }}>
      {formik => {
        formikValues = formik.values;

        const handleFileChange = files => {
          const file = files[0];

          Resizer.imageFileResizer(file, 720, 700, 'JPEG', 100, 0, base64 => {
            formik.setFieldValue('heroImage', { name: file.name, base64 });
          });
        };

        // eslint-disable-next-line default-case
        switch (step) {
          case 1:
            return (
              <ShopOwnerEmailVerification
                handleNext={nextStep}
                formik={formik}></ShopOwnerEmailVerification>
            );

          case 2:
            return (
              <AddShopForm
                loading={loading}
                error={error}
                data={data}
                handleFileChange={handleFileChange}
                formik={formik}
                handleBack={prevStep}
                handleNext={nextStep}></AddShopForm>
            );
        }
      }}
    </Formik>
  );
};

export default AddShop;
