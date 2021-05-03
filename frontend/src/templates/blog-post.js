import React, { createRef, useEffect } from "react"
import SEO from "../components/SEO"
import { Link } from "gatsby-theme-material-ui"
import { graphql } from "gatsby"
import Layout from "../components/Layout"
import BlogPost from "../components/BlogPost"
import { useSiteMetadata } from "../hooks/use-site-metadata"
import CommentSection from "../components/CommentSection"

const BlogPostTemplate = ({ data }) => {
  const { siteUrl } = useSiteMetadata()
  const commentSectionRef = createRef()

  const post = data.markdownRemark
  const description = post.frontmatter.description || post.excerpt
  const date = post.frontmatter.date
  const formattedDate = post.frontmatter.formattedDate
  const title = post.frontmatter.title
  const identifier = post.frontmatter.id
  const tags = post.frontmatter.tags
  const content = post.html
  const timeToRead = post.timeToRead
  const image = `${siteUrl}${post.frontmatter.cover.publicURL}`
  const { previous, next } = data

  useEffect(() => {
    const commentScript = document.createElement("script")
    // TODO: When the user changes theme, this should be updated too
    // const theme = typeof window !== "undefined" && isCurrentThemeDark() ? "github-dark" : "github-light"
    const theme = "github-light"
    commentScript.async = true
    commentScript.src = "https://utteranc.es/client.js"
    // TODO: Use ENV variables for it
    commentScript.setAttribute("repo", "raveofphonetics/comments")
    commentScript.setAttribute("issue-term", "pathname")
    commentScript.setAttribute("id", "utterances")
    commentScript.setAttribute("theme", theme)
    commentScript.setAttribute("crossorigin", "anonymous")
    if (commentSectionRef && commentSectionRef.current) {
      commentSectionRef.current.appendChild(commentScript)
    } else {
      console.log(`Error adding utterances comments on: ${commentSectionRef}`)
    }
  }, [])

  return (
    <Layout blog={true}>
      <SEO title={title} description={description} image={image} keywords={tags} />
      <BlogPost
        title={title}
        date={date}
        formattedDate={formattedDate}
        content={content}
        timeToRead={timeToRead}
        tags={tags}
        image={image}
      />

      {(previous || next) && (
        <nav className="blog-post-nav">
          <ul
            style={{
              display: `flex`,
              flexWrap: `wrap`,
              justifyContent: `space-between`,
              listStyle: `none`,
              padding: 0,
            }}
          >
            <li>
              {previous && (
                <Link to={previous.fields.path} rel="prev">
                  ← {previous.frontmatter.title}
                </Link>
              )}
            </li>
            <li>
              {next && (
                <Link to={next.fields.path} rel="next">
                  {next.frontmatter.title} →
                </Link>
              )}
            </li>
          </ul>
        </nav>
      )}
      <CommentSection reactRef={commentSectionRef} />
    </Layout>
  )
}

export default BlogPostTemplate

export const pageQuery = graphql`
  query BlogPostBySlug($id: String!, $previousPostId: String, $nextPostId: String) {
    markdownRemark(id: { eq: $id }) {
      id
      excerpt(pruneLength: 160)
      html
      timeToRead
      frontmatter {
        title
        formattedDate: date(formatString: "MMMM DD, YYYY")
        date
        description
        tags
        id
        cover {
          id
          publicURL
          childImageSharp {
            fluid(maxWidth: 1280, quality: 60) {
              ...GatsbyImageSharpFluid
            }
          }
        }
      }
    }
    previous: markdownRemark(id: { eq: $previousPostId }) {
      fields {
        path
      }
      frontmatter {
        title
      }
    }
    next: markdownRemark(id: { eq: $nextPostId }) {
      fields {
        path
      }
      frontmatter {
        title
      }
    }
  }
`
