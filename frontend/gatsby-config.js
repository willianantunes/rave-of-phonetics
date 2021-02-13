module.exports = {
  siteMetadata: {
    title: `Rave of Phonetics: Your IPA transcription and spelling tool`,
    author: {
      name: `Willian Antunes`,
    },
    description: `Web Speech Application which translates your text into its phonetic transcription using the International Phonetic Alphabet.`,
    siteUrl: `https://www.raveofphonetics.com/`,
    social: {
      twitter: `raveofphonetics`,
      instagram: `raveofphonetics`,
      facebook: `raveofphonetics`,
    },
  },
  plugins: [
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
            },
          },
          {
            resolve: `gatsby-remark-responsive-iframe`,
            options: {
              wrapperStyle: `margin-bottom: 1.0725rem`,
            },
          },
          `gatsby-remark-prismjs`,
          `gatsby-remark-copy-linked-files`,
          `gatsby-remark-smartypants`,
        ],
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-google-analytics`,
      options: {
        //trackingId: `ADD YOUR TRACKING ID HERE`,
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
  ],
}
