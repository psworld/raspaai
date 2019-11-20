import React from "react"

const ProductThumb = ({ src, alt, title }) => {
  return (
    <img
      style={{ width: "100%" }}
      title={title}
      alt={title}
      src={`${process.env.GATSBY_IMG_URL_PRE}/${src}`}
    />
  )
}

export default ProductThumb
