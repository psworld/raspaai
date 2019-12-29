import React from 'react';

import Layout from '../components/layout';
import SEO from '../components/seo';
// const browser = typeof window !== "undefined" && window
// "@material-ui/icons": "^4.5.1",
//     "@material-ui/lab": "^4.0.0-alpha.37",
export const NotFoundPageWithoutLayout = () => (
  <>
    <SEO title='404: Not found' />
    <h1>NOT FOUND</h1>
    <p>You just hit a route that doesn&#39;t exist.</p>
  </>
);

const NotFoundPage = () => (
  <Layout>
    <SEO title='404: Not found' />
    <h1>NOT FOUND</h1>
    <p>You just hit a route that doesn&#39;t exist... the sadness.</p>
  </Layout>
);

export default NotFoundPage;
