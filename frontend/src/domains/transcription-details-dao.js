import { getDatabase } from "../infra/indexeddb-setup"
import { TranscriptionDetails } from "./TranscriptionDetails"

export async function findById(id, predefinedDatabase = null) {
  const db = predefinedDatabase ? predefinedDatabase : await getDatabase()
  const retrievedData = await db.transcriptionDetails.get(id)
  return TranscriptionDetails.newFromRow(retrievedData)
}

export async function saveOrUpdate(textConfiguration) {
  const db = await getDatabase()
  const textConfigurationToBeSaved = {
    text: textConfiguration.text,
    language: textConfiguration.language,
    transcription: textConfiguration.transcription,
    withStress: textConfiguration.withStress,
    transcriptionSetup: textConfiguration.transcriptionSetup,
    createdAt: textConfiguration.createdAt,
  }
  if (textConfiguration.id) {
    delete textConfigurationToBeSaved["createdAt"]
    await db.transcriptionDetails.update(textConfiguration.id, textConfigurationToBeSaved)
    return findById(textConfiguration.id, db)
  }
  const newId = await db.transcriptionDetails.add(textConfigurationToBeSaved)
  return findById(newId, db)
}

export async function findAll() {
  const db = await getDatabase()
  const listOfTextConfiguration = await db.transcriptionDetails.toArray()
  return listOfTextConfiguration.map(row => TranscriptionDetails.newFromRow(row))
}

export async function deleteAll() {
  const db = await getDatabase()
  return await db.transcriptionDetails.clear()
}

export async function deleteById(id) {
  const db = await getDatabase()
  await db.transcriptionDetails.delete(id)
}

export async function lastItemInserted() {
  const db = await getDatabase()

  // I could have done like the following, but there is not DESC order:
  // await db.transcriptionDetails.orderBy('createdAt').first()
  const retrievedKey = await db.transcriptionDetails.orderBy(":id").lastKey()

  return findById(retrievedKey, db)
}
