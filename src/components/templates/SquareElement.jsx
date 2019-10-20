import React from "react"

import Grid from "@material-ui/core/Grid"
import Typography from "@material-ui/core/Typography"
import Box from "@material-ui/core/Box"
import Link from "../core/Link"

import sq1 from "../../images/sq1.jpg"

const SquareElement = props => {
  const { title } = props
  return (
    <Grid item xs={6} sm={4} md={3} lg={2}>
      <Box width={"100%"} px={1} my={2}>
        <Link to={"/"}>
          <img
            style={{ height: "100%", width: "100%" }}
            alt={title}
            src={sq1}
          />
          <Typography variant="body2">{title.substring(0, 30)}</Typography>
        </Link>
      </Box>
    </Grid>
  )
}

export default SquareElement
