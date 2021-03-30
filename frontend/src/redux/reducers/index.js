import { combineReducers } from "@reduxjs/toolkit"
import textToSpeechReducer from "../slices/textToSpeechSlice"
import transcriptionReducer from "../slices/transcription-slice"
import historyReducer from "../slices/history-slice"
import messageBoardReducer from "../slices/messageBoardSlice"

export default combineReducers({
  textToSpeech: textToSpeechReducer,
  transcription: transcriptionReducer,
  history: historyReducer,
  messageBoard: messageBoardReducer,
})
