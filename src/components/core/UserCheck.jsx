import React from 'react';
import { useQuery } from 'react-apollo';
import { VIEWER } from '../navbar/ToolBarMenu';
import Loading from './Loading';
import ErrorPage from './ErrorPage';
import { navigate } from 'gatsby';

const UserCheck = ({ children, withViewerProp = true }) => {
  const { loading, error, data } = useQuery(VIEWER);

  if (loading) return <Loading></Loading>;
  if (error) return <ErrorPage></ErrorPage>;
  if (data && data.viewer !== null) {
    if (withViewerProp) {
      const childrenWithProps = React.Children.map(children, child =>
        React.cloneElement(child, { viewer: data.viewer })
      );

      return <>{childrenWithProps}</>;
    } else {
      return <>{children}</>;
    }
  }
  return <>{navigate('/signin')}</>;
};

export default UserCheck;
