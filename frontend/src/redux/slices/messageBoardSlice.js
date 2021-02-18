import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  open: false,
  message: "",
}

export const messageBoardSlice = createSlice({
  name: "messageBoard",
  initialState,
  reducers: {
    showMessage: (state, action) => {
      state.open = true
      state.message = action.payload
    },
    closeMessage: state => {
      state.open = false
    },
  },
})

export const { showMessage, closeMessage } = messageBoardSlice.actions

export default messageBoardSlice.reducer
