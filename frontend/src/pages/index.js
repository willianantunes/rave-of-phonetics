import React from "react"
import Layout from "../components/Layout"
import SEO from "../components/seo"
import Transcription from "../components/Transcription"
import TextToSpeech from "../components/TextToSpeech"
import History from "../components/History"

const RavePage = () => {
  return (
    <Layout>
      <SEO title="Home" />
      <Transcription />
      <TextToSpeech />
      <History />
    </Layout>
  )
}

export default RavePage
