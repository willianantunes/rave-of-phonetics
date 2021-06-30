import { createSlice } from "@reduxjs/toolkit"
import { deleteAll, findAll, saveOrUpdate } from "../../domains/transcription-details-dao"
import { transcriptionSaved } from "./transcription-slice"

const initialState = {
  transcriptions: [],
}

export const historySlice = createSlice({
  name: "history",
  initialState,
  reducers: {
    addNewTranscriptionDetails: (state, action) => {
      state.transcriptions.unshift(action.payload)
    },
    loadAllTranscriptionDetails: (state, action) => {
      state.transcriptions = action.payload
    },
    eraseTranscriptionDetails: state => {
      state.transcriptions.length = 0
    },
  },
})

export const { addNewTranscriptionDetails, loadAllTranscriptionDetails, eraseTranscriptionDetails } = historySlice.actions

export default historySlice.reducer

export const loadTranscriptionHistory = () => async dispatch => {
  // TODO: Actually use OrderBy instead of reverting
  const transcriptions = await findAll()
  const transcriptionsAsObjects = transcriptions.map(entry =>
    entry.convertToObject({
      withSingleLineTranscription: true,
      withRefreshedTranscription: true,
    })
  )
  const reversedTranscriptionsAsObjects = transcriptionsAsObjects.reverse()

  dispatch(loadAllTranscriptionDetails(reversedTranscriptionsAsObjects))
}

export const addTranscriptionDetails = transcriptionDetails => async dispatch => {
  const toBePersisted = transcriptionDetails.convertToObject()
  const persistedTranscriptionDetails = await saveOrUpdate(toBePersisted)
  const transcriptionAsPlainObject = persistedTranscriptionDetails.convertToObject({
    withSingleLineTranscription: true,
    withRefreshedTranscription: true,
  })

  dispatch(addNewTranscriptionDetails(transcriptionAsPlainObject))
  dispatch(transcriptionSaved(transcriptionAsPlainObject))
}

export const deleteAllTranscriptionHistory = () => async dispatch => {
  await deleteAll()
  dispatch(eraseTranscriptionDetails())
}
