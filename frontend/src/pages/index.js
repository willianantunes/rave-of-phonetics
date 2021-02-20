import React from "react"
import Layout from "../components/Layout"
import SEO from "../components/SEO"
import Transcription from "../components/Transcription"
import TextToSpeech from "../components/TextToSpeech"
import History from "../components/History"
import DisqusWrapper from "../components/DisqusWrapper"
import styled from "styled-components"
import { Box } from "@material-ui/core"

export const ToolsWrapper = styled(Box).attrs({ component: "section" })`
  display: flex;
  flex-wrap: wrap;
  gap: 25px;

  & .MuiCard-root {
    margin-top: 0;
  }

  & .MuiCardContent-root {
    display: flex;
    flex-direction: column;
    height: 100%;
  }
`

const RavePage = () => {
  const title = "Home"
  const identifier = "127a9e01-c6d1-435c-a88a-e4621539ad41"

  return (
    <Layout>
      <SEO title={title} />
      <ToolsWrapper>
        <Transcription />
        <TextToSpeech />
      </ToolsWrapper>
      <History />
      <DisqusWrapper identifier={identifier} title={title} />
    </Layout>
  )
}

export default RavePage
