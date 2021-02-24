import { Dexie } from "dexie"

jest.mock("dexie")
import { getDatabase } from "../../../../src/infra/indexeddb-setup"

test("Should try to create database every time the related method is called", async () => {
  Dexie.mockImplementation(() => {
    return {
      version: jest.fn().mockReturnThis(),
      stores: jest.fn().mockReturnThis(),
      open: jest.fn().mockReturnThis(),
    }
  })

  await getDatabase()
  await getDatabase()
  await getDatabase()
  await getDatabase()

  expect(Dexie).toHaveBeenCalledTimes(4)
})
