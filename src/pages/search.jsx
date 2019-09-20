import React from "react"
import Layout from "../components/layout"
import { Router } from "@reach/router"
import SearchResultPage from "../components/search/SearchResultPage"

const Search = () => {
  return (
    <Layout>
      <Router>
        <SearchResultPage path="/search/:phrase/pg/:pageNo/@/:latitude/:longitude"></SearchResultPage>
        <SearchResultPage path="/search/:phrase/pg/:pageNo/@/:latitude/:longitude/:endCursor"></SearchResultPage>
      </Router>
    </Layout>
  )
}

export default Search
