import React, { useState } from "react"
import Layout from "../../components/layout"
import Map from "../../components/map/Map"
import Typography from "@material-ui/core/Typography"

const ManualLocation = () => {
  return (
    <Layout>
      <br></br>
      <Typography align="center" variant="h3">
        Click on the map to set your location.
      </Typography>
      <br></br>

      {/* Name<input onChange={e => setName(e.target.value)}></input>
      Enter latitude<input onChange={e => setLat(e.target.value)}></input>
      Enter longitude<input onChange={e => setLng(e.target.value)}></input>
      <button
        onClick={() => localStorage.setItem("lla", btoa(encSavedLocation))}
      >
        Set Location
      </button> */}
      <Map center={{ lat: 31.818543, lng: 76.936076 }}></Map>
    </Layout>
  )
}

export default ManualLocation
