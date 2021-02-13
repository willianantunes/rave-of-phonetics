import React from "react"
import Layout from "../components/Layout"
import SEO from "../components/seo"
import { Features } from "../components/Features"
import DisqusWrapper from "../components/DisqusWrapper"

const RavePage = () => {
  const title = "Changelog"
  const identifier = "40356a0f-4c6e-457e-98f3-08754ce4923c"

  return (
    <Layout>
      <SEO title={title} />
      <Features />
      <DisqusWrapper identifier={identifier} title={title} />
    </Layout>
  )
}

export default RavePage
