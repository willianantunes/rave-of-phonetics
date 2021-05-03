import React from "react"
import Layout from "../components/Layout"
import SEO from "../components/SEO"
import { FrequentlyAskedQuestions } from "../components/FrequentlyAskedQuestions"

const RavePage = () => {
  const title = "FAQ"
  const description = "Know how to use our site and discover many other things! You can post any doubt you have too."

  return (
    <Layout>
      <SEO title={title} description={description} />
      <FrequentlyAskedQuestions />
    </Layout>
  )
}

export default RavePage
