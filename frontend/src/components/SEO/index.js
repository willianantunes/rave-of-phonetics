import React from "react"
import PropTypes from "prop-types"
import { Helmet } from "react-helmet"
import { useSiteMetadata } from "../../hooks/use-site-metadata"

const SEO = ({ description, meta, title, siteUrl, image }) => {
  const siteMetadata = useSiteMetadata()

  const openGraphImage = image || "https://felipefialho.com/assets/og-image.jpg"
  const htmlAttributes = { lang: `en` }
  const descriptionToBeUsed = description || siteMetadata.description
  const defaultTitle = siteMetadata.title
  const { twitterLink } = siteMetadata.social

  return (
    <Helmet
      htmlAttributes={htmlAttributes}
      title={title}
      titleTemplate={defaultTitle ? `%s | ${defaultTitle}` : null}
      meta={[
        {
          name: `description`,
          content: descriptionToBeUsed,
        },
        {
          property: `og:image`,
          content: openGraphImage,
        },
        {
          property: `og:type`,
          content: `website`,
        },
        {
          property: `og:url`,
          content: siteUrl,
        },
        {
          property: `og:title`,
          content: title,
        },
        {
          property: `og:description`,
          content: descriptionToBeUsed,
        },
        {
          name: `twitter:card`,
          content: `summary`,
        },
        {
          name: `twitter:site`,
          content: twitterLink,
        },
      ].concat(meta)}
    />
  )
}

SEO.defaultProps = {
  lang: `en`,
  meta: [],
}

SEO.propTypes = {
  description: PropTypes.string,
  meta: PropTypes.arrayOf(PropTypes.object),
  title: PropTypes.string.isRequired,
  siteUrl: PropTypes.string,
  image: PropTypes.string,
}

export default SEO
