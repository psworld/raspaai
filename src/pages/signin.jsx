import React from "react"
import SigninForm from "../components/signin/SigninForm"

import SEO from "../components/seo"
import Layout from "../components/layout"

const Signin = props => {
  if (props && props.location && props.location.state) {
    var message = props.location.state.message
    var redirectUrl = props.location.state.redirectUrl
  }
  return (
    <Layout>
      <SEO title={"Sign In"}></SEO>

      <SigninForm redirectUrl={redirectUrl} message={message}></SigninForm>
    </Layout>
  )
}

export default Signin
