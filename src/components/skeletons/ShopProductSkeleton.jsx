import React from "react"

import Skeleton from "@material-ui/lab/Skeleton"
import Grid from "@material-ui/core/Grid"
import Divider from "@material-ui/core/Divider"
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@material-ui/core"

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
        style={{ paddingLeft: 10, paddingRight: 8 }}
        item
        xs={12}
        sm={6}
        md={6}
      >
        <Skeleton height={30} width="80%"></Skeleton>

        <Skeleton width="30%"></Skeleton>

        <Skeleton width="30%"></Skeleton>
        <Divider />
        <div style={{ padding: 5 }}>
          <Skeleton width="25%"></Skeleton>
          <Skeleton width="25%"></Skeleton>
          <Skeleton width="25%"></Skeleton>
        </div>
        <Divider />
        <div>
          <Skeleton width="20%"></Skeleton>
        </div>
        <Divider></Divider>
        <Skeleton></Skeleton>
        <Skeleton width="30%"></Skeleton>
        <div style={{ paddingTop: 10 }}>
          <Skeleton></Skeleton>
          <Skeleton></Skeleton>
          <Skeleton width="60%"></Skeleton>
        </div>

        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>
                <Skeleton width="50%"></Skeleton>
              </TableCell>
              <TableCell>
                <Skeleton width="50%"></Skeleton>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(key => {
              return (
                <TableRow key={key}>
                  <TableCell component="th" scope="row">
                    <Skeleton width="40%"></Skeleton>
                  </TableCell>
                  <TableCell>
                    <Skeleton width="60%"></Skeleton>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </Grid>
      <Grid
        style={{ paddingLeft: 8, paddingRight: 8 }}
        item
        xs={12}
        sm={12}
        md={2}
      >
        <div style={{ paddingBottom: 5 }}>
          <Skeleton height={30} width="100%"></Skeleton>
        </div>
        <div style={{ paddingBottom: 5 }}>
          <Skeleton height={20} width="60%"></Skeleton>
          <Skeleton></Skeleton>
          <Skeleton width="30%"></Skeleton>
        </div>
        <Skeleton height={20} width="60%"></Skeleton>
        <Skeleton></Skeleton>
      </Grid>
    </Grid>
  )
}

export default ShopProductSkeleton
