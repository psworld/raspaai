import React from "react"
import MuiLink from "@material-ui/core/Link"
import { Link as GatsbyLink } from "gatsby"

export const MenuItemLink = React.forwardRef(function Link(props, ref) {
  return (
    <MuiLink
      style={{ color: "inherit" }}
      component={GatsbyLink}
      ref={ref}
      {...props}
    />
  )
})

const Link = React.forwardRef(function Link(props, ref) {
  return <MuiLink component={GatsbyLink} ref={ref} {...props} />
})

// const Link = React.forwardRef(function Link(props, ref) {
//   return (
//     <GatsbyLink
//       // style={{ color: "inherit" }}
//       innerRef={ref}
//       {...props}
//     ></GatsbyLink>
//   )
// })

export default Link
