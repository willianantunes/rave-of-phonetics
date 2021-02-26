import { useStaticQuery, graphql } from "gatsby"

/**
 * https://css-tricks.com/how-to-the-get-current-page-url-in-gatsby/
 */
export function useSiteMetadata() {
  const { site } = useStaticQuery(
    graphql`
      query {
        site {
          siteMetadata {
            title
            description
            keywords
            social {
              twitter
              instagram
              facebook
            }
            siteUrl
            author {
              name
            }
          }
        }
      }
    `
  )
  return site.siteMetadata
}
