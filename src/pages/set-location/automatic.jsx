import React from "react"
import Layout from "../../components/layout"

import { usePosition } from "use-position"
import Map from "../../components/map/Map"
import { Typography } from "@material-ui/core"

const AutomaticLocation = () => {
  const { latitude, longitude, timestamp, accuracy, error } = usePosition()
  const automaticMarkerPosition = {
    lat: latitude,
    lng: longitude,
  }
  return (
    <Layout>
      {error ? (
        <h1>{error}</h1>
      ) : longitude && latitude ? (
        <div>
          <Typography
            color="secondary"
            style={{ margin: 8 }}
            align="center"
            variant="h6"
          >
            If this is not you correct location you can change it by clicking
            anywhere on the map.
          </Typography>
          <Map
            center={automaticMarkerPosition}
            automaticMarkerPosition={automaticMarkerPosition}
          ></Map>
        </div>
      ) : (
        <div>
          <Typography style={{ margin: 5 }} align="center" variant="h4">
            We are fetching you current location.
          </Typography>
          <br></br>
          <Typography
            style={{ marginBottom: 3 }}
            variant="body2"
            align="center"
            color="primary"
            paragraph
          >
            * Allow us to access your location. Requires GPS for accuracy.
          </Typography>
        </div>
      )}
    </Layout>
  )
}

export default AutomaticLocation
