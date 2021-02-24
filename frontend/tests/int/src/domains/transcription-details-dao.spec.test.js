import "fake-indexeddb/auto"
import Dexie from "dexie"
import { databaseName } from "../../../../src/infra/indexeddb-setup"
import { TranscriptionDetails } from "../../../../src/domains/TranscriptionDetails"
import * as dao from "../../../../src/domains/transcription-details-dao"
import { sleep } from "../../../../src/utils/general"

beforeEach(async done => {
  await Dexie.delete(databaseName)
  done()
})

test("Should save TranscriptionDetails and retrieve it afterwards", async () => {
  const sampleTranscriptionSetup = [{ word: "Jafar", phone: "dʒˈæfɑːɹ" }]
  const transcriptionDetails = new TranscriptionDetails(null, "Jafar", "en-us", "dʒæfɑːɹ", true, sampleTranscriptionSetup)
  const persistedObject = await dao.saveOrUpdate(transcriptionDetails)

  const persistedObjectFromDatabase = await dao.findById(persistedObject.id)
  const listOfPersistedObjects = await dao.findAll()

  expect(persistedObject.id).toBe(1)
  expect(listOfPersistedObjects).toHaveLength(1)
  expect(listOfPersistedObjects[0].equals(persistedObjectFromDatabase)).toBeTruthy()
})

test("Should save two TranscriptionDetails and list them", async () => {
  const jafarTranscriptionSetup = [{ word: "Jafar", phone: "dʒˈæfɑːɹ" }]
  const jafarTranscriptionDetails = new TranscriptionDetails(null, "Jafar", "en-us", "dʒæfɑːɹ", true, jafarTranscriptionSetup)
  // In order to avoid collision in createdAt field
  await sleep(100)
  const iagoTranscriptionSetup = [{ word: "Iago", phone: "aɪˈeɪɡoʊ" }]
  const iagoTranscriptionDetails = new TranscriptionDetails(null, "Iago", "en-us", "aɪˈeɪɡoʊ", false, iagoTranscriptionSetup)

  const persistedRetrievedJafar = await dao.saveOrUpdate(jafarTranscriptionDetails)
  const persistedRetrievedIago = await dao.saveOrUpdate(iagoTranscriptionDetails)
  const listOfPersistedObjects = await dao.findAll()

  expect(persistedRetrievedJafar.id).toBe(1)
  expect(persistedRetrievedIago.id).toBe(2)

  expect(listOfPersistedObjects).toHaveLength(2)
  expect(listOfPersistedObjects[0].equals(persistedRetrievedJafar)).toBeTruthy()
  expect(listOfPersistedObjects[1].equals(persistedRetrievedIago)).toBeTruthy()
})

test("Should save TranscriptionDetails and delete it afterwards", async () => {
  const jafarTranscriptionSetup = [{ word: "Jafar", phone: "dʒˈæfɑːɹ" }]
  const jafarTranscriptionDetails = new TranscriptionDetails(null, "Jafar", "en-us", "dʒæfɑːɹ", true, jafarTranscriptionSetup)
  const persistedObject = await dao.saveOrUpdate(jafarTranscriptionDetails)

  await dao.deleteById(persistedObject.id)
  const listOfPersistedObjects = await dao.findAll()

  expect(listOfPersistedObjects).toHaveLength(0)
})

test("Should save two TranscriptionDetails and delete all objects in the store", async () => {
  const jafarTranscriptionSetup = [{ word: "Jafar", phone: "dʒˈæfɑːɹ" }]
  const jafarTranscriptionDetails = new TranscriptionDetails(null, "Jafar", "en-us", "dʒæfɑːɹ", true, jafarTranscriptionSetup)
  // In order to avoid collision in createdAt field
  await sleep(100)
  const iagoTranscriptionSetup = [{ word: "Iago", phone: "aɪˈeɪɡoʊ" }]
  const iagoTranscriptionDetails = new TranscriptionDetails(null, "Iago", "en-us", "aɪˈeɪɡoʊ", false, iagoTranscriptionSetup)

  await dao.saveOrUpdate(jafarTranscriptionDetails)
  await dao.saveOrUpdate(iagoTranscriptionDetails)
  await dao.deleteAll()
  const listOfPersistedObjects = await dao.findAll()

  expect(listOfPersistedObjects).toHaveLength(0)
})

test("Should save TranscriptionDetails and update it with a new value", async () => {
  const jafarTranscriptionSetup = [{ word: "Jafar", phone: "dʒˈæfɑːɹ" }]
  const jafarTranscriptionDetails = new TranscriptionDetails(null, "Jafar", "en-us", "dʒæfɑːɹ", true, jafarTranscriptionSetup)
  const persistedJafar = await dao.saveOrUpdate(jafarTranscriptionDetails)

  const [newText, newPhone] = ["Jafar and Iago", "dʒˈæfɑːɹ ˈænd aɪˈeɪɡoʊ"]
  const newTranscriptionSetup = [{ word: newText, phone: newPhone }]
  const updatedJafar = new TranscriptionDetails(persistedJafar.id, newText, "en-us", newPhone, true, newTranscriptionSetup)
  const updatedPersistedJafar = await dao.saveOrUpdate(updatedJafar)
  const listOfPersistedObjects = await dao.findAll()

  expect(listOfPersistedObjects).toHaveLength(1)
  expect(updatedPersistedJafar.text).toBe(newText)
  expect(updatedPersistedJafar.transcription).toBe(newPhone)
  expect(JSON.stringify(updatedPersistedJafar.transcriptionSetup)).toBe(JSON.stringify(newTranscriptionSetup))
  expect(updatedPersistedJafar.createdAt.toISOString()).toBe(persistedJafar.createdAt.toISOString())
})

test("Should save two TranscriptionDetails, delete only one given its ID and list the store afterwards", async () => {
  const jafarTranscriptionSetup = [{ word: "Jafar", phone: "dʒˈæfɑːɹ" }]
  const jafarTranscriptionDetails = new TranscriptionDetails(null, "Jafar", "en-us", "dʒæfɑːɹ", true, jafarTranscriptionSetup)
  // In order to avoid collision in createdAt field
  await sleep(100)
  const iagoTranscriptionSetup = [{ word: "Iago", phone: "aɪˈeɪɡoʊ" }]
  const iagoTranscriptionDetails = new TranscriptionDetails(null, "Iago", "en-us", "aɪˈeɪɡoʊ", false, iagoTranscriptionSetup)

  const persistedJafar = await dao.saveOrUpdate(jafarTranscriptionDetails)
  const persistedIago = await dao.saveOrUpdate(iagoTranscriptionDetails)
  await dao.deleteById(persistedJafar.id)
  const listOfPersistedObjects = await dao.findAll()

  expect(listOfPersistedObjects).toHaveLength(1)
  const persistedIagoFromList = listOfPersistedObjects[0]
  expect(persistedIagoFromList.equals(persistedIago)).toBeTruthy()
})

test("Should retrieve last item inserted", async () => {
  const jafarTranscriptionSetup = [{ word: "Jafar", phone: "dʒˈæfɑːɹ" }]
  const jafarTranscriptionDetails = new TranscriptionDetails(null, "Jafar", "en-us", "dʒæfɑːɹ", true, jafarTranscriptionSetup)
  // In order to avoid collision in createdAt field
  await sleep(100)
  const iagoTranscriptionSetup = [{ word: "Iago", phone: "aɪˈeɪɡoʊ" }]
  const iagoTranscriptionDetails = new TranscriptionDetails(null, "Iago", "en-us", "aɪˈeɪɡoʊ", false, iagoTranscriptionSetup)

  await dao.saveOrUpdate(jafarTranscriptionDetails)
  const persistedRetrievedIago = await dao.saveOrUpdate(iagoTranscriptionDetails)

  const lastItemInserted = await dao.lastItemInserted()

  expect(lastItemInserted.equals(persistedRetrievedIago)).toBeTruthy()
})
