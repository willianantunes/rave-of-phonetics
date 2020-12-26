class TextConfiguration {
    constructor(_id, _text, _language, _pitch, _rate) {
        Object.assign(this, {_id, _text, _language, _pitch, _rate})
        this._createdAt = new Date()
        Object.freeze(this)
    }

    get id() {
        return this._id
    }

    get text() {
        return this._text
    }

    get language() {
        return this._language
    }

    get pitch() {
        return this._pitch
    }

    get rate() {
        return this._rate
    }

    get createdAt() {
        return this._createdAt
    }

    equals(textConfiguration) {
        return JSON.stringify(this) === JSON.stringify(textConfiguration);
    }
}
