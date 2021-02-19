import React from "react"
import Layout from "../components/Layout"
import SEO from "../components/SEO"
import Transcription from "../components/Transcription"
import TextToSpeech from "../components/TextToSpeech"
import History from "../components/History"
import DisqusWrapper from "../components/DisqusWrapper"

const RavePage = () => {
  const title = "Home"
  const identifier = "127a9e01-c6d1-435c-a88a-e4621539ad41"

  return (
    <Layout>
      <SEO title={title} />
      <Transcription />
      <TextToSpeech />
      <History />
      <DisqusWrapper identifier={identifier} title={title} />
    </Layout>
  )
}

export default RavePage
