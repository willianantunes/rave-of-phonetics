import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit"
import rootReducer from "../reducers"
import { REDUX_DEVELOPER_TOOLS } from "../../config/settings"

const createStore = () => {
  return configureStore({
    devTools: REDUX_DEVELOPER_TOOLS,
    reducer: rootReducer,
    middleware: getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: [
          "history/loadAllTranscriptionDetails",
          "transcription/setText",
          "transcription/textWasTranscribed",
          "transcription/transcriptionSaved",
          "history/addNewTranscriptionDetails",
          "transcription/analysingText",
          "transcription/setShowStress",
          "transcription/setTranscriptionDetails",
          "transcription/transcriptionToBeSaved",
          "transcription/setPhones",
          "textToSpeech/receivedVoicesWereAnalysed",
          "textToSpeech/analysingReceivedVoices",
        ],
        // Ignore these paths in the state
        ignoredPaths: ["history.transcriptions"],
      },
    }),
  })
}

export default createStore
