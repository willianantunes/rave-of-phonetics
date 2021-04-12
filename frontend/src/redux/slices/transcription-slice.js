import { createSlice } from "@reduxjs/toolkit"
import { transcribe } from "../../services/rop-api"
import { findById } from "../../domains/transcription-details-dao"
import { extractTokensFromText } from "../../utils/tokenization"

const initialState = {
  text: "",
  chosenLanguage: "en-us",
  showStress: false,
  showSyllables: false,
  showPunctuations: false,
  showPhonetic: false,
  isLoading: false,
  transcribedResult: null,
  transcriptionDetails: null,
  isError: false,
  transcriptionUnsaved: false,
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
    setTranscriptionDetails: (state, action) => {
      state.transcriptionDetails = action.payload
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
      const transcriptionDetailsAsPlainObject = action.payload
      state.text = transcriptionDetailsAsPlainObject.text
      state.chosenLanguage = transcriptionDetailsAsPlainObject.language
      state.showStress = transcriptionDetailsAsPlainObject.showStress
      state.showSyllables = transcriptionDetailsAsPlainObject.showSyllables
      state.showPunctuations = transcriptionDetailsAsPlainObject.showPunctuations
      state.showPhonetic = transcriptionDetailsAsPlainObject.showPhonetic
      state.transcribedResult = transcriptionDetailsAsPlainObject.refreshedTranscriptionSetup
      state.transcriptionDetails = transcriptionDetailsAsPlainObject
      state.counterOfLoadedTranscription++
    },
    transcriptionSaved: (state, action) => {
      state.transcriptionUnsaved = false
      state.transcriptionDetails = action.payload
    },
    transcriptionToBeSaved: state => {
      state.transcriptionUnsaved = true
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
  setTranscriptionDetails,
  analysingText,
  textWasTranscribed,
  errorCaughtDuringTranscription,
  loadedTranscription,
  transcriptionSaved,
  transcriptionToBeSaved,
} = transcriptionSlice.actions

export default transcriptionSlice.reducer

export const transcriptionFromText = (text, chosenLanguage, token, hookWhenError) => async dispatch => {
  dispatch(analysingText())

  try {
    const words = extractTokensFromText(text)
    const result = await transcribe(words, chosenLanguage, token)
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
  const transcriptionAsPlainObject = persistedTranscriptionDetails.convertToObject(true, true)

  dispatch(loadedTranscription(transcriptionAsPlainObject))
}
