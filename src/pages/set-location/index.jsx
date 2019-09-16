import React from "react"
import Layout from "../../components/layout"
import { Link } from "gatsby"

const SetLocation = () => {
  return (
    <Layout>
      <h1>Set location here. Either set it manual or schoose</h1>
      <Link to="/set-location/manual">Set Location Manually </Link>
      <Link to="/set-location/automatic">Get Location Automatically</Link>
    </Layout>
  )
}

export default SetLocation
