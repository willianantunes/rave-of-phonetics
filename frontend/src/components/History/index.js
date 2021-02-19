import React, { useEffect, useState } from "react"
import * as S from "./styled"
import { useDispatch, useSelector } from "react-redux"
import {
  addTranscriptionDetails,
  deleteAllTranscriptionHistory,
  loadTranscriptionHistory,
} from "../../redux/slices/historySlice"
import { loadTranscriptionFromDatabase } from "../../redux/slices/transcriptionSlice"

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
    width: 180,
  },
]

export default function History() {
  // Infrastructure
  const dispatch = useDispatch()
  // States
  const [rows, setRows] = useState([])
  // Redux things
  const { transcriptions } = useSelector(state => state.history)
  const { text, transcribedResult, chosenLanguage, withStress, transcriptionUnsaved } = useSelector(
    state => state.transcription
  )
  // Effects
  useEffect(() => {
    if (transcriptionUnsaved) {
      dispatch(addTranscriptionDetails(transcribedResult, text, chosenLanguage, withStress))
    }
  }, [transcriptionUnsaved])
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
  // Actions
  const deleteTableContent = () => {
    if (transcriptions.length > 0) {
      dispatch(deleteAllTranscriptionHistory())
    }
  }
  const handleRowClick = params => {
    dispatch(loadTranscriptionFromDatabase(params.row.id))
    window.scroll({ top: 0, left: 0, behavior: "smooth" })
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
          autoHeight={true}
        />
      </S.DataGridWrapper>
      <S.OptionsWrapper>
        <S.DeleteAllButton onClick={deleteTableContent}>Delete forever</S.DeleteAllButton>
      </S.OptionsWrapper>
    </S.MainWrapper>
  )
}
