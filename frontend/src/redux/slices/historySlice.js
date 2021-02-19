import { createSlice } from "@reduxjs/toolkit"
import { deleteAll, findAll, saveOrUpdate } from "../../domains/transcription-details-dao"
import { TranscriptionDetails } from "../../domains/TranscriptionDetails"
import { transcriptionSaved } from "./transcriptionSlice"

const initialState = {
  transcriptions: [],
}

export const historySlice = createSlice({
  name: "history",
  initialState,
  reducers: {
    addNewTranscriptionDetails: (state, action) => {
      state.transcriptions.push(action.payload)
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
  const textConfigurations = await findAll()
  dispatch(loadAllTranscriptionDetails(textConfigurations))
}

export const addTranscriptionDetails = (transcriptionDetails, text, chosenLanguage, withStress) => async dispatch => {
  const listOfPhones = transcriptionDetails.transcription.map(transcriptionWord => transcriptionWord.phone)
  const phones = listOfPhones.reduce((accumulator, currentValue) => accumulator + " " + currentValue)

  const toBePersisted = new TranscriptionDetails(null, text, chosenLanguage, phones, withStress, transcriptionDetails)
  const persistedTranscriptionDetails = await saveOrUpdate(toBePersisted)

  dispatch(addNewTranscriptionDetails(persistedTranscriptionDetails))
  dispatch(transcriptionSaved(phones))
}

export const deleteAllTranscriptionHistory = () => async dispatch => {
  await deleteAll()
  dispatch(eraseTranscriptionDetails())
}
