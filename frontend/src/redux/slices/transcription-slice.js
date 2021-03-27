import { createSlice } from "@reduxjs/toolkit"
import { transcribe } from "../../services/rop-api"
import { findById } from "../../domains/transcription-details-dao"

const initialState = {
  text: "",
  chosenLanguage: "en-us",
  showStress: false,
  showSyllables: false,
  showPunctuations: false,
  showPhonetic: false,
  isLoading: false,
  transcribedResult: null,
  isError: false,
  transcriptionUnsaved: false,
  // This is used to copy the transcription result
  phones: "Have you tried to transcribe something first?",
  // So this can be used let's say in UseEffect
  counterOfLoadedTranscription: 0,
}

export const transcriptionSlice = createSlice({
  name: "transcription",
  initialState,
  reducers: {
    setText: (state, action) => {
      state.text = action.payload
    },
    setChosenLanguage: (state, action) => {
      state.chosenLanguage = action.payload
    },
    setShowStress: (state, action) => {
      state.showStress = action.payload
    },
    setShowSyllables: (state, action) => {
      state.showSyllables = action.payload
    },
    setShowPunctuations: (state, action) => {
      state.showPunctuations = action.payload
    },
    setShowPhonetic: (state, action) => {
      state.showPhonetic = action.payload
    },
    analysingText: state => {
      state.isError = false
      state.isLoading = true
      state.transcribedResult = null
    },
    textWasTranscribed: (state, action) => {
      state.isLoading = false
      state.transcribedResult = action.payload
    },
    errorCaughtDuringTranscription: (state, action) => {
      state.isLoading = false
      state.isError = true
      state.transcribedResult = null
    },
    loadedTranscription: (state, action) => {
      const {
        text,
        chosenLanguage,
        showStress,
        showSyllables,
        showPunctuations,
        showPhonetic,
        transcribedResult,
      } = action.payload
      state.text = text
      state.chosenLanguage = chosenLanguage
      state.showStress = showStress
      state.showSyllables = showSyllables
      state.showPunctuations = showPunctuations
      state.showPhonetic = showPhonetic
      state.transcribedResult = transcribedResult
      state.counterOfLoadedTranscription++
    },
    transcriptionSaved: (state, action) => {
      state.transcriptionUnsaved = false
      state.phones = action.payload
    },
    transcriptionToBeSaved: state => {
      state.transcriptionUnsaved = true
    },
    setPhones: (state, action) => {
      state.phones = action.payload
    },
  },
})

export const {
  setChosenLanguage,
  setText,
  setShowStress,
  setShowSyllables,
  setShowPunctuations,
  setShowPhonetic,
  analysingText,
  textWasTranscribed,
  errorCaughtDuringTranscription,
  loadedTranscription,
  transcriptionSaved,
  transcriptionToBeSaved,
  setPhones,
} = transcriptionSlice.actions

export default transcriptionSlice.reducer

export const transcriptionFromText = (text, chosenLanguage, token, hookWhenError) => async dispatch => {
  dispatch(analysingText())

  try {
    const result = await transcribe(text, chosenLanguage, token)
    dispatch(textWasTranscribed(result))
    dispatch(transcriptionToBeSaved())
  } catch (e) {
    // TODO: Deal with many different errors instead of doing this
    dispatch(errorCaughtDuringTranscription())
    if (hookWhenError) hookWhenError()
  }
}

export const loadTranscriptionFromDatabase = id => async dispatch => {
  const persistedTranscriptionDetails = await findById(id)
  const payload = {
    text: persistedTranscriptionDetails.text,
    chosenLanguage: persistedTranscriptionDetails.language,
    showStress: persistedTranscriptionDetails.showStress,
    showSyllables: persistedTranscriptionDetails.showSyllables,
    showPunctuations: persistedTranscriptionDetails.showPunctuations,
    showPhonetic: persistedTranscriptionDetails.showPhonetic,
    transcribedResult: persistedTranscriptionDetails.transcriptionSetup,
  }
  dispatch(loadedTranscription(payload))
  const phones = persistedTranscriptionDetails.singleLineTranscription
  dispatch(setPhones(phones))
}
