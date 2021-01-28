import {getDatabase} from "../infra/indexeddb-setup";
import {TextConfiguration} from "./TextConfiguration";

export async function findById(id, predefinedDatabase = null) {
    const db = predefinedDatabase ? predefinedDatabase : await getDatabase()
    const retrievedData = await db.textConfigurations.get(id);
    return TextConfiguration.newFromRow(retrievedData)
}

export async function saveOrUpdate(textConfiguration) {
    const db = await getDatabase()
    const textConfigurationToBeSaved = {
        text: textConfiguration.text,
        language: textConfiguration.language,
        pitch: textConfiguration.pitch,
        rate: textConfiguration.rate,
        createdAt: textConfiguration.createdAt
    }
    if (textConfiguration.id) {
        delete textConfigurationToBeSaved["createdAt"]
        await db.textConfigurations.update(textConfiguration.id, textConfigurationToBeSaved)
        return findById(textConfiguration.id, db)
    }
    const newId = await db.textConfigurations.add(textConfigurationToBeSaved)
    return findById(newId, db)
}

export async function findAll() {
    const db = await getDatabase()
    const listOfTextConfiguration = await db.textConfigurations.toArray()
    return listOfTextConfiguration.map(row => TextConfiguration.newFromRow(row))
}

export async function deleteAll() {
    const db = await getDatabase()
    return await db.textConfigurations.clear()
}

export async function deleteById(id) {
    const db = await getDatabase()
    await db.textConfigurations.delete(id)
}

export async function lastItemInserted() {
    const db = await getDatabase()

    // I could have done like the following, but there is not DESC order:
    // await db.textConfigurations.orderBy('createdAt').first()
    const retrievedKey = await db.textConfigurations.orderBy(':id').lastKey()

    return findById(retrievedKey, db)
}
