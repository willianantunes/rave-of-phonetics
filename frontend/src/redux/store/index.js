import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit"
import rootReducer from "../reducers"

const createStore = () => {
  return configureStore({
    reducer: rootReducer,
    middleware: getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: [
          "history/loadAllTranscriptionDetails",
          "transcription/setText",
          "transcription/textWasTranscribed",
          "history/addNewTranscriptionDetails",
          "transcription/analysingText",
        ],
        // Ignore these paths in the state
        ignoredPaths: ["history.transcriptions"],
      },
    }),
  })
}

export default createStore
