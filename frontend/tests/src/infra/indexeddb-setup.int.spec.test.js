import "fake-indexeddb/auto"
import { getDatabase } from "../../../src/infra/indexeddb-setup"
import { createTranscriptionDetails } from "../../support/domain-utils"

test("Should create database properly", async () => {
  // Arrange
  const database = await getDatabase()
  const transcriptionDetails = createTranscriptionDetails("Does he have a hump? A hump and a hairpiece?")
  const objectToBeSaved = transcriptionDetails.convertToObject()
  // Act
  await database.transcriptions.put(objectToBeSaved)
  // Assert
  const objectThatWasPersisted = await database.transcriptions.get(1)
  expect(objectThatWasPersisted).toStrictEqual(objectToBeSaved)
})
