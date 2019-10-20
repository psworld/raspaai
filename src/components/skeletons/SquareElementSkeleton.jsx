import React from "react"

import Skeleton from "@material-ui/lab/Skeleton"
import Grid from "@material-ui/core/Grid"
import { Box } from "@material-ui/core"

const SquareElementSkeleton = () => {
  return (
    <Grid item xs={6} sm={4} md={3} lg={2}>
      <Box width="100%" px={1} my={2}>
        <Skeleton width="100%" style={{ paddingTop: "100%" }}></Skeleton>
      </Box>
    </Grid>
  )
}

const SquareElementGridSkeleton = () => {
  return (
    <Grid container>
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(index => (
        <SquareElementSkeleton key={index}></SquareElementSkeleton>
      ))}
    </Grid>
  )
}

export default SquareElementGridSkeleton
