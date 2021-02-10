import { combineReducers } from "@reduxjs/toolkit"
import textToSpeechReducer from "../slices/textToSpeechSlice"
import transcriptionReducer from "../slices/transcriptionSlice"
import historyReducer from "../slices/historySlice"

export default combineReducers({
  textToSpeech: textToSpeechReducer,
  transcription: transcriptionReducer,
  history: historyReducer,
})
