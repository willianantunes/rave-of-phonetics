const initialState = {
  count: 0,
}

export const reducer = (state = initialState, action) => {
  console.log(`######### ${typeof state} / ${state.count}`)
  if (action.type === `INCREMENT`) {
    return {
      ...state,
      count: state.count + 1,
    }
  }
  return state
}
