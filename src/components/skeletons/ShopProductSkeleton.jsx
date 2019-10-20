import React from "react"

import Skeleton from "@material-ui/lab/Skeleton"
import Grid from "@material-ui/core/Grid"
import Divider from "@material-ui/core/Divider"

const ShopProductSkeleton = () => {
  return (
    <Grid container>
      <Grid item xs={12} sm={6} md={4}>
        <Skeleton
          width={"100%"}
          style={{ marginTop: 0, paddingTop: "125%" }}
        ></Skeleton>
      </Grid>
      <Grid
        style={{ paddingLeft: 8, paddingRight: 8 }}
        item
        xs={12}
        sm={6}
        md={6}
      >
        <Skeleton width="80%" height={30}></Skeleton>
        <Skeleton width="30%"></Skeleton>
        <Divider />
        <Skeleton width="25%"></Skeleton>
        <Skeleton width="25%"></Skeleton>
        <Skeleton width="25%"></Skeleton>
        <Divider />
      </Grid>
      <Grid
        style={{ paddingLeft: 8, paddingRight: 8 }}
        item
        xs={12}
        sm={12}
        md={2}
      >
        <Skeleton width="30%"></Skeleton>
      </Grid>
    </Grid>
  )
}

export default ShopProductSkeleton
