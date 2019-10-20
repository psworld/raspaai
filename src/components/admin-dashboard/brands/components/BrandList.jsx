import React from "react"
import { ListItemText, ListItem, List } from "@material-ui/core"
import PaginationWithState from "../../../templates/PaginationWithState"
import Link from "../../../core/Link"

const BrandList = ({ data, pageNo, pageInfo, setPageInfo, setPageNo }) => {
  const baseUrl = `/raspaai/dashboard/brands`
  const {
    edges: brandList,
    pageInfo: { hasNextPage, endCursor: currentPageEndCursor },
  } = data.adminBrands
  return (
    <List>
      {brandList.map(brandObj => {
        const { id, publicUsername, title } = brandObj.node
        return (
          <ListItem
            component={Link}
            to={`${baseUrl}/${publicUsername}`}
            key={id}
          >
            <ListItemText
              primary={publicUsername}
              secondary={title}
            ></ListItemText>
          </ListItem>
        )
      })}
      <ListItem>
        <PaginationWithState
          pageNo={pageNo}
          setPageNo={setPageNo}
          pageInfo={pageInfo}
          setPageInfo={setPageInfo}
          currentPageEndCursor={currentPageEndCursor}
          hasNextPage={hasNextPage}
        ></PaginationWithState>
      </ListItem>
    </List>
  )
}

export default BrandList
