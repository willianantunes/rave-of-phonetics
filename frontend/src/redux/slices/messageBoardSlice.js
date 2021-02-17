import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  open: false,
  message: "",
}

export const messageBoardSlice = createSlice({
  name: "messageBoard",
  initialState,
  reducers: {
    toggleMessage: (state, action) => {
      state.open = !state.open
      state.message = action.payload
    },
  },
})

export const { toggleMessage } = messageBoardSlice.actions

export default messageBoardSlice.reducer
