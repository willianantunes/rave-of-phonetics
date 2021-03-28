export class TranscriptionDetails {
  constructor(
    _id,
    _text,
    _language,
    _transcription,
    _showStress,
    _showSyllables,
    _showPunctuations,
    _showPhonetic,
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
      _showPhonetic,
      _transcriptionSetup,
      _phoneme_separator,
    })
    if (_createdAt) this._createdAt = _createdAt
    else this._createdAt = new Date()
    this._default_phoneme_separator = / /g
    this._cleanedWords = this._extractCleanedWordsFromText()
    if (this._transcriptionSetup) {
      this._refreshedTranscriptionSetup = this._applyConfigurationIntoTranscription()
      this._singleLineTranscription = this._collectSingleLineTranscription()
    }
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

  get showPhonetic() {
    return this._showPhonetic
  }

  get transcriptionSetup() {
    return this._transcriptionSetup
  }

  get refreshedTranscriptionSetup() {
    return this._refreshedTranscriptionSetup
  }

  get singleLineTranscription() {
    return this._singleLineTranscription
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

  equals(target) {
    return JSON.stringify(this) === JSON.stringify(target)
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

  _applyConfigurationIntoTranscription() {
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
          changedTranscription.phonemic = changedTranscription.phonemic?.replace(
            this._default_phoneme_separator,
            this._phoneme_separator
          )
          changedTranscription.phonetic = changedTranscription.phonetic?.replace(
            this._default_phoneme_separator,
            this._phoneme_separator
          )
          // Filling
          changedEntries.push(changedTranscription)
        })
      }
      changedWord.entries = changedEntries
      changedTranscription.push(changedWord)
    }

    return changedTranscription
  }

  _collectSingleLineTranscription() {
    const collectPhoneticSyllables = this._showPhonetic && this._showSyllables
    const collectPhonemicSyllables = !this._showPhonetic && this._showSyllables
    const collectOnlyPhonetic = this._showPhonetic && !this._showSyllables
    const phoneCollector = transcription => {
      if (collectPhoneticSyllables) return transcription?.phonetic_syllables
      if (collectPhonemicSyllables) return transcription?.phonemic_syllables
      if (collectOnlyPhonetic) return transcription?.phonetic

      return transcription?.phonemic
    }
    // What will be returned
    const phones = []

    for (const wordSetup of this._refreshedTranscriptionSetup) {
      if (wordSetup.entries && wordSetup.entries.length > 0) {
        // This is needed because a given word can have more than one setup, like LIVE
        // TODO: Filter may return more than one item
        const selectedEntry = wordSetup.entries.filter(entry => !!entry.selected)
        if (selectedEntry.length === 1) {
          // What the user chose
          const collectedPhone = phoneCollector(selectedEntry)
          phones.push(collectedPhone)
        } else {
          // Just the first one
          const collectedPhone = phoneCollector(wordSetup.entries[0])
          phones.push(collectedPhone)
        }
      } else {
        // Simply use the word otherwise
        phones.push(wordSetup.word)
      }
    }

    return phones.reduce((accumulator, currentValue) => accumulator + " " + currentValue)
  }
}
