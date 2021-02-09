import { configureStore } from "@reduxjs/toolkit"
import rootReducer from "../reducers"

const createStore = () => {
  return configureStore({
    reducer: rootReducer,
  })
}

export default createStore
