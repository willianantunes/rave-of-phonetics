import { combineReducers } from "@reduxjs/toolkit"
import textToSpeechReducer from "../slices/textToSpeechSlice"
import transcriptionReducer from "../slices/transcriptionSlice"
import historyReducer from "../slices/historySlice"
import messageBoardReducer from "../slices/messageBoardSlice"

export default combineReducers({
  textToSpeech: textToSpeechReducer,
  transcription: transcriptionReducer,
  history: historyReducer,
  messageBoard: messageBoardReducer,
})
