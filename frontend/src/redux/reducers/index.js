import { combineReducers } from "@reduxjs/toolkit"
import counterReducer from "../slices/counterSlice"
import textToSpeechReducer from "../slices/textToSpeechSlice"
import transcriptionReducer from "../slices/transcriptionSlice"

export default combineReducers({
  counter: counterReducer,
  textToSpeech: textToSpeechReducer,
  transcription: transcriptionReducer,
})
