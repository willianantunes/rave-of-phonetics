const path = require(`path`)
const { createFilePath } = require(`gatsby-source-filesystem`)

function extractsTitleFromPostLocation(location) {
  const regex = /\/[0-9]+\/[0-9]+\/(.+)\//
  const [fullMatch, firstGroup] = location.match(regex)
  return firstGroup
}

exports.createPages = async ({ graphql, actions, reporter }) => {
  // https://www.gatsbyjs.com/docs/reference/config-files/actions/#createPage
  const { createPage } = actions

  // Define a template for blog post
  const blogPost = path.resolve(`./src/templates/blog-post.js`)

  // Get all markdown blog posts sorted by date
  const result = await graphql(
    `
      {
        allMarkdownRemark(sort: { fields: [frontmatter___date], order: ASC }, limit: 1000) {
          nodes {
            id
            fields {
              slug
              path
            }
          }
        }
      }
    `
  )

  if (result.errors) {
    reporter.panicOnBuild(`There was an error loading your blog posts`, result.errors)
    return
  }

  const posts = result.data.allMarkdownRemark.nodes

  // Create blog posts pages
  // But only if there's at least one markdown file found at "content/blog" (defined in gatsby-config.js)
  // `context` is available in the template as a prop and as a variable in GraphQL

  if (posts.length > 0) {
    posts.forEach((post, index) => {
      const previousPostId = index === 0 ? null : posts[index - 1].id
      const nextPostId = index === posts.length - 1 ? null : posts[index + 1].id

      const { path } = post.fields

      createPage({
        path: path,
        component: blogPost,
        context: {
          id: post.id,
          previousPostId,
          nextPostId,
        },
      })
    })
  }
}

exports.onCreateNode = ({ node, actions, getNode }) => {
  // https://www.gatsbyjs.com/docs/reference/config-files/actions/#createNodeField
  const { createNodeField } = actions

  if (node.internal.type === `MarkdownRemark`) {
    const value = createFilePath({ node, getNode })
    const markdownFileName = extractsTitleFromPostLocation(value)
    const yearAndMonth = markdownFileName.slice(0, 10).replace("-", "/").split("-")[0]
    const sluggedTitleWithoutTheDatePart = markdownFileName.slice(11)
    const path = `/blog/${yearAndMonth}/${sluggedTitleWithoutTheDatePart}/`

    createNodeField({
      name: `slug`,
      node,
      value: markdownFileName,
    })
    createNodeField({
      name: `path`,
      node,
      value: path,
    })
  }
}

exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions

  // Explicitly define the siteMetadata {} object
  // This way those will always be defined even if removed from gatsby-config.js

  // Also explicitly define the Markdown frontmatter
  // This way the "MarkdownRemark" queries will return `null` even when no
  // blog posts are stored inside "content/blog" instead of returning an error
  createTypes(`
    type SiteSiteMetadata {
      author: Author
      siteUrl: String
      social: Social
    }

    type Author {
      name: String
      summary: String
    }

    type Social {
      twitter: String
    }

    type MarkdownRemark implements Node {
      frontmatter: Frontmatter
      fields: Fields
    }

    type Frontmatter {
      title: String
      description: String
      date: Date @dateformat
    }

    type Fields {
      slug: String
    }
  `)
}
