import React from "react"
import { navigate } from "gatsby"

import SearchIcon from "@material-ui/icons/Search"
import Box from "@material-ui/core/Box"
import TextField from "@material-ui/core/TextField"

const SearchBar = props => {
  const {
    publicUsername,
    isBrand = false,
    isAddNewShopProductSearch = false,
  } = props

  const [searchPhrase, setSearchPhrase] = React.useState("")

  const shopSearch = `/dashboard/shop/${publicUsername}/products/search/${searchPhrase}`
  const brandSearch = `/dashboard/brand/${publicUsername}/products/search/${searchPhrase}`
  const addNewShopProductSearch = `/dashboard/shop/${publicUsername}/product/add/search/${searchPhrase}`
  return (
    <Box width={250} height={56} style={{ flexGrow: 1 }}>
      <TextField
        onChange={e => setSearchPhrase(e.target.value)}
        defaultValue={""}
        onKeyPress={e => {
          if (searchPhrase.replace(/\s/g, "").length > 1 && e.key === "Enter") {
            navigate(
              isAddNewShopProductSearch
                ? addNewShopProductSearch
                : isBrand
                ? brandSearch
                : shopSearch
            )
          }
        }}
        id="outlined-full-width"
        // style={{ margin: 8 }}
        placeholder={"search products here"}
        style={{ maxWidth: "100%" }}
        margin="none"
        variant="outlined"
        InputLabelProps={{
          shrink: true,
        }}
      />
      {/* </div> */}
      <SearchIcon
        style={{ marginTop: 16, marginLeft: 1 }}
        onClick={() =>
          searchPhrase.replace(/\s/g, "").length > 1 &&
          navigate(
            isAddNewShopProductSearch
              ? addNewShopProductSearch
              : isBrand
              ? brandSearch
              : shopSearch
          )
        }
      />
    </Box>
  )
}

export default SearchBar
