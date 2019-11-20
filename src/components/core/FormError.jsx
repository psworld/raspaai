import React from "react"

const FormError = ({ errors, touched }) => {
  return (
    <>{errors && touched && <div style={{ color: "red" }}>{errors}</div>}</>
  )
}

export default FormError
