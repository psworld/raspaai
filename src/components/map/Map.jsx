import React from "react"

import { GoogleMap, Marker, LoadScript } from "@react-google-maps/api"
import { Typography } from "@material-ui/core"

const apikey = "AIzaSyAUGzly5dIhIJubgTw1aHoUOlrf9TtQi1I"

const Map = props => {
  const [mapRef, setMapRef] = React.useState(null)
  const [center, setCenter] = React.useState(props.center)
  const { markerPosition, setMarkerPosition } = props

  function handleClick(lat, lng) {
    const latLng = {
      lat: lat,
      lng: lng,
    }
    setMarkerPosition(latLng)
  }

  return (
    <LoadScript id="script-loader" googleMapsApiKey={apikey}>
      <GoogleMap
        id="circle-example"
        mapContainerStyle={{
          height: "80vh",
          width: "100%",
        }}
        // onLoad={map => setMapRef(map)}
        zoom={15}
        center={center}
        onClick={e => handleClick(e.latLng.lat(), e.latLng.lng())}
      >
        <Marker
          visible={markerPosition ? true : false}
          position={markerPosition}
        />
      </GoogleMap>
    </LoadScript>
  )
}

export default Map
