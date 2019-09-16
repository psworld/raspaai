import React, { useState } from "react"
import Layout from "../../components/layout"
import { setCookie } from "../../components/core/cookie"

const ManualLocation = () => {
  const [lat, setLat] = useState()
  const [lng, setLng] = useState()
  const [name, setName] = useState()
  const savedLocation = {
    name: name,
    lat: lat,
    lng: lng,
  }
  const encSavedLocation = JSON.stringify(savedLocation)

  return (
    <Layout>
      <h1>Set Location Manually here</h1>
      Name<input onChange={e => setName(e.target.value)}></input>
      Enter latitude<input onChange={e => setLat(e.target.value)}></input>
      Enter longitude<input onChange={e => setLng(e.target.value)}></input>
      <button
        onClick={() => localStorage.setItem("lla", btoa(encSavedLocation))}
      >
        Set Location
      </button>
    </Layout>
  )
}

export default ManualLocation
