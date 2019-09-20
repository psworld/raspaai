import React from "react"

const FormError = props => {
  const { errors, touched } = props
  return (
    <>{errors && touched && <div style={{ color: "red" }}>{errors}</div>}</>
  )
}

export default FormError
