/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React from 'react';
import PropTypes from 'prop-types';
import { useStaticQuery, graphql } from 'gatsby';

import NavBar from './navbar/NavBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Footer from './Footer';

const Layout = ({ children, searchPhrase = null }) => {
  const data = useStaticQuery(graphql`
    query SiteTitleQuery {
      site {
        siteMetadata {
          title
          social {
            twitter
            facebook
            instagram
            youtube
          }
        }
      }
    }
  `);

  return (
    <>
      <CssBaseline></CssBaseline>
      <NavBar
        searchPhrase={searchPhrase}
        siteTitle={data.site.siteMetadata.title}
      />
      <main>{children}</main>
      <Footer social={data.site.siteMetadata.social}></Footer>
    </>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired
};

export default Layout;
