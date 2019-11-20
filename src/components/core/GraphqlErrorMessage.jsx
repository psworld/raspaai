import React from "react"

const GraphqlErrorMessage = ({ message, critical = false }) => {
  const color = critical ? "red" : "green"
  return <p style={{ color: color }}>{message.split(":")[1]}</p>
}

export default GraphqlErrorMessage
