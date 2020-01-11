import React from 'react';

import * as yup from 'yup';
import { Formik } from 'formik';
import { gql } from 'apollo-boost';
import { useQuery, useMutation } from 'react-apollo';
import AddShopForm from './AddShopForm';
import { TextField, Container, Button, Typography } from '@material-ui/core';
import GraphqlErrorMessage from '../../../core/GraphqlErrorMessage';
import { navigate } from 'gatsby';

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

const SHOP_OWNER_EMAIL_VERIFICATION = gql`
  mutation($email: String!) {
    adminAddShopVerifyEmail(input: { email: $email }) {
      jwtEncodedStr
    }
  }
`;

const ShopOwnerEmailVerification = ({
  formik,
  setJwtEncodedStr,
  handleNext
}) => {
  const {
    values: { ownerEmail },
    touched,
    errors,
    handleChange,
    handleBlur
  } = formik;

  const [sendEmail, { loading, error }] = useMutation(
    SHOP_OWNER_EMAIL_VERIFICATION,
    {
      variables: { email: ownerEmail },
      onCompleted: data => {
        const {
          adminAddShopVerifyEmail: { jwtEncodedStr }
        } = data;
        setJwtEncodedStr(jwtEncodedStr);
        handleNext();
      }
    }
  );
  return (
    <Container maxWidth='sm'>
      <br></br>
      <br></br>
      <TextField
        id='ownerEmail'
        defaultValue={ownerEmail}
        onChange={handleChange}
        onBlur={handleBlur}
        label={
          touched.ownerEmail && errors.ownerEmail
            ? `${errors.ownerEmail}`
            : 'Owner Email'
        }
        error={touched.ownerEmail && errors.ownerEmail && true}
        margin='normal'
        variant='outlined'
        placeholder='Owner Email'
        fullWidth></TextField>
      <br></br>
      <Typography>Owner should be registered raspaai user</Typography>
      <br></br>
      <Button
        variant='contained'
        color='primary'
        disabled={loading}
        onClick={sendEmail}>
        Verify Email
      </Button>
      {error && <GraphqlErrorMessage message={error}></GraphqlErrorMessage>}
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

  const [jwtEncodedStr, setJwtEncodedStr] = React.useState();

  const LOCAL_SAVED_LOCATION = gql`
    {
      localSavedLocation @client
    }
  `;

  const { data: localSavedLocationData } = useQuery(LOCAL_SAVED_LOCATION);
  // files
  const [img, setImg] = React.useState(false);

  const handleFileChange = files => {
    const file = files[0];

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = fileLoadEvent => {
      const { result } = fileLoadEvent.target;
      const img = {
        base64: result,
        file: file
      };
      setImg(img);
    };
  };

  // files end

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

  // const [returnRefundPolicy, setReturnRefundPolicy] = React.useState([
  //   'Item should be in the same good condition as it was when customer bought it.',
  //   'The return and refund window will only remain open for 7 days after customer have made the purchase.',
  //   'There should be no markings, names, ink or anything that was not previously on the product.',
  //   'Exchange of the product with other similar product will be preferred from our shop.'
  // ]);

  // const handleReturnRefundPolicyChange = e => {
  //   returnRefundPolicy[e.target.id] = e.target.value;
  //   setReturnRefundPolicy([...returnRefundPolicy]);
  // };

  return (
    <Formik
      initialValues={{
        ownerEmail: '',
        shopName: '',
        publicUsername: '',
        address: '',
        contactNumber: '',
        latLng: '',
        keyCode: ''
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
        keyCode: yup
          .string('Invalid key')
          .length(4, 'key must be 4 digit long')
          .required('Key required')
      })}
      onSubmit={(values, { setSubmitting }) => {
        const AdminAddShopInput = {
          ...values,
          imgName: img && img.file.name,
          heroImg64: img && img.base64,
          jwtEncodedStr
        };
        addShop({
          variables: { data: AdminAddShopInput }
        });
        setSubmitting(false);
      }}>
      {props => {
        // eslint-disable-next-line default-case
        switch (step) {
          case 1:
            return (
              <ShopOwnerEmailVerification
                setJwtEncodedStr={setJwtEncodedStr}
                handleNext={nextStep}
                formik={props}></ShopOwnerEmailVerification>
            );

          case 2:
            return (
              <AddShopForm
                loading={loading}
                error={error}
                data={data}
                handleFileChange={handleFileChange}
                img={img}
                formik={props}
                handleBack={prevStep}
                localLocation={JSON.parse(
                  atob(localSavedLocationData.localSavedLocation)
                )}
                handleNext={nextStep}></AddShopForm>
            );

          // case 2:
          //   return (
          //     <CreateShopForm
          //       handleFileChange={handleFileChange}
          //       img={img}
          //       formikProps={props}
          //       handleBack={prevStep}
          //       localLocation={JSON.parse(
          //         atob(localSavedLocationData.localSavedLocation)
          //       )}></CreateShopForm>
          //   );
        }
      }}
    </Formik>
  );
};

export default AddShop;
