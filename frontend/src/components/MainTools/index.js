import React from "react"
import * as S from "./styled"
import Transcription from "../Transcription"
import TextToSpeech from "../TextToSpeech"
import History from "../History"

export default function MainTools() {
  return (
    <>
      <S.ToolsWrapper>
        <Transcription />
        <TextToSpeech />
      </S.ToolsWrapper>
      <History />
    </>
  )
}
