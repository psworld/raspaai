import React from "react"

const ShopProduct = props => {
  console.log(props)
  const { shopUsername } = props
  return <h1>Shop Product. {shopUsername}</h1>
}

export default ShopProduct
