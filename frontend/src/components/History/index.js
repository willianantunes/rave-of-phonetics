import React, { useEffect } from "react"
import * as S from "./styled"
import { useDispatch, useSelector } from "react-redux"
import {
  addTranscriptionDetails,
  deleteAllTranscriptionHistory,
  loadTranscriptionHistory,
} from "../../redux/slices/history-slice"
import { loadTranscriptionFromDatabase } from "../../redux/slices/transcription-slice"
import { TranscriptionDetails } from "../../domains/TranscriptionDetails"

const columns = [
  { field: "id", headerName: "ID", hide: true },
  {
    field: "text",
    headerName: "Text",
    description: "The text that you transcribed",
    width: 300,
  },
  {
    field: "singleLinePhonemicTranscription",
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
    field: "showStress",
    headerName: "Show stress",
    width: 110,
  },
  {
    field: "showSyllables",
    headerName: "Show syllables",
    width: 110,
  },
  {
    field: "showPunctuations",
    headerName: "Show punctuations",
    width: 110,
  },
  {
    field: "showPhonetic",
    headerName: "Show phonetic",
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
  // -------------------------------
  // Infrastructure
  const dispatch = useDispatch()
  // -------------------------------
  // Redux things
  const { transcriptions } = useSelector(state => state.history)
  const {
    text,
    chosenLanguage,
    showStress,
    showSyllables,
    showPunctuations,
    showPhonetic,
    transcribedResult,
    transcriptionUnsaved,
  } = useSelector(state => state.transcription)
  // Effects
  useEffect(() => {
    if (transcriptionUnsaved) {
      const currentTranscriptionDetails = new TranscriptionDetails(
        null,
        text,
        chosenLanguage,
        showStress,
        showSyllables,
        showPunctuations,
        showPhonetic,
        transcribedResult
      )
      dispatch(addTranscriptionDetails(currentTranscriptionDetails))
    }
  }, [transcriptionUnsaved])
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
          rows={transcriptions}
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
