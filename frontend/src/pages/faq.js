import React, { createRef, useEffect } from "react"
import Layout from "../components/Layout"
import SEO from "../components/SEO"
import { FrequentlyAskedQuestions } from "../components/FrequentlyAskedQuestions"
import CommentSection from "../components/CommentSection"

const RavePage = () => {
  const title = "FAQ"
  const description = "Know how to use our site and discover many other things! You can post any doubt you have too."
  const commentSectionRef = createRef()

  return (
    <Layout>
      <SEO title={title} description={description} />
      <FrequentlyAskedQuestions />
      <CommentSection reactRef={commentSectionRef} />
    </Layout>
  )
}

export default RavePage
