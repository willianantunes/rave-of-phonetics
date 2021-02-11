import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  loopSpeechAudio: false,
  rate: 1,
  pitch: 1,
  voices: [],
  filteredVoices: [],
  voiceToSpeech: "",
  isLoading: false,
}

export const textToSpeechSlice = createSlice({
  name: "textToSpeech",
  initialState,
  reducers: {
    analysingReceivedVoices: {
      reducer(state, action) {
        state.isLoading = true
        state.voices = action.payload
      },
      prepare(speechSynthesisVoices) {
        const changedVoices = speechSynthesisVoices.map(voice => ({ lang: voice.lang, name: voice.name }))
        return { payload: changedVoices }
      },
    },
    receivedVoicesWereAnalysed: {
      reducer(state, action) {
        state.filteredVoices = action.payload
        state.voiceToSpeech = state.filteredVoices.length > 0 ? state.filteredVoices[0].name : ""
        state.isLoading = false
      },
      prepare(filteredSpeechSynthesisVoices) {
        const changedVoices = filteredSpeechSynthesisVoices.map(voice => ({ lang: voice.lang, name: voice.name }))
        return { payload: changedVoices }
      },
    },
    setRate: (state, action) => {
      state.rate = action.payload
    },
    setPitch: (state, action) => {
      state.pitch = action.payload
    },
    setLoopSpeechAudio: (state, action) => {
      state.loopSpeechAudio = action.payload
    },
    setVoiceToSpeech: (state, action) => {
      state.voiceToSpeech = action.payload
    },
  },
})

export const {
  analysingReceivedVoices,
  receivedVoicesWereAnalysed,
  setRate,
  setPitch,
  setLoopSpeechAudio,
  setVoiceToSpeech,
} = textToSpeechSlice.actions

export default textToSpeechSlice.reducer

export const analyseVoices = (voices, chosenLanguage) => async dispatch => {
  dispatch(analysingReceivedVoices(voices))
  const filteredVoices = voices.filter(voice => {
    const language = voice.lang.toLowerCase()
    const [languageTag] = chosenLanguage.split("-")
    const fallBackOption = `${languageTag}-${languageTag}`
    return language === chosenLanguage || language === languageTag || language === fallBackOption
  })
  dispatch(receivedVoicesWereAnalysed(filteredVoices))
}
