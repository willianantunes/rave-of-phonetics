import React from "react"
import SEO from "../components/SEO"
import { Link } from "gatsby-theme-material-ui"
import { graphql } from "gatsby"
import Layout from "../components/Layout"
import BlogPost from "../components/BlogPost"

const BlogPostTemplate = ({ data }) => {
  const post = data.markdownRemark
  const description = post.frontmatter.description || post.excerpt
  const date = post.frontmatter.date
  const formattedDate = post.frontmatter.formattedDate
  const title = post.frontmatter.title
  const content = post.html
  const { previous, next } = data

  return (
    <Layout blog={true}>
      <SEO title={title} description={description} />
      <BlogPost title={title} date={date} formattedDate={formattedDate} content={content} />

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
    </Layout>
  )
}

export default BlogPostTemplate

export const pageQuery = graphql`
  query BlogPostBySlug($id: String!, $previousPostId: String, $nextPostId: String) {
    site {
      siteMetadata {
        title
      }
    }
    markdownRemark(id: { eq: $id }) {
      id
      excerpt(pruneLength: 160)
      html
      frontmatter {
        title
        formattedDate: date(formatString: "MMMM DD, YYYY")
        date
        description
        tags
        id
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
