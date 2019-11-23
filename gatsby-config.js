require('dotenv').config({
  path: `.env.${process.env.NODE_ENV}`
});

module.exports = {
  siteMetadata: {
    title: `Raspaai`,
    description: `Raspaai.in | Order from local shops, electronics, food and much more`,
    siteUrl: `https://www.raspaai.in`,
    author: `@ps_worlds`,
    social: {
      twitter: `raspaai`,
      facebook: `raspaai`,
      instagram: `raspaai.in`,
      youtube: `UC8cQk9mevrOSCJBO5t5u2AQ`
    }
  },
  plugins: [
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-plugin-material-ui`
      // options: {
      //   disableAutoprefixing: true,
      //   disableMinification: true,
      // },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`
      }
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Raspaai`,
        short_name: `raspaai`,
        start_url: `/`,
        background_color: `#663399`,
        theme_color: `#663399`,
        display: `minimal-ui`,
        icon: `src/images/raspaai4.png` // This path is relative to the root of the site.
      }
    }
    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.dev/offline
    // `gatsby-plugin-offline`,
  ]
};
