import React from "react"

import { GoogleMap, Marker, LoadScript } from "@react-google-maps/api"

import { makeStyles } from "@material-ui/core/styles"
import { Typography } from "@material-ui/core"
import TextField from "@material-ui/core/TextField"
import { Button } from "@material-ui/core"

const useStyles = makeStyles(theme => ({
  container: {
    display: "flex",
    flexWrap: "wrap",
    margin: theme.spacing(4),
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200,
  },
  dense: {
    marginTop: 19,
  },
  menu: {
    width: 200,
  },
}))
const apikey = "AIzaSyAUGzly5dIhIJubgTw1aHoUOlrf9TtQi1I"

const Map = props => {
  const classes = useStyles()

  const [name, setName] = React.useState()
  const [isLoaded, setIsLoaded] = React.useState(false)
  const [mapRef, setMapRef] = React.useState(null)
  const [center, setCenter] = React.useState(props.center)
  const [markerPosition, setMarkerPosition] = React.useState(null)

  if (markerPosition) {
    var savedLocation = {
      name: name,
      lat: markerPosition.lat,
      lng: markerPosition.lng,
    }
  }
  const encSavedLocation = JSON.stringify(savedLocation)

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
        onLoad={() => setIsLoaded(true)}
        zoom={15}
        center={center}
        onClick={e => handleClick(e.latLng.lat(), e.latLng.lng())}
      >
        <Marker
          visible={markerPosition ? true : false}
          position={markerPosition}
        />
      </GoogleMap>
      {isLoaded && (
        <form className={classes.container}>
          <TextField
            onChange={e => setName(e.target.value)}
            required
            id="standard-full-width"
            label="Name"
            style={{ margin: 8 }}
            // onFocus={true}
            placeholder="Name this location"
            // fullWidth
            margin="normal"
            variant="outlined"
            InputLabelProps={{
              shrink: true,
            }}
          />
          <Button
            onClick={() => localStorage.setItem("lla", btoa(encSavedLocation))}
            style={{ margin: 8 }}
            color="secondary"
            variant="contained"
          >
            Save Location
          </Button>
        </form>
      )}
    </LoadScript>
  )
}

export default Map
