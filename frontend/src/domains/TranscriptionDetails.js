export class TranscriptionDetails {
  constructor(_id, _text, _language, _transcription, _withStress, _transcriptionSetup, _createdAt) {
    Object.assign(this, { _id, _text, _language, _transcription, _withStress, _transcriptionSetup })
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

  get transcription() {
    return this._transcription
  }

  get withStress() {
    return this._withStress
  }

  get transcriptionSetup() {
    return this._transcriptionSetup
  }

  get createdAt() {
    return this._createdAt
  }

  static newFromRow(row) {
    return new TranscriptionDetails(
      row.id,
      row.text,
      row.language,
      row.transcription,
      row.withStress,
      row.transcriptionSetup,
      row.createdAt
    )
  }

  equals(textConfiguration) {
    return JSON.stringify(this) === JSON.stringify(textConfiguration)
  }
}
