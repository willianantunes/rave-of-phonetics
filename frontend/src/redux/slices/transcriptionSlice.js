import { createSlice } from "@reduxjs/toolkit"
import { transcribeText } from "../../services/raveOfPhoneticsAPI"

const initialState = {
  text: "",
  chosenLanguage: "en-us",
  withStress: false,
  isLoading: false,
  transcribedResult: null,
  isError: false,
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
  },
})

export const {
  setChosenLanguage,
  setText,
  setWithStress,
  analysingText,
  textWasTranscribed,
  errorCaughtDuringTranscription,
} = transcriptionSlice.actions

export default transcriptionSlice.reducer

export const transcriptionFromText = (text, chosenLanguage, withStress) => async dispatch => {
  dispatch(analysingText())

  try {
    const result = await transcribeText(text, chosenLanguage, withStress)
    dispatch(textWasTranscribed(result))
  } catch (e) {
    // TODO: Deal with many different errors instead of doing this
    dispatch(errorCaughtDuringTranscription())
  }
}
