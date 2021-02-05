import thunkMiddleware from "redux-thunk"
import rootReducer from "../reducers"
import { createStore as reduxCreateStore, applyMiddleware } from "redux"
import { composeWithDevTools } from "@reduxjs/toolkit/src/devtoolsExtension"
import { reducer } from "../reducers/challengeReducer"

const middlewares = [thunkMiddleware]

const composedEnhancer = composeWithDevTools(applyMiddleware(...middlewares))

const createStore = () => {
  return reduxCreateStore(rootReducer, composedEnhancer)
}

export default createStore
