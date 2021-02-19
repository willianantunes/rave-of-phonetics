import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  loopSpeechAudio: false,
  rate: 1,
  pitch: 1,
  voices: [],
  filteredVoices: [],
  voiceToSpeech: "",
  isLoading: false,
  voicesWereLoadedOnce: false,
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
        state.filteredVoices = action.payload.changedVoices
        state.voiceToSpeech = action.payload.voiceToSpeech
        state.isLoading = false
        if (state.voicesWereLoadedOnce === false) {
          state.voicesWereLoadedOnce = action.payload.changedVoices.length > 0
        }
      },
      prepare(filteredSpeechSynthesisVoices) {
        const changedVoices = filteredSpeechSynthesisVoices.map(voice => ({ lang: voice.lang, name: voice.name }))
        const voiceToSpeech = changedVoices.length > 0 ? changedVoices[0].name : ""
        return { payload: { changedVoices, voiceToSpeech } }
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
  if (voices.length !== 0) {
    dispatch(analysingReceivedVoices(voices))
    const filteredVoices = voices.filter(voice => {
      const language = voice.lang.toLowerCase()
      const [languageTag] = chosenLanguage.split("-")
      const fallBackOption = `${languageTag}-${languageTag}`
      return language === chosenLanguage || language === languageTag || language === fallBackOption
    })
    dispatch(receivedVoicesWereAnalysed(filteredVoices))
  }
}
