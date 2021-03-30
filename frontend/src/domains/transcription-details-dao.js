import { getDatabase } from "../infra/indexeddb-setup"
import { TranscriptionDetails } from "./TranscriptionDetails"

const tableName = "transcriptions"

export async function findById(id, predefinedDatabase = null) {
  const db = predefinedDatabase ? predefinedDatabase : await getDatabase()
  const retrievedData = await db[tableName].get(id)
  return TranscriptionDetails.newFromDatabaseRow(retrievedData)
}

export async function saveOrUpdate(objectToBeSaved) {
  const db = await getDatabase()

  if (objectToBeSaved.id) {
    delete objectToBeSaved["createdAt"]
    await db[tableName].update(objectToBeSaved.id, objectToBeSaved)
    return findById(objectToBeSaved.id, db)
  }

  const newId = await db[tableName].add(objectToBeSaved)
  return findById(newId, db)
}

export async function findAll() {
  const db = await getDatabase()
  const listOfPersistedObjects = await db[tableName].toArray()
  return listOfPersistedObjects.map(row => TranscriptionDetails.newFromDatabaseRow(row))
}

export async function deleteAll() {
  const db = await getDatabase()
  return await db[tableName].clear()
}

export async function deleteById(id) {
  const db = await getDatabase()
  await db[tableName].delete(id)
}

export async function lastItemInserted() {
  const db = await getDatabase()

  // I could have done like the following, but there is not DESC order:
  // await db.transcriptionDetails.orderBy('createdAt').first()
  const retrievedKey = await db[tableName].orderBy(":id").lastKey()

  return findById(retrievedKey, db)
}
