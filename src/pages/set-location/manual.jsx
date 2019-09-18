import React, { useState } from "react"
import Layout from "../../components/layout"
import Map from "../../components/map/Map"
import { makeStyles } from "@material-ui/core/styles"
import Typography from "@material-ui/core/Typography"
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

const ManualLocation = () => {
  const classes = useStyles()
  const [name, setName] = useState()
  const [markerPosition, setMarkerPosition] = React.useState(null)
  if (markerPosition) {
    var savedLocation = {
      name: name,
      lat: markerPosition.lat,
      lng: markerPosition.lng,
    }
  }
  const encSavedLocation = JSON.stringify(savedLocation)

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
      <Map
        markerPosition={markerPosition}
        setMarkerPosition={setMarkerPosition}
        center={{ lat: 31.818543, lng: 76.936076 }}
      ></Map>

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
    </Layout>
  )
}

export default ManualLocation
