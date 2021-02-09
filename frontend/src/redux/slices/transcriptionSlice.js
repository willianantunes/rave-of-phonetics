import { createSlice } from "@reduxjs/toolkit"
import { transcribeText } from "../../services/raveOfPhoneticsAPI"

const initialState = {
  text: "",
  chosenLanguage: "en-us",
  withStress: false,
  isLoading: false,
  transcribedResult: null,
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
      state.isLoading = true
    },
    textWasTranscribed: {
      reducer(state, action) {
        state.isLoading = false
        state.transcribedResult = action.payload
      },
      prepare(transcriptionEvaluationDetails) {
        return { payload: transcriptionEvaluationDetails.transcription }
      },
    },
  },
})

export const { setChosenLanguage, setText, setWithStress, analysingText, textWasTranscribed } = transcriptionSlice.actions

export default transcriptionSlice.reducer

export const transcriptionFromText = (text, chosenLanguage, withStress) => async dispatch => {
  dispatch(analysingText())
  const result = await transcribeText(text, chosenLanguage, withStress)
  dispatch(textWasTranscribed(result))
}
