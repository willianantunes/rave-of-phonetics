const path = require("path")

require("dotenv").config({
  path: `.env.${process.env.NODE_ENV}`,
})

const { SITE_URL } = require("./src/config/settings")

const siteMetadata = {
  name: `Rave of Phonetics`,
  shortName: `RoP`,
  title: `Rave of Phonetics: Your IPA transcription and spelling tool`,
  author: {
    name: `Willian Antunes`,
  },
  description: `Web Speech Application which translates your text into its phonetic transcription using the International Phonetic Alphabet.`,
  keywords: ["phonetic", "transcription", "tts", "ipa"],
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

const plugins = [
  `gatsby-plugin-image`,
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
        `gatsby-remark-relative-images`,
        {
          // It will create publicURL
          resolve: `gatsby-remark-images`,
          options: {},
        },
        `gatsby-plugin-catch-links`,
        `gatsby-remark-lazy-load`,
      ],
    },
  },
  `gatsby-plugin-sitemap`,
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
    resolve: `gatsby-plugin-netlify-cms`,
    options: {
      modulePath: path.join(__dirname, "src", "cms", "cms.js"),
      publicPath: "nebuchadnezzar",
      manualInit: true,
    },
  },
  `gatsby-plugin-netlify`,
]

const robotsConfiguration = {
  resolve: "gatsby-plugin-robots-txt",
  options: {
    host: `${siteMetadata.siteUrl}`,
    sitemap: `${siteMetadata.siteUrl}sitemap.xml`,
  },
}

// I had to do this conditional because gatsby serve throws an error saying that siteUrl is undefined
if (siteMetadata.siteUrl && siteMetadata.siteUrl.includes("www")) {
  robotsConfiguration.options.policy = [{ userAgent: "*", allow: "/" }]
} else {
  robotsConfiguration.options.policy = [{ userAgent: "*", disallow: "/" }]
}

plugins.push(robotsConfiguration)

module.exports = {
  siteMetadata,
  plugins,
}
