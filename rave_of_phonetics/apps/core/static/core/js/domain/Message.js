class Message {
    constructor(_text = '') {
        Object.assign(this, {_text})
    }

    get text() {
        return this._text
    }

    set text(value) {
        this._text = value
    }
}
