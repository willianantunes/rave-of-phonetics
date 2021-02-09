import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  text: "",
  chosenLanguage: "en-us",
  withStress: false,
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
  },
})

export const { setChosenLanguage, setText, setWithStress } = transcriptionSlice.actions

export default transcriptionSlice.reducer
