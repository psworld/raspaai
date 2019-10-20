import React from "react"

import { GoogleMap, Marker, LoadScript } from "@react-google-maps/api"

import { makeStyles } from "@material-ui/core/styles"
import TextField from "@material-ui/core/TextField"
import Button from "@material-ui/core/Button"
import { useApolloClient } from "react-apollo"
import { navigate } from "gatsby"

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
const apikey = "AIzaSyD-ULA-6I-1_JnNRppIx2vzi5F6c_-4sdA"

const Map = props => {
  const { noSave = false } = props

  const classes = useStyles()
  const client = useApolloClient()
  const [name, setName] = React.useState()
  const [isLoaded, setIsLoaded] = React.useState(false)
  const [mapRef, setMapRef] = React.useState(null)
  const [center, setCenter] = React.useState(props.center)
  const [markerPosition, setMarkerPosition] = React.useState(
    props.automaticMarkerPosition
  )

  const { setLocation } = props

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
    setLocation(latLng)
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
        zoom={16}
        center={center}
        onClick={e => handleClick(e.latLng.lat(), e.latLng.lng())}
      >
        <Marker
          visible={markerPosition ? true : false}
          position={markerPosition}
        />
      </GoogleMap>
      {!noSave && isLoaded && (
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
            onClick={() =>
              localStorage.setItem("lla", btoa(encSavedLocation)) &
              client.writeData({
                data: { localSavedLocation: btoa(encSavedLocation) },
              }) &
              navigate("/")
            }
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
