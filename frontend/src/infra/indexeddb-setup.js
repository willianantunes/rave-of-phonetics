import Dexie from "dexie"

export const databaseName = "RaveOfPhonetics"
const currentDatabaseVersion = 3

function applyAllMigrations(db) {
  // https://dexie.org/docs/Version/Version.stores()
  db.version(1).stores({ textConfigurations: "++id, text, language, &createdAt" })
  db.version(2).stores({
    textConfigurations: null,
    transcriptionDetails: "++id, text, language, &createdAt",
  })
  db.version(currentDatabaseVersion).stores({
    transcriptionDetails: null,
    transcriptions: "++id, text, language, &createdAt",
  })
}

export async function getDatabase() {
  try {
    const database = new Dexie(databaseName)
    applyAllMigrations(database)
    // Open database as a means to upgrade it if a new migration is available
    return database.open()
  } catch (e) {
    throw new Error(`Database could not be get! Reason: ${e}`)
  }
}
