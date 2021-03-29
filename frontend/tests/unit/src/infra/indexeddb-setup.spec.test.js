import { Dexie } from "dexie"

jest.mock("dexie")
import { getDatabase } from "../../../../src/infra/indexeddb-setup"

test("Should try to create database every time the related method is called", async () => {
  // Arrange
  Dexie.mockImplementation(() => {
    return {
      version: jest.fn().mockReturnThis(),
      stores: jest.fn().mockReturnThis(),
      open: jest.fn().mockReturnThis(),
    }
  })
  // Act
  await getDatabase()
  await getDatabase()
  await getDatabase()
  await getDatabase()
  // Assert
  expect(Dexie).toHaveBeenCalledTimes(4)
})
