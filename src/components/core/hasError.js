export const hasErrors = errors => {
  if (Object.keys(errors).length === 0 && errors.constructor === Object) {
    return false
  } else return true
}
