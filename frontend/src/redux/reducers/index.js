import { combineReducers } from "@reduxjs/toolkit"
import textToSpeechReducer from "../slices/textToSpeechSlice"
import transcriptionReducer from "../slices/transcriptionSlice"

export default combineReducers({
  textToSpeech: textToSpeechReducer,
  transcription: transcriptionReducer,
})
