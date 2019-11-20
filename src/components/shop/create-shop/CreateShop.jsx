import React from "react"

import CreateShopPage from "./CreateShopPage"
import CreateShopForm from "./CreateShopForm"

import * as yup from "yup"
import { Formik } from "formik"
import { gql } from "apollo-boost"
import { useQuery } from "react-apollo"


const CreateShop = () => {
  const [step, setStep] = React.useState(1)

  const nextStep = () => {
    setStep(step + 1)
  }

  const prevStep = () => {
    setStep(step - 1)
  }
const LOCAL_SAVED_LOCATION = gql`
  {
    localSavedLocation @client
  }
`
  const [showThumbs, setShowThumbs] = React.useState(true)
  const [invalidImages, setInvalidImages] = React.useState(false)
  const { data: localSavedLocationData } = useQuery(LOCAL_SAVED_LOCATION)
  // files
  const [img, setImg] = React.useState(false)
console.info(JSON.parse(atob(localSavedLocationData.localSavedLocation)))
  const handleFileChange = files => {
    const file = files[0]

    const reader = new FileReader()
    reader.readAsDataURL(file)

    reader.onload = fileLoadEvent => {
      const { result } = fileLoadEvent.target
      const img = {
        base64: result,
        file: file,
      }
      setImg(img)
    }
  }

  // files end

  return (
    <Formik
      initialValues={{
        shopName: "",
        shopUsername: "",
        shopAddress: "",
        shopContactNumber: "",
      }}
      validationSchema={yup.object().shape({
        shopName: yup
          .string()
          .required("Required")
          .max(100, "Shop name can not be longer than 100 characters")
          .min(3, "Shop name must be at least 3 character long"),
        shopUsername: yup
          .string()
          .matches(/^[a-zA-Z0-9_.]+$/, {
            message: "Only letters numbers _ . are allowed. No empty spaces.",
            excludeEmptyString: true,
          })
          .required("Required")
          .min(5, "Username must be 5 characters long")
          .max(30, "Username can be max 30 characters long"),
        shopAddress: yup
          .string()
          .required("Required")
          .min(10, "Too short")
          .max(150, "Too long"),
        shopContactNumber: yup.string().matches(/^[1-9]\d{9}$/, {
          message: "Please enter valid number.",
          excludeEmptyString: false,
        }),
      })}
    >
      {props => {
        // eslint-disable-next-line default-case
        switch (step) {
          case 1:
            return <CreateShopPage handleNext={nextStep}></CreateShopPage>

          case 2:
            return (
              <CreateShopForm
                handleFileChange={handleFileChange}
                img={img}
                formikProps={props}
                handleBack={prevStep}
				localLocation={JSON.parse(atob(localSavedLocationData.localSavedLocation))}
              ></CreateShopForm>
            )
        }
      }}
    </Formik>
  )
}

export default CreateShop
