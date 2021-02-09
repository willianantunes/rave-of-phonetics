import { createSlice } from "@reduxjs/toolkit"

const counterSlice = createSlice({
  name: "counter",
  initialState: { count: 0 },
  reducers: {
    increment: state => {
      state.count++
    },
    decrement: state => {
      state.count--
    },
  },
})

export default counterSlice.reducer

export const { decrement, increment } = counterSlice.actions
