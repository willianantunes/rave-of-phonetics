import React, { useEffect, useRef, useState } from "react"
import { DataGrid } from "@material-ui/data-grid"
import * as S from "./styled"
import { useDispatch, useSelector } from "react-redux"
import { Typography } from "@material-ui/core"
import { analyseVoices } from "../../redux/slices/textToSpeechSlice"
import { Play, Stop } from "styled-icons/boxicons-regular"
import { WebSpeechAPI } from "../../services/WebSpeechAPI"
import { addTranscriptionDetails, loadAllTranscriptionDetails, loadTranscriptionHistory } from "../../redux/slices/historySlice"
import { TranscriptionDetails } from "../../domains/TranscriptionDetails"

const columns = [
  { field: "id", headerName: "ID", hide: true },
  {
    field: "text",
    headerName: "Text",
    description: "The text that you transcribed",
    flex: 1,
  },
  {
    field: "transcription",
    headerName: "Transcription",
    description: "The IPA transcription from the related text",
    flex: 0.4,
  },
  {
    field: "language",
    headerName: "Language",
    description: "Which language you used to transcribe, following IETF language tag format",
    flex: 0.4,
  },
  {
    field: "withStress",
    headerName: "With stress",
    description: "An option that allows you to see how is a transcription from a stressed word",
    flex: 0.4,
  },
  {
    field: "createdAt",
    headerName: "Created at",
    type: "dateTime",
    flex: 1,
  },
]

export default function History() {
  // Infrastructure
  const dispatch = useDispatch()
  // States
  const [rows, setRows] = useState([])
  // Redux things
  const { transcriptions } = useSelector(state => state.history)
  const { text, transcribedResult, chosenLanguage, withStress } = useSelector(state => state.transcription)
  // Effects
  useEffect(() => {
    if (transcribedResult) {
      dispatch(addTranscriptionDetails(transcribedResult.transcription, text, chosenLanguage, withStress))
    }
  }, transcribedResult)
  useEffect(() => {
    const rows = transcriptions.map(transcriptionDetails => {
      return {
        id: transcriptionDetails.id,
        text: transcriptionDetails.text,
        transcription: transcriptionDetails.transcription,
        language: transcriptionDetails.language,
        withStress: transcriptionDetails.withStress,
        createdAt: transcriptionDetails.createdAt,
      }
    })
    setRows(rows)
  }, [transcriptions])
  useEffect(() => {
    dispatch(loadTranscriptionHistory())
  }, [])

  const handleRowClick = params => {
    alert(params.row.id)
  }

  return (
    <S.MainWrapper>
      <S.Title component="h2" variant="h5" align="center">
        Transcription history
      </S.Title>
      <S.DataGridWrapper>
        <S.CustomDataGrid
          components={{
            NoRowsOverlay: S.GridOverlayIconEmptyBox("Try to transcribe first!"),
          }}
          rows={rows}
          columns={columns}
          pageSize={5}
          onRowClick={handleRowClick}
        />
      </S.DataGridWrapper>
    </S.MainWrapper>
  )
}
