import React from "react"
import { Router } from "@reach/router"
import AdminDashboard from "../components/admin-dashboard/AdminDashboard"

const Raspaai = () => {
  return (
    <Router>
      <AdminDashboard path="/raspaai/dashboard/*"></AdminDashboard>
    </Router>
  )
}

export default Raspaai
