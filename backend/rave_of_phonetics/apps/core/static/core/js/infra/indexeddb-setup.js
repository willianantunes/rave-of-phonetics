import Dexie from 'dexie';
import {TextConfiguration} from "../domain/TextConfiguration";

export const databaseName = "RaveOfPhonetics"
const currentDatabaseVersion = 1

function applyAllMigrations(db) {
    // https://dexie.org/docs/Version/Version.stores()
    db.version(currentDatabaseVersion).stores(TextConfiguration.schemaDefinitionNumber1());
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
