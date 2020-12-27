export class TextHistory {
    constructor() {
        this._texts = []
        Object.freeze(this)
    }

    add(textConfiguration) {
        this._texts.push(textConfiguration)
    }

    toArray() {
        return [].concat(this._texts)
    }

    erase() {
        this._texts.length = 0
    }
}
