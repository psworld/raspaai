import { gql } from 'apollo-boost';
import { Formik } from 'formik';
import React from 'react';
import { useMutation } from 'react-apollo';
import * as yup from 'yup';
import CreateShopForm from './CreateShopForm';
import CreateShopPage from './CreateShopPage';
import { navigate } from 'gatsby';
import SEO from '../../seo';
import Resizer from 'react-image-file-resizer';
import { VIEWER } from '../../navbar/ToolBarMenu';

const REGISTER_SHOP = gql`
  mutation($data: ShopRegistrationApplicationInput!) {
    shopRegistrationApplication(input: $data) {
      shopApplication {
        id
      }
    }
  }
`;

const CreateShop = () => {
  const [step, setStep] = React.useState(1);

  const nextStep = () => {
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  // files

  // files end

  const [sendApplication, mutationProps] = useMutation(REGISTER_SHOP, {
    refetchQueries: [{ query: VIEWER }],
    onCompleted(data) {
      navigate(
        `/shop/application/${data.shopRegistrationApplication.shopApplication.id}`
      );
    }
  });

  return (
    <>
      <SEO
        title='Register your shop and get online'
        description='Register your shop with raspaai and get a free online website for your shop.'></SEO>
      <Formik
        initialValues={{
          shopName: '',
          shopUsername: '',
          address: '',
          contactNumber: '',
          heroImg64: ''
        }}
        validationSchema={yup.object().shape({
          shopName: yup
            .string()
            .required('Required')
            .max(100, 'Shop name can not be longer than 100 characters')
            .min(3, 'Shop name must be at least 3 character long'),
          shopUsername: yup
            .string()
            .matches(/^[a-zA-Z0-9_.]+$/, {
              message: 'Only letters numbers _ . are allowed. No empty spaces.',
              excludeEmptyString: true
            })
            .required('Required')
            .min(5, 'Username must be 5 characters long')
            .max(30, 'Username can be max 30 characters long'),
          address: yup
            .string()
            .required('Required')
            .min(10, 'Too short')
            .max(255, 'Too long'),
          contactNumber: yup
            .string()
            .matches(/^[1-9]\d{9}$/, {
              message: 'Please enter valid number.',
              excludeEmptyString: false
            })
            .required('Required'),
          website: yup.string().url('Invalid url'),
          heroImg64: yup
            .string()
            .min(100)
            .required('Shop image is required')
        })}
        onSubmit={(values, { setSubmitting }) => {
          sendApplication({
            variables: {
              data: { ...values }
            }
          });
          setSubmitting(false);
        }}>
        {formik => {
          const handleFileChange = files => {
            const file = files[0];

            Resizer.imageFileResizer(file, 720, 700, 'JPEG', 100, 0, base64 => {
              formik.setFieldValue('heroImg64', base64);
            });

            // const reader = new FileReader();
            // reader.readAsDataURL(file);

            // reader.onload = fileLoadEvent => {
            //   const { result } = fileLoadEvent.target;
            //   formik.setFieldValue('heroImg64', result);
            // };
          };

          // eslint-disable-next-line default-case
          switch (step) {
            case 1:
              return <CreateShopPage handleNext={nextStep}></CreateShopPage>;

            case 2:
              return (
                <CreateShopForm
                  handleFileChange={handleFileChange}
                  mutationProps={mutationProps}
                  formik={formik}
                  handleBack={prevStep}></CreateShopForm>
              );
          }
        }}
      </Formik>
    </>
  );
};

export default CreateShop;
