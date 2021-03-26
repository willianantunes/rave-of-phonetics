export class TranscriptionDetails {
  constructor(
    _id,
    _text,
    _language,
    _transcription,
    _showStress,
    _showSyllables,
    _showPunctuations,
    _transcriptionSetup,
    _createdAt,
    _phoneme_separator = ""
  ) {
    Object.assign(this, {
      _id,
      _text,
      _language,
      _transcription,
      _showStress,
      _showSyllables,
      _showPunctuations,
      _transcriptionSetup,
      _phoneme_separator,
    })
    if (_createdAt) this._createdAt = _createdAt
    else this._createdAt = new Date()
    this._cleanedWords = this._extractCleanedWordsFromText()
    this._default_phoneme_separator = " "
    Object.freeze(this)
  }

  get id() {
    return this._id
  }

  get text() {
    return this._text
  }

  get cleanedWords() {
    return this._cleanedWords
  }

  get language() {
    return this._language
  }

  get transcription() {
    return this._transcription
  }

  get showStress() {
    return this._showStress
  }

  get showSyllables() {
    return this._showSyllables
  }

  get showPunctuations() {
    return this._showPunctuations
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
      row.showStress,
      row.showSyllables,
      row.showPunctuations,
      row.transcriptionSetup,
      row.createdAt
    )
  }

  equals(textConfiguration) {
    return JSON.stringify(this) === JSON.stringify(textConfiguration)
  }

  _extractCleanedWordsFromText() {
    // This is only for EN-US and EN-GB
    const regexToExtractWords = /([\w'-])+/g
    return this._text.match(regexToExtractWords).map(value => value.toLowerCase())
  }

  _applyPunctuation(wordWithPunctuations, target, punctuationMarks = /(\s*[;:,.!?¡¿—…"«»“”]+\s*)+/g) {
    if (target) {
      const matches = [...wordWithPunctuations.matchAll(punctuationMarks)]
      const hasPunctuation = matches.length > 0
      if (hasPunctuation) {
        for (const match of matches) {
          // This is incomplete, but should work for most cases
          // If wordWithPunctuations is ",rave,", then the target will have two commas at the beginning
          const markThatWasMatched = match[0]
          if (wordWithPunctuations.startsWith(markThatWasMatched)) {
            target = `${markThatWasMatched}${target}`
          } else if (wordWithPunctuations.endsWith(markThatWasMatched)) {
            target = `${target}${markThatWasMatched}`
          }
        }
      }
    }

    return target
  }

  applyConfigurationIntoTranscription() {
    // REGEX to deal with stress marks and punctuations
    const regexToExtractStressMarks = /[ˈˌ]+/g
    // Words that may have punctuations
    const splitText = this._text.split(" ")
    const wordsFromText = splitText.map(dirtyWord => dirtyWord.trim())
    // What will be returned
    const changedTranscription = []
    // Filling changedTranscription array with data
    for (const [index, word] of wordsFromText.entries()) {
      const wordDetails = this._transcriptionSetup[index]
      const changedWord = { word }
      const changedEntries = []
      if (wordDetails.entries) {
        wordDetails.entries.forEach(transcription => {
          const changedTranscription = {}
          Object.assign(changedTranscription, transcription)
          if (!this._showStress) {
            changedTranscription.phonemic = transcription.phonemic?.replace(regexToExtractStressMarks, "")
            changedTranscription.phonemic_syllables = transcription.phonemic_syllables?.replace(regexToExtractStressMarks, "")
            changedTranscription.phonetic = transcription.phonetic?.replace(regexToExtractStressMarks, "")
            changedTranscription.phonetic_syllables = transcription.phonetic_syllables?.replace(regexToExtractStressMarks, "")
          }
          if (this._showPunctuations) {
            changedTranscription.phonemic = this._applyPunctuation(word, changedTranscription.phonemic)
            changedTranscription.phonetic = this._applyPunctuation(word, changedTranscription.phonetic)
          }
          // By default, they come with a space separator between each phoneme
          changedTranscription.phonemic?.replace(this._default_phoneme_separator, this._phoneme_separator)
          changedTranscription.phonetic?.replace(this._default_phoneme_separator, this._phoneme_separator)
          changedEntries.push(changedTranscription)
        })
      }
      changedWord.entries = changedEntries
      changedTranscription.push(changedWord)
    }

    return changedTranscription
  }
}
