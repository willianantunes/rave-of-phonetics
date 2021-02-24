import "fake-indexeddb/auto"
import { getDatabase } from "../../../../src/infra/indexeddb-setup"

test("Should create database properly", async () => {
  const database = await getDatabase()

  const now = new Date()
  const textConfigurationToBeSaved = {
    _text: "Jafar",
    _language: "en-us",
    _transcription: "dʒæfɑːɹ",
    _withStress: true,
    _pitch: 1,
    _rate: 1,
    _createdAt: now,
  }
  await database.transcriptionDetails.put(textConfigurationToBeSaved)

  const textConfigurationFromDatabase = await database.transcriptionDetails.get(1)

  expect(textConfigurationFromDatabase._text).toBe(textConfigurationToBeSaved._text)
  expect(textConfigurationFromDatabase._language).toBe(textConfigurationToBeSaved._language)
  expect(textConfigurationFromDatabase._transcription).toBe(textConfigurationToBeSaved._transcription)
  expect(textConfigurationFromDatabase._withStress).toBe(textConfigurationToBeSaved._withStress)
  expect(textConfigurationFromDatabase._pitch).toBe(textConfigurationToBeSaved._pitch)
  expect(textConfigurationFromDatabase._rate).toBe(textConfigurationToBeSaved._rate)
  expect(textConfigurationFromDatabase._createdAt.toISOString()).toBe(now.toISOString())
})
