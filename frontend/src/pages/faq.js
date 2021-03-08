import React from "react"
import Layout from "../components/Layout"
import SEO from "../components/SEO"
import DisqusWrapper from "../components/DisqusWrapper"
import { FrequentlyAskedQuestions } from "../components/FrequentlyAskedQuestions"

const RavePage = () => {
  const title = "FAQ"
  const description = "Know how to use our site and discover many other things! You can post any doubt you have too."
  const identifier = "dc1c023a-1588-40b4-8cf6-30d6aa2d7273"

  return (
    <Layout>
      <SEO title={title} description={description} />
      <FrequentlyAskedQuestions />
      <DisqusWrapper identifier={identifier} title={title} />
    </Layout>
  )
}

export default RavePage
