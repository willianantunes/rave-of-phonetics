import { createSlice } from "@reduxjs/toolkit"
import { transcribeText } from "../../services/raveOfPhoneticsAPI"
import { findById } from "../../domains/transcriptionDetailsDao"

const initialState = {
  text: "",
  chosenLanguage: "en-us",
  withStress: false,
  isLoading: false,
  transcribedResult: null,
  isError: false,
  transcriptionUnsaved: false,
  phones: "Have you tried to transcribe something first?",
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
    setWithStress: (state, action) => {
      state.withStress = action.payload
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
      const { text, withStress, chosenLanguage, transcribedResult } = action.payload
      state.text = text
      state.withStress = withStress
      state.chosenLanguage = chosenLanguage
      state.transcribedResult = transcribedResult
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
  setWithStress,
  analysingText,
  textWasTranscribed,
  errorCaughtDuringTranscription,
  loadedTranscription,
  transcriptionSaved,
  transcriptionToBeSaved,
  setPhones,
} = transcriptionSlice.actions

export default transcriptionSlice.reducer

export const transcriptionFromText = (text, chosenLanguage, withStress) => async dispatch => {
  dispatch(analysingText())

  try {
    const result = await transcribeText(text, chosenLanguage, withStress)
    dispatch(textWasTranscribed(result))
    dispatch(transcriptionToBeSaved())
  } catch (e) {
    // TODO: Deal with many different errors instead of doing this
    dispatch(errorCaughtDuringTranscription())
  }
}

export const loadTranscriptionFromDatabase = id => async dispatch => {
  const persistedTranscriptionDetails = await findById(id)
  const payload = {
    text: persistedTranscriptionDetails.text,
    withStress: persistedTranscriptionDetails.withStress,
    chosenLanguage: persistedTranscriptionDetails.language,
    transcribedResult: persistedTranscriptionDetails.transcriptionSetup,
  }
  dispatch(loadedTranscription(payload))
  const transcription = persistedTranscriptionDetails.transcriptionSetup.transcription
  const listOfPhones = transcription.map(transcriptionWord => transcriptionWord.phone)
  const phones = listOfPhones.reduce((accumulator, currentValue) => accumulator + " " + currentValue)
  dispatch(setPhones(phones))
}
