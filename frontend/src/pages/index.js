import React from "react"
import Layout from "../components/Layout"
import SEO from "../components/SEO"
import DisqusWrapper from "../components/DisqusWrapper"
import MainTools from "../components/MainTools"

const IndexPage = () => {
  const title = "Home"
  const identifier = "127a9e01-c6d1-435c-a88a-e4621539ad41"

  return (
    <Layout>
      <SEO title={title} />
      <MainTools />
      <DisqusWrapper identifier={identifier} title={title} />
    </Layout>
  )
}

export default IndexPage
