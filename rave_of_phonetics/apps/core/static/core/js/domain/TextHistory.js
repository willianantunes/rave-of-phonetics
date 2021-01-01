import * as dao from "./TextConfigurationDao";

export class TextHistory {
    add(textConfiguration) {
        dao.saveOrUpdate(textConfiguration)
    }

    toArray() {
        return dao.findAll()
    }

    erase() {
        dao.deleteAll()
    }
}
