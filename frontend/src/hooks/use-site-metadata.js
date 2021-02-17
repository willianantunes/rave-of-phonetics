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
            social {
              twitter
              instagram
              facebook
            }
            siteURL
            author {
              name
              summary
            }
          }
        }
      }
    `
  )
  return site.siteMetadata
}
