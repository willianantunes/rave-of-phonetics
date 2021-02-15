const path = require("path")
require("dotenv").config({
  path: `.env.${process.env.NODE_ENV}`,
})

module.exports = {
  siteMetadata: {
    title: `Rave of Phonetics: Your IPA transcription and spelling tool`,
    author: {
      name: `Willian Antunes`,
    },
    description: `Web Speech Application which translates your text into its phonetic transcription using the International Phonetic Alphabet.`,
    siteUrl: `https://www.raveofphonetics.com`,
    social: {
      twitter: `raveofphonetics`,
      twitterLink: `https://twitter.com/raveofphonetics`,
      instagram: `raveofphonetics`,
      instagramLink: `https://www.instagram.com/raveofphonetics`,
      facebook: `raveofphonetics`,
      facebookLink: `https://www.facebook.com/raveofphonetics`,
    },
  },
  plugins: [
    {
      resolve: "gatsby-source-filesystem",
      options: {
        path: `${__dirname}/static/assets`,
        name: "uploads",
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/content/blog`,
        name: `blog`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/content/assets`,
        name: `assets`,
      },
    },
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 630,
              linkImagesToOriginal: false,
            },
          },
          {
            resolve: `gatsby-remark-responsive-iframe`,
            options: {
              wrapperStyle: `margin-bottom: 1.0725rem`,
            },
          },
          {
            resolve: `@raae/gatsby-remark-oembed`,
            options: {
              usePrefix: false,
              providers: {
                include: ["Youtube", "Twitter", "Codepen"],
                exclude: ["Reddit", "Flickr", "Instagram"],
              },
            },
          },
          `gatsby-remark-prismjs`,
          `gatsby-remark-copy-linked-files`,
          `gatsby-remark-smartypants`,
          `gatsby-plugin-catch-links`,
          `gatsby-remark-lazy-load`,
        ],
      },
    },
    `gatsby-plugin-sitemap`,
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: "gatsby-plugin-google-tagmanager",
      options: {
        id: process.env.GOOGLE_TAGMANAGER_ID,
        // Include GTM in development.
        // Defaults to false meaning GTM will only be loaded in production.
        includeInDevelopment: false,
        // Name of the event that is triggered
        // Defaults to gatsby-route-change
        routeChangeEventName: "ROUTE-CHANGE",
      },
    },
    `gatsby-plugin-feed`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Rave of Phonetics`,
        short_name: `RoP`,
        categories: ["education", "utilities", "entertainment"],
        description: `Web Speech Application which translates your text into its phonetic transcription using the International Phonetic Alphabet.`,
        lang: "English",
        start_url: `https://www.raveofphonetics.com`,
        background_color: `#2196F3`,
        theme_color: `darkseagreen`,
        display: `minimal-ui`,
        icon: `content/assets/rop-icon.png`,
        icons: [
          {
            src: "content/assets/rop-maskable-icon.png",
            sizes: "853x853",
            type: "image/png",
            purpose: "any maskable",
          },
        ],
      },
    },
    `gatsby-plugin-react-helmet`,
    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.dev/offline
    // `gatsby-plugin-offline`,
    `gatsby-theme-material-ui`,
    `gatsby-plugin-styled-components`,
    `gatsby-plugin-use-query-params`,
    `gatsby-plugin-lodash`,
    {
      resolve: `gatsby-plugin-disqus`,
      options: {
        shortname: `rave-of-phonetics`,
      },
    },
    {
      resolve: `gatsby-plugin-netlify-cms`,
      options: {
        modulePath: path.join(__dirname, "src", "cms", "cms.js"),
      },
    },
  ],
}
