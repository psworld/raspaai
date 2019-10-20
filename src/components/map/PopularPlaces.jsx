import React from "react"

import { useQuery } from "react-apollo"
import gql from "graphql-tag"

import Grid from "@material-ui/core/Grid"
import Box from "@material-ui/core/Box"
import Paper from "@material-ui/core/Paper"

import ErrorPage from "../core/ErrorPage"

import SquareElementGridSkeleton from "../skeletons/SquareElementSkeleton"
import SquareElement from "../templates/SquareElement"

const POPULAR_PLACES = gql`
  query($lat: Float!, $lng: Float!) {
    popularPlaces(lat: $lat, lng: $lng, first: 20) {
      edges {
        node {
          id
          geometry {
            coordinates
          }
          properties {
            name
          }
        }
      }
    }
  }
`

const PopularPlaces = ({ currentLocation }) => {
  const { loading, error, data } = useQuery(POPULAR_PLACES, {
    variables: {
      lat: currentLocation.lat,
      lng: currentLocation.lng,
    },
  })

  if (loading) return <SquareElementGridSkeleton></SquareElementGridSkeleton>
  if (error) return <ErrorPage></ErrorPage>
  if (data && data.popularPlaces) {
    const {
      popularPlaces: { edges: popularPlaces },
    } = data
    return (
      <Box overflow="hidden" clone>
        <Paper>
          <Box px={0}>
            <Grid container>
              {popularPlaces.map(popularPlaceObj => {
                const {
                  id,
                  geometry: { coordinates },
                  properties: { name },
                } = popularPlaceObj.node
                return <SquareElement key={id} title={name}></SquareElement>
              })}
            </Grid>
          </Box>
        </Paper>
      </Box>
    )
  }
}

export default PopularPlaces
