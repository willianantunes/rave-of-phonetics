import React, { useEffect, useRef, useState } from "react"
import { DataGrid } from "@material-ui/data-grid"
import * as S from "./styled"
import { useDispatch, useSelector } from "react-redux"
import { Button, FormGroup, Typography } from "@material-ui/core"
import { analyseVoices } from "../../redux/slices/textToSpeechSlice"
import { Play, Stop } from "styled-icons/boxicons-regular"
import { WebSpeechAPI } from "../../services/WebSpeechAPI"
import {
  addTranscriptionDetails,
  deleteAllTranscriptionHistory,
  loadAllTranscriptionDetails,
  loadTranscriptionHistory,
} from "../../redux/slices/historySlice"
import { TranscriptionDetails } from "../../domains/TranscriptionDetails"
import { Open } from "styled-icons/ionicons-sharp"
import { Send } from "styled-icons/boxicons-solid"
import CardContent from "@material-ui/core/CardContent"

const columns = [
  { field: "id", headerName: "ID", hide: true },
  {
    field: "text",
    headerName: "Text",
    description: "The text that you transcribed",
    width: 300,
  },
  {
    field: "transcription",
    headerName: "Transcription",
    description: "The IPA transcription from the related text",
    flex: 1,
  },
  {
    field: "language",
    headerName: "Language",
    description: "Which language you used to transcribe, following IETF language tag format",
    width: 100,
  },
  {
    field: "withStress",
    headerName: "With stress",
    description: "An option that allows you to see how is a transcription from a stressed word",
    width: 110,
  },
  {
    field: "createdAt",
    headerName: "Created at",
    type: "dateTime",
    width: 150,
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
    console.log(params.row.id)
  }

  const deleteTableContent = () => {
    if (transcriptions.length > 0) {
      dispatch(deleteAllTranscriptionHistory())
    }
  }

  return (
    <S.MainWrapper>
      <S.Title>Transcription history</S.Title>
      <S.Description>
        Transcribe something to see the result here. Click on some row to retrieve what you transcribed before!
      </S.Description>
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
      <S.OptionsWrapper>
        <S.DeleteAllButton onClick={deleteTableContent}>Delete forever</S.DeleteAllButton>
      </S.OptionsWrapper>
    </S.MainWrapper>
  )
}
