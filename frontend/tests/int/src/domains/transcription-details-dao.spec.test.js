import "fake-indexeddb/auto"
import Dexie from "dexie"
import { databaseName } from "../../../../src/infra/indexeddb-setup"
import * as dao from "../../../../src/domains/transcription-details-dao"
import { sleep } from "../../../../src/utils/general"
import { createTranscriptionDetails } from "../../../support/domain-utils"

describe("Transcription DAO", () => {
  beforeEach(async done => {
    await Dexie.delete(databaseName)
    done()
  })

  test("Should save TranscriptionDetails and retrieve it afterwards", async () => {
    // Arrange
    const transcriptionDetails = createTranscriptionDetails()
    // Act
    const persistedObject = await dao.saveOrUpdate(transcriptionDetails)
    const persistedObjectFromDatabase = await dao.findById(persistedObject.id)
    const listOfPersistedObjects = await dao.findAll()
    // Assert
    expect(persistedObject.id).toBe(1)
    expect(listOfPersistedObjects).toHaveLength(1)
    expect(listOfPersistedObjects[0].equals(persistedObjectFromDatabase)).toBeTruthy()
  })

  test("Should save two TranscriptionDetails and list them", async () => {
    // Arrange
    const stressedTranscriptionDetails = createTranscriptionDetails({ showStress: true })
    await sleep(100) // In order to avoid collision in createdAt field
    const phoneticTranscriptionDetails = createTranscriptionDetails({ showPhonetic: true })
    // Act
    const persistedStressedTranscriptionDetails = await dao.saveOrUpdate(stressedTranscriptionDetails)
    const persistedPhoneticTranscriptionDetails = await dao.saveOrUpdate(phoneticTranscriptionDetails)
    // Assert
    const listOfPersistedObjects = await dao.findAll()
    expect(persistedStressedTranscriptionDetails.id).toBe(1)
    expect(persistedPhoneticTranscriptionDetails.id).toBe(2)
    expect(listOfPersistedObjects).toHaveLength(2)
    expect(listOfPersistedObjects[0].equals(persistedStressedTranscriptionDetails)).toBeTruthy()
    expect(listOfPersistedObjects[1].equals(persistedPhoneticTranscriptionDetails)).toBeTruthy()
  })

  test("Should save TranscriptionDetails and delete it afterwards", async () => {
    // Arrange
    const stressedTranscriptionDetails = createTranscriptionDetails({ showStress: true })
    const persistedObject = await dao.saveOrUpdate(stressedTranscriptionDetails)
    // Act
    await dao.deleteById(persistedObject.id)
    // Assert
    const listOfPersistedObjects = await dao.findAll()
    expect(listOfPersistedObjects).toHaveLength(0)
  })

  test("Should save two TranscriptionDetails and delete all objects in the store", async () => {
    // Arrange
    const stressedTranscriptionDetails = createTranscriptionDetails({ showStress: true })
    await sleep(100) // In order to avoid collision in createdAt field
    const phoneticTranscriptionDetails = createTranscriptionDetails({ showPhonetic: true })
    // Act
    await dao.saveOrUpdate(stressedTranscriptionDetails)
    await dao.saveOrUpdate(phoneticTranscriptionDetails)
    await dao.deleteAll()
    // Assert
    const listOfPersistedObjects = await dao.findAll()
    expect(listOfPersistedObjects).toHaveLength(0)
  })

  test("Should save TranscriptionDetails and update it with a new value", async () => {
    // Arrange
    const stressedTranscriptionDetails = createTranscriptionDetails({ showStress: true })
    const persistedStressed = await dao.saveOrUpdate(stressedTranscriptionDetails)
    expect(persistedStressed.showSyllables).toBeFalsy()
    const refreshedStressed = createTranscriptionDetails({ id: persistedStressed.id, showSyllables: true })
    // Act
    const updatedPersistedStressed = await dao.saveOrUpdate(refreshedStressed)
    // Assert
    expect(updatedPersistedStressed.showSyllables).toBeTruthy()
    const listOfPersistedObjects = await dao.findAll()
    expect(listOfPersistedObjects).toHaveLength(1)
    expect(listOfPersistedObjects[0].equals(updatedPersistedStressed)).toBeTruthy()
  })

  test("Should save two TranscriptionDetails, delete only one given its ID and list the store afterwards", async () => {
    // Arrange
    const stressedTranscriptionDetails = createTranscriptionDetails({ showStress: true })
    await sleep(100) // In order to avoid collision in createdAt field
    const phoneticTranscriptionDetails = createTranscriptionDetails({ showPhonetic: true })
    // Act
    const persistedStressed = await dao.saveOrUpdate(stressedTranscriptionDetails)
    const persistedPhonetic = await dao.saveOrUpdate(phoneticTranscriptionDetails)
    await dao.deleteById(persistedStressed.id)
    // Assert
    const listOfPersistedObjects = await dao.findAll()
    expect(listOfPersistedObjects).toHaveLength(1)
    const persistedPhoneticFromList = listOfPersistedObjects[0]
    expect(persistedPhoneticFromList.equals(persistedPhonetic)).toBeTruthy()
  })

  test("Should retrieve last item inserted", async () => {
    // Arrange
    const stressedTranscriptionDetails = createTranscriptionDetails({ showStress: true })
    await sleep(100) // In order to avoid collision in createdAt field
    const phoneticTranscriptionDetails = createTranscriptionDetails({ showPhonetic: true })
    await dao.saveOrUpdate(stressedTranscriptionDetails)
    const persistedPhonetic = await dao.saveOrUpdate(phoneticTranscriptionDetails)
    // Act
    const lastItemInserted = await dao.lastItemInserted()
    // Assert
    expect(lastItemInserted.equals(persistedPhonetic)).toBeTruthy()
  })
})
