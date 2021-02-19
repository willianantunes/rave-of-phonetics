const path = require("path")

require("dotenv").config({
  path: `.env.${process.env.NODE_ENV}`,
})

const { GOOGLE_TAGMANAGER_ID, SITE_URL, DISQUS_SHORTNAME } = require("./src/config/settings")

const siteMetadata = {
  name: `Rave of Phonetics`,
  shortName: `RoP`,
  title: `Rave of Phonetics: Your IPA transcription and spelling tool`,
  author: {
    name: `Willian Antunes`,
  },
  description: `Web Speech Application which translates your text into its phonetic transcription using the International Phonetic Alphabet.`,
  siteUrl: SITE_URL,
  social: {
    twitter: `raveofphonetics`,
    twitterLink: `https://twitter.com/raveofphonetics`,
    instagram: `raveofphonetics`,
    instagramLink: `https://www.instagram.com/raveofphonetics`,
    facebook: `raveofphonetics`,
    facebookLink: `https://www.facebook.com/raveofphonetics`,
  },
}

module.exports = {
  siteMetadata,
  plugins: [
    `gatsby-plugin-sharp`,
    `gatsby-transformer-sharp`,
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
        path: `${__dirname}/content/assets`,
        name: `assets`,
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
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          {
            resolve: "gatsby-remark-relative-images",
            options: {
              name: "uploads",
            },
          },
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 630,
              linkImagesToOriginal: false,
            },
          },
          {
            resolve: "gatsby-remark-copy-linked-files",
            options: {
              destinationDir: "static/assets/",
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
    {
      resolve: "gatsby-plugin-google-tagmanager",
      options: {
        id: GOOGLE_TAGMANAGER_ID,
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
        name: siteMetadata.name,
        short_name: siteMetadata.shortName,
        categories: ["education", "utilities", "entertainment"],
        description: siteMetadata.description,
        lang: "English",
        start_url: `/`,
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
    `gatsby-plugin-offline`,
    `gatsby-theme-material-ui`,
    `gatsby-plugin-styled-components`,
    `gatsby-plugin-use-query-params`,
    `gatsby-plugin-lodash`,
    {
      resolve: `gatsby-plugin-disqus`,
      options: {
        shortname: DISQUS_SHORTNAME,
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
