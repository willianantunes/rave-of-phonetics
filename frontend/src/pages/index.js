import React, { createRef, useEffect } from "react"
import Layout from "../components/Layout"
import SEO from "../components/SEO"
import MainTools from "../components/MainTools"
import CommentSection from "../components/CommentSection"

const IndexPage = () => {
  const title = "Home"
  const commentSectionRef = createRef()

  return (
    <Layout>
      <SEO title={title} />
      <MainTools />
      <CommentSection reactRef={commentSectionRef} />
    </Layout>
  )
}

export default IndexPage
