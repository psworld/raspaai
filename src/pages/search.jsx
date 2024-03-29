import React from 'react';
import Layout from '../components/layout';
import { Router } from '@reach/router';
import SearchResultPage from '../components/search/SearchResultPage';
import { LOCAL_SAVED_LOCATION } from '.';
import { useQuery } from 'react-apollo';
import Loading from '../components/core/Loading';
import ErrorPage from '../components/core/ErrorPage';
import { Typography } from '@material-ui/core';
import { decryptText } from '../components/core/utils';
import SEO from '../components/seo';

const Search = () => {
  const { data, loading, error } = useQuery(LOCAL_SAVED_LOCATION);

  const browser = typeof window !== 'undefined' && window;
  const pathname = browser ? window.location.pathname : '';
  let searchPhrase = pathname.includes('/')
    ? decodeURI(pathname.split('/')[2])
    : '';

  return (
    <Layout searchPhrase={decodeURI(pathname.split('/')[2])}>
      <SEO
        title={searchPhrase}
        description={`Nearby search result for ${searchPhrase}`}></SEO>
      {data && data.localSavedLocation && (
        <Router>
          <SearchResultPage
            path='/search/:phrase/pg/:pageNo'
            savedLocation={JSON.parse(
              decryptText(data.localSavedLocation)
            )}></SearchResultPage>
          <SearchResultPage
            path='/search/:phrase/pg/:pageNo/:endCursor'
            savedLocation={JSON.parse(
              decryptText(data.localSavedLocation)
            )}></SearchResultPage>
        </Router>
      )}
      {loading && <Loading></Loading>}
      {error && <ErrorPage></ErrorPage>}
      {data && !data.localSavedLocation && (
        <Typography>No saved location were found.</Typography>
      )}
    </Layout>
  );
};

export default Search;
