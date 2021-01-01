import 'fake-indexeddb/auto'
import Dexie from 'dexie';
import {TextConfiguration} from "../../../../../../../rave_of_phonetics/apps/core/static/core/js/domain/TextConfiguration";
import * as dao from "../../../../../../../rave_of_phonetics/apps/core/static/core/js/domain/TextConfigurationDao"
import {sleep} from "../../../../../../support/utils";
import {databaseName} from "../../../../../../../rave_of_phonetics/apps/core/static/core/js/infra/indexeddb-setup";

beforeEach(async done => {
    await Dexie.delete(databaseName)
    done()
})

test('Should save TextConfiguration and retrieve it afterwards', async () => {
    const textConfiguration = new TextConfiguration(null, "Jafar", "en-us", 1, 1)
    const persistedTextConfiguration = await dao.saveOrUpdate(textConfiguration)

    const textConfigurationFromDatabase = await dao.findById(persistedTextConfiguration.id)
    const listOfTextConfiguration = await dao.findAll()

    expect(persistedTextConfiguration.id).toBe(1)
    expect(listOfTextConfiguration).toHaveLength(1)
    expect(listOfTextConfiguration[0].equals(textConfigurationFromDatabase)).toBeTruthy()
})

test('Should save two TextConfiguration and list them', async () => {
    const textConfigurationJafar = new TextConfiguration(null, "Jafar", "en-us", 1, 1)
    // In order to avoid collision in createdAt field
    await sleep(100);
    const textConfigurationIago = new TextConfiguration(null, "Iago", "en-us", 2, 2)

    const persistedRetrievedJafar = await dao.saveOrUpdate(textConfigurationJafar)
    const persistedRetrievedIago = await dao.saveOrUpdate(textConfigurationIago)
    const listOfTextConfiguration = await dao.findAll()

    expect(persistedRetrievedJafar.id).toBe(1)
    expect(persistedRetrievedIago.id).toBe(2)

    expect(listOfTextConfiguration).toHaveLength(2)
    expect(listOfTextConfiguration[0].equals(persistedRetrievedJafar)).toBeTruthy()
    expect(listOfTextConfiguration[1].equals(persistedRetrievedIago)).toBeTruthy()
})

test('Should save TextConfiguration and delete it afterwards', async () => {
    const textConfiguration = new TextConfiguration(null, "Jafar", "en-us", 1, 1)
    const persistedTextConfiguration = await dao.saveOrUpdate(textConfiguration)

    await dao.deleteById(persistedTextConfiguration.id)
    const listOfTextConfiguration = await dao.findAll()

    expect(listOfTextConfiguration).toHaveLength(0)
})

test('Should save two TextConfiguration and delete all objects in the store', async () => {
    const textConfigurationJafar = new TextConfiguration(null, "Jafar", "en-us", 1, 1)
    // In order to avoid collision in createdAt field
    await sleep(100);
    const textConfigurationIago = new TextConfiguration(null, "Iago", "en-us", 2, 2)

    await dao.saveOrUpdate(textConfigurationJafar)
    await dao.saveOrUpdate(textConfigurationIago)
    await dao.deleteAll()
    const listOfTextConfiguration = await dao.findAll()

    expect(listOfTextConfiguration).toHaveLength(0)
})

test('Should save TextConfiguration and update it with a new value', async () => {
    const textConfiguration = new TextConfiguration(null, "Jafar", "en-us", 1, 1)
    const persistedTextConfiguration = await dao.saveOrUpdate(textConfiguration)

    const newText = "Jafar and Iago"
    const updatedTextConfiguration = new TextConfiguration(persistedTextConfiguration.id, newText, "en-us", 1, 1)
    const updatedPersistedTextConfiguration = await dao.saveOrUpdate(updatedTextConfiguration)
    const listOfTextConfiguration = await dao.findAll()

    expect(listOfTextConfiguration).toHaveLength(1)
    expect(updatedPersistedTextConfiguration.text).toBe(newText)
    expect(updatedPersistedTextConfiguration.createdAt.toISOString()).toBe(textConfiguration.createdAt.toISOString())
})

test('Should save two TextConfiguration, delete only one given its ID and list the store afterwards', async () => {
    const textConfigurationJafar = new TextConfiguration(null, "Jafar", "en-us", 1, 1)
    // In order to avoid collision in createdAt field
    await sleep(100);
    const textConfigurationIago = new TextConfiguration(null, "Iago", "en-us", 2, 2)

    const persistedJafar = await dao.saveOrUpdate(textConfigurationJafar)
    const persistedIago = await dao.saveOrUpdate(textConfigurationIago)
    await dao.deleteById(persistedJafar.id)
    const listOfTextConfiguration = await dao.findAll()

    expect(listOfTextConfiguration).toHaveLength(1)
    const persistedIagoFromList = listOfTextConfiguration[0];
    expect(persistedIagoFromList.equals(persistedIago)).toBeTruthy()
})
