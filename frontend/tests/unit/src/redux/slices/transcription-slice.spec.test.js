import transcriptionSliceReducer, {
  analysingText,
  loadedTranscription,
  loadTranscriptionFromDatabase,
  setPhones,
  setShowPunctuations,
  setShowStress,
  setShowSyllables,
  textWasTranscribed,
  transcriptionFromText,
  transcriptionToBeSaved,
} from "../../../../../src/redux/slices/transcription-slice"
import thunk from "redux-thunk"
import configureStore from "redux-mock-store"
import { transcribe } from "../../../../../src/services/rop-api"
import { findById } from "../../../../../src/domains/transcription-details-dao"

jest.mock("../../../../../src/services/rop-api")
jest.mock("../../../../../src/domains/transcription-details-dao")

describe("Transcription slice reducer", () => {
  let initialState
  let fakeTranscriptionFromDatabase

  beforeEach(() => {
    initialState = {
      text: "",
      chosenLanguage: "en-us",
      showStress: false,
      showSyllables: false,
      showPunctuations: false,
      showPhonetic: false,
      isLoading: false,
      transcribedResult: null,
      isError: false,
      transcriptionUnsaved: false,
      phones: "Have you tried to transcribe something first?",
      counterOfLoadedTranscription: 0,
    }
    fakeTranscriptionFromDatabase = {
      text: "jafar",
      language: "en-gb",
      showStress: true,
      showSyllables: true,
      showPunctuations: true,
      showPhonetic: true,
      transcriptionSetup: { fakeKey: "fakeValue" },
      singleLineTranscription: "juː ɑːɹ kjʊɹɹiəs",
    }
  })

  describe(`State`, () => {
    test(`Must initialize with the representation of the current transcription configuration`, () => {
      // Act
      const resultingState = transcriptionSliceReducer(undefined, {})
      // Assert
      expect(resultingState).toStrictEqual(initialState)
    })
  })

  describe(`Plain action creators from the slice`, () => {
    test(`Should handle ${setShowStress.type}`, () => {
      // Arrange
      const actionSetup = { type: setShowStress.type, payload: true }
      initialState.showStress = true
      // Act
      const resultingState = transcriptionSliceReducer(undefined, actionSetup)
      // Assert
      expect(resultingState).toStrictEqual(initialState)
    })

    test(`Should handle ${setShowSyllables.type}`, () => {
      // Arrange
      const actionSetup = { type: setShowSyllables.type, payload: true }
      initialState.showSyllables = true
      // Act
      const resultingState = transcriptionSliceReducer(undefined, actionSetup)
      // Assert
      expect(resultingState).toStrictEqual(initialState)
    })

    test(`Should handle ${setShowPunctuations.type}`, () => {
      // Arrange
      const actionSetup = { type: setShowPunctuations.type, payload: true }
      initialState.showPunctuations = true
      // Act
      const resultingState = transcriptionSliceReducer(undefined, actionSetup)
      // Assert
      expect(resultingState).toStrictEqual(initialState)
    })

    test(`Should handle ${loadedTranscription.type}`, () => {
      // Arrange
      const validPayload = {}
      Object.assign(validPayload, fakeTranscriptionFromDatabase)
      validPayload.chosenLanguage = fakeTranscriptionFromDatabase.language
      validPayload.transcribedResult = fakeTranscriptionFromDatabase.transcriptionSetup
      delete fakeTranscriptionFromDatabase.language
      delete fakeTranscriptionFromDatabase.transcriptionSetup
      const actionSetup = { type: loadedTranscription.type, payload: validPayload }
      // Act
      const resultingState = transcriptionSliceReducer(undefined, actionSetup)
      // Assert
      expect(resultingState).toStrictEqual({
        text: fakeTranscriptionFromDatabase.text,
        chosenLanguage: validPayload.chosenLanguage,
        showStress: fakeTranscriptionFromDatabase.showStress,
        showSyllables: fakeTranscriptionFromDatabase.showSyllables,
        showPunctuations: fakeTranscriptionFromDatabase.showPunctuations,
        showPhonetic: fakeTranscriptionFromDatabase.showPhonetic,
        isLoading: initialState.isLoading,
        transcribedResult: validPayload.transcribedResult,
        isError: initialState.isError,
        transcriptionUnsaved: initialState.transcriptionUnsaved,
        phones: initialState.phones,
        counterOfLoadedTranscription: 1,
      })
    })
  })

  describe(`Custom actions`, () => {
    const middlewares = [thunk]
    const mockStore = configureStore(middlewares)

    test(`Should get transcription from text`, async () => {
      // Arrange
      const store = mockStore()
      const handlerForError = jest.fn()
      const [text, language, token] = ["jafar", "en-us", "fake-token"]
      const fakeTranscription = "iago"
      transcribe.mockReturnValue(fakeTranscription)
      // Act
      await store.dispatch(transcriptionFromText(text, language, token, handlerForError))
      // Assert
      const firedActions = store.getActions()
      expect(handlerForError).not.toBeCalled()
      expect(transcribe).toBeCalledWith(text, language, token)
      expect(firedActions).toStrictEqual([
        {
          type: analysingText.type,
          payload: undefined,
        },
        {
          type: textWasTranscribed.type,
          payload: fakeTranscription,
        },
        {
          type: transcriptionToBeSaved.type,
          payload: undefined,
        },
      ])
    })

    test(`Should load transcription from database`, async () => {
      // Arrange
      const store = mockStore()
      const fakeId = 42
      findById.mockReturnValue(fakeTranscriptionFromDatabase)
      // Act
      await store.dispatch(loadTranscriptionFromDatabase(fakeId))
      // Assert
      const firedActions = store.getActions()
      const { singleLineTranscription, ...withoutSingleLine } = fakeTranscriptionFromDatabase
      expect(findById).toBeCalledWith(fakeId)
      expect(firedActions).toStrictEqual([
        {
          type: loadedTranscription.type,
          payload: {
            text: withoutSingleLine.text,
            chosenLanguage: withoutSingleLine.language,
            showStress: withoutSingleLine.showStress,
            showSyllables: withoutSingleLine.showSyllables,
            showPunctuations: withoutSingleLine.showPunctuations,
            showPhonetic: withoutSingleLine.showPhonetic,
            transcribedResult: withoutSingleLine.transcriptionSetup,
          },
        },
        {
          type: setPhones.type,
          payload: singleLineTranscription,
        },
      ])
    })
  })
})
