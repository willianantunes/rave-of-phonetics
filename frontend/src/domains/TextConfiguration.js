export class TextConfiguration {
  constructor(_id, _text, _language, _pitch, _rate, _createdAt) {
    Object.assign(this, { _id, _text, _language, _pitch, _rate })
    if (_createdAt) this._createdAt = _createdAt
    else this._createdAt = new Date()
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

  static newFromRow(row) {
    return new TextConfiguration(row.id, row.text, row.language, row.pitch, row.rate, row.createdAt)
  }

  static schemaDefinitionNumber1() {
    return { textConfigurations: "++id, text, language, &createdAt" }
  }

  equals(textConfiguration) {
    return JSON.stringify(this) === JSON.stringify(textConfiguration)
  }
}
