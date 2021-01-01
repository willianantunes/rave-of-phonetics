import {Dexie} from 'dexie';

jest.mock('dexie');
import {getDatabase} from "../../../../../../../rave_of_phonetics/apps/core/static/core/js/infra/indexeddb-setup";


test('Should try to create database every time the related method is called', async () => {
    Dexie.mockImplementation(() => {
        return {
            version: jest.fn().mockReturnThis(),
            stores: jest.fn().mockReturnThis(),
        }
    });

    getDatabase()
    getDatabase()
    getDatabase()
    getDatabase()

    expect(Dexie).toHaveBeenCalledTimes(4);
})
