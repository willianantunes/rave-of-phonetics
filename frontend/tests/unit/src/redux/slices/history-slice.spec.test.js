import historySliceReducer, {
  addNewTranscriptionDetails,
  addTranscriptionDetails,
  deleteAllTranscriptionHistory,
  eraseTranscriptionDetails,
  loadAllTranscriptionDetails,
  loadTranscriptionHistory,
} from "../../../../../src/redux/slices/history-slice"
import thunk from "redux-thunk"
import configureStore from "redux-mock-store"
import { deleteAll, findAll, saveOrUpdate } from "../../../../../src/domains/transcription-details-dao"
import { transcriptionSaved } from "../../../../../src/redux/slices/transcription-slice"

jest.mock("../../../../../src/domains/transcription-details-dao")

describe("History slice reducer", () => {
  let initialState

  beforeEach(() => {
    initialState = {
      transcriptions: [],
    }
  })

  describe(`State`, () => {
    test(`Must initialize with an empty list of transcriptions`, () => {
      // Act
      const resultingState = historySliceReducer(undefined, {})
      // Assert
      expect(resultingState).toStrictEqual(initialState)
    })
  })

  describe(`Plain action creators from the slice`, () => {
    test(`Should handle ${addNewTranscriptionDetails.type} inserting item at the beginning of the array `, () => {
      // Arrange - 1
      const fakeItemOne = 42
      const actionSetupOne = { type: addNewTranscriptionDetails.type, payload: fakeItemOne }
      initialState.transcriptions.unshift(fakeItemOne)
      // Act - 1
      const resultingStateOne = historySliceReducer(undefined, actionSetupOne)
      // Assert - 1
      expect(resultingStateOne).toStrictEqual(initialState)
      // Arrange - 2
      const fakeItemTwo = 23
      const actionSetupTwo = { type: addNewTranscriptionDetails.type, payload: fakeItemTwo }
      initialState.transcriptions.unshift(fakeItemTwo)
      // Act - 1
      const resultingStateTwo = historySliceReducer(resultingStateOne, actionSetupTwo)
      // Arrange - 2
      expect(resultingStateTwo).toStrictEqual(initialState)
    })

    test(`Should handle ${loadAllTranscriptionDetails.type}`, () => {
      // Arrange
      const fakeTranscription = ["q", "w", "e", "r", "t", "y"]
      const actionSetup = { type: loadAllTranscriptionDetails.type, payload: fakeTranscription }
      initialState.transcriptions = fakeTranscription
      // Act
      const resultingState = historySliceReducer(undefined, actionSetup)
      // Assert
      expect(resultingState).toStrictEqual(initialState)
    })

    test(`Should handle ${eraseTranscriptionDetails.type}`, () => {
      // Arrange
      const actionSetup = { type: eraseTranscriptionDetails.type }
      // Act
      const resultingState = historySliceReducer(undefined, actionSetup)
      // Assert
      expect(resultingState).toStrictEqual(initialState)
    })
  })

  describe(`Custom actions`, () => {
    const middlewares = [thunk]
    const mockStore = configureStore(middlewares)

    test(`Should load transcription history`, async () => {
      // Arrange
      const store = mockStore()
      const fakeObject = "iago"
      const fakeConvertToObject = jest.fn(() => fakeObject)
      const fakeTranscriptions = [{ convertToObject: fakeConvertToObject }, { convertToObject: fakeConvertToObject }]
      findAll.mockReturnValue(fakeTranscriptions)
      // Act
      await store.dispatch(loadTranscriptionHistory())
      // Assert
      expect(findAll).toBeCalled()
      expect(fakeConvertToObject).toBeCalledTimes(2)
      const firedActions = store.getActions()
      expect(firedActions).toStrictEqual([
        {
          type: loadAllTranscriptionDetails.type,
          payload: [fakeObject, fakeObject],
        },
      ])
    })

    test(`Should add transcription to the history`, async () => {
      // Arrange
      const store = mockStore()
      const fakeObjectPersisted = "jafar"
      const fakeConvertToObjectPersisted = jest.fn(() => fakeObjectPersisted)
      const fakeTranscriptionPersisted = { convertToObject: fakeConvertToObjectPersisted }
      saveOrUpdate.mockReturnValue(fakeTranscriptionPersisted)
      const fakeObjectToBePersisted = "iago"
      const fakeConvertToObjectToBePersisted = jest.fn(() => fakeObjectToBePersisted)
      const fakeTranscriptionToBePersisted = { convertToObject: fakeConvertToObjectToBePersisted }
      // Act
      await store.dispatch(addTranscriptionDetails(fakeTranscriptionToBePersisted))
      // Assert
      expect(fakeConvertToObjectToBePersisted).toBeCalled()
      expect(saveOrUpdate).toBeCalledWith(fakeObjectToBePersisted)
      expect(fakeConvertToObjectPersisted).toBeCalled()
      const firedActions = store.getActions()
      expect(firedActions).toStrictEqual([
        {
          type: addNewTranscriptionDetails.type,
          payload: fakeObjectPersisted,
        },
        {
          type: transcriptionSaved.type,
          payload: fakeObjectPersisted,
        },
      ])
    })

    test(`Should delete all transcriptions from history`, async () => {
      // Arrange
      const store = mockStore()
      // Act
      await store.dispatch(deleteAllTranscriptionHistory())
      // Assert
      expect(deleteAll).toBeCalled()
      const firedActions = store.getActions()
      expect(firedActions).toStrictEqual([
        {
          type: eraseTranscriptionDetails.type,
          payload: undefined,
        },
      ])
    })
  })
})
