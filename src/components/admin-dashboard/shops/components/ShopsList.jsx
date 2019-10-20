import React from "react"
import { ListItemText, ListItem, List } from "@material-ui/core"
import PaginationWithState from "../../../templates/PaginationWithState"
import Link from "../../../core/Link"

const ShopList = ({ data, pageNo, pageInfo, setPageInfo, setPageNo }) => {
  const baseUrl = `/raspaai/dashboard/shops`
  const {
    edges: shopList,
    pageInfo: { hasNextPage, endCursor: currentPageEndCursor },
  } = data.adminShops

  return (
    <List>
      {shopList.map(shopObj => {
        const {
          id,
          properties: { publicUsername, title },
        } = shopObj.node
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

export default ShopList
