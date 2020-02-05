import { gql } from 'apollo-boost';
import React from 'react';
import { useQuery } from 'react-apollo';
import ErrorPage from '../components/core/ErrorPage';
import Home from '../components/home/Home';
import Layout from '../components/layout';
import { VIEWER } from '../components/navbar/ToolBarMenu';
import SEO from '../components/seo';
import HomePageSkeleton from '../components/skeletons/HomePageSkeleton';

// New location feature
// const lat, lng = 31.708141, 76.931657
// eyJuYW1lIjoiTWFuZGkiLCJsYXQiOiIzMS43MDgwNjciLCJsbmciOiI3Ni45MzEzNTcifQ==

export const LOCAL_SAVED_LOCATION = gql`
  {
    localSavedLocation @client
  }
`;

const ONLINE_SAVED_LOCATION = gql`
  {
    activeSavedLocation {
      geometry {
        coordinates
      }
      properties {
        name
      }
    }
  }
`;

const OnlineSavedLocation = () => {
  const { loading, error, data: onlineSavedLocationData } = useQuery(
    ONLINE_SAVED_LOCATION
  );
  if (loading) return <HomePageSkeleton></HomePageSkeleton>;
  if (error) return <ErrorPage></ErrorPage>;
  if (onlineSavedLocationData && onlineSavedLocationData.activeSavedLocation) {
    const activeSavedLocation = onlineSavedLocationData.activeSavedLocation[0];
    const location = {
      name: activeSavedLocation.properties.name,
      lat: activeSavedLocation.geometry.coordinates[1],
      lng: activeSavedLocation.geometry.coordinates[0]
    };
    localStorage.setItem('lla', btoa(JSON.stringify(location)));
    return <Home location={location} from='online location'></Home>;
  }
  return <h1>No location were found ONLINE</h1>;
};

const Index = props => {
  const { data: localSavedLocationData } = useQuery(LOCAL_SAVED_LOCATION);
  const { loading, error, data } = useQuery(VIEWER);

  if (localSavedLocationData && localSavedLocationData.localSavedLocation) {
    const location = JSON.parse(
      atob(localSavedLocationData.localSavedLocation)
    );
    return <Home location={location}></Home>;
  }
  if (loading) return <HomePageSkeleton></HomePageSkeleton>;
  if (error) return <ErrorPage></ErrorPage>;

  // if a user is logged in then check for online saved locations
  if (data && data.viewer !== null) {
    return <OnlineSavedLocation></OnlineSavedLocation>;
  }

  return <h1>No saved location were found at any place</h1>;
};

// We will provide major popular places to choose from.
// No need for ONLINE_SAVED_LOCATION

const IndexPage = () => {
  const { loading, data } = useQuery(LOCAL_SAVED_LOCATION);

  return (
    <Layout>
      <SEO
        title='Online shopping: Shop and search online for nearby services and products'
        description='Raspaai.in | Buy anything from your local stores'></SEO>
      {loading && <HomePageSkeleton></HomePageSkeleton>}
      {data && data.localSavedLocation && (
        <Home location={JSON.parse(atob(data.localSavedLocation))}></Home>
      )}
    </Layout>
  );
};

export default IndexPage;
