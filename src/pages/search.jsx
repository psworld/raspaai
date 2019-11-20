import React from "react"
import Layout from "../components/layout"
import { Router } from "@reach/router"
import SearchResultPage from "../components/search/SearchResultPage"
import { LOCAL_SAVED_LOCATION } from "."
import { useQuery } from "react-apollo"

const Search = () => {
  const { data } = useQuery(LOCAL_SAVED_LOCATION)

  return (
    <Layout>
      {data && data.localSavedLocation ? (
        <Router>
          <SearchResultPage
            path="/search/:phrase/pg/:pageNo"
            savedLocation={JSON.parse(atob(data.localSavedLocation))}
          ></SearchResultPage>
          <SearchResultPage
            path="/search/:phrase/pg/:pageNo/:endCursor"
            savedLocation={JSON.parse(atob(data.localSavedLocation))}
          ></SearchResultPage>
        </Router>
      ) : (
        <h1>No saved location were found</h1>
      )}
    </Layout>
  )
}

export default Search
