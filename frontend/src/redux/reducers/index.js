import { combineReducers } from "redux"
import { reducer as counter } from "./challengeReducer"

export default combineReducers({
  counter,
})
