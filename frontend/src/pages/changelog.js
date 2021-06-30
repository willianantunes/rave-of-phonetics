import React, { createRef, useEffect } from "react"
import Layout from "../components/Layout"
import SEO from "../components/SEO"
import { Features } from "../components/Features"
import CommentSection from "../components/CommentSection"

const RavePage = () => {
  const title = "Changelog"
  const commentSectionRef = createRef()

  return (
    <Layout>
      <SEO title={title} />
      <Features />
      <CommentSection reactRef={commentSectionRef} />
    </Layout>
  )
}

export default RavePage
