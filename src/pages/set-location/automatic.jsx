// import React from "react"
// import Layout from "../../components/layout"

// import { usePosition } from "use-position"
// import Map from "../../components/map/Map"
// import List from "@material-ui/core/List"
// import ListItem from "@material-ui/core/ListItem"
// import ListItemText from "@material-ui/core/ListItemText"
// import Typography from "@material-ui/core/Typography"
// import { makeStyles } from "@material-ui/core/styles"
// import Button from "@material-ui/core/Button"
// import Link from "../../components/core/Link"

// const useStyles = makeStyles(theme => ({
//   container: {
//     // width: "100%",
//     margin: 4,
//     // backgroundColor: theme.palette.background.paper,
//   },
//   nested: {
//     paddingLeft: theme.spacing(4),
//   },
// }))

// const errorMessageList = [
//   {
//     primary: "Device GPS is turned off",
//     secondary: <span>Turn on your device GPS and reload this page.</span>,
//   },
//   {
//     primary: "User denied to give permission",
//     secondary: (
//       <span>Reload the page and give us permission to access the location</span>
//     ),
//   },
//   {
//     primary: "Geo location is not supported by browser",
//     secondary: (
//       <span>
//         You can always set location manually. Click below to set location
//         manually.
//       </span>
//     ),
//   },
// ]

// const AutomaticLocation = () => {
//   const classes = useStyles()
//   const { latitude, longitude, timestamp, accuracy, error } = usePosition()
//   const automaticMarkerPosition = {
//     lat: latitude,
//     lng: longitude,
//   }
//   return (
//     <Layout>
//       {error ? (
//         <div className={classes.container}>
//           <Typography variant="h6" color="secondary">
//             Getting location automatically failed due to one of the following
//             reasons.
//           </Typography>
//           <List>
//             {errorMessageList.map((message, index) => (
//               <ListItem key={index}>
//                 <ListItemText
//                   primary={message.primary}
//                   secondary={<span>&ensp;&ensp; {message.secondary}</span>}
//                 ></ListItemText>
//               </ListItem>
//             ))}
//           </List>
//           <Button
//             component={Link}
//             to="/set-location/manual"
//             color="primary"
//             variant="contained"
//           >
//             Set Location Manually
//           </Button>
//         </div>
//       ) : longitude && latitude ? (
//         <div>
//           <Typography
//             color="secondary"
//             style={{ margin: 8 }}
//             align="center"
//             variant="h6"
//           >
//             If this is not you correct location you can change it by clicking
//             anywhere on the map.
//           </Typography>
//           <Map
//             center={automaticMarkerPosition}
//             automaticMarkerPosition={automaticMarkerPosition}
//           ></Map>
//         </div>
//       ) : (
//         <div>
//           <Typography style={{ margin: 5 }} align="center" variant="h4">
//             We are fetching you current location.
//           </Typography>
//           <br></br>
//           <Typography
//             style={{ marginBottom: 3 }}
//             variant="body2"
//             align="center"
//             color="primary"
//             paragraph
//           >
//             * Allow us to access your location. Requires GPS for accuracy.
//           </Typography>
//         </div>
//       )}
//     </Layout>
//   )
// }

// export default AutomaticLocation
