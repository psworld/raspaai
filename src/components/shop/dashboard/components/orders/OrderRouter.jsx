import React from "react"
import SEO from "../../../../seo"
import { Router } from "@reach/router"
import PendingOrders from "./PendingOrders"
import FulfilledOrders from "./FulfilledOrders"
import CanceledOrders from "./CanceledOrders"

const OrderRouter = ({ shopUsername }) => {
  return (
    <Router>
      <PendingOrders path="pending" shopUsername={shopUsername}></PendingOrders>
      <FulfilledOrders
        path="fulfilled"
        shopUsername={shopUsername}
      ></FulfilledOrders>
      <CanceledOrders
        path="cancelled"
        shopUsername={shopUsername}
      ></CanceledOrders>
    </Router>
  )
}

export default OrderRouter
