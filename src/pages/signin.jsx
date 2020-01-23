import React from 'react';
import Layout from '../components/layout';
import SEO from '../components/seo';
import SigninForm from '../components/signin/SigninForm';

const Signin = props => {
  if (props && props.location && props.location.state) {
    var message = props.location.state.message;
  }
  let nextUrl = '/';
  if (props && props.location && props.location.search) {
    const search = props.location.search;
    if (search.includes('?next=')) {
      nextUrl = search.split('?next=')[1];
    }
  }
  return (
    <Layout>
      <SEO title={'Sign In'}></SEO>

      <SigninForm redirectUrl={nextUrl} message={message}></SigninForm>
    </Layout>
  );
};

export default Signin;
