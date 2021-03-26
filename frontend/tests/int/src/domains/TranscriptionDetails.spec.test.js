import { createTranscriptionDetails } from "../../../support/domain-utils"

describe("Transcription domain", () => {
  describe(`Words extraction`, () => {
    test(`When with text "Rave, \r\nlive Phonetics!", then 3 words is extracted`, () => {
      // Arrange
      const text = "Rave, live Phonetics!"
      // Act
      const transcriptionDetails = createTranscriptionDetails(text)
      // Assert
      const cleanedWords = transcriptionDetails.cleanedWords
      expect(cleanedWords).toHaveLength(3)
      expect(cleanedWords).toMatchObject(["rave", "live", "phonetics"])
    })

    test(`When with text "Don't ever, if "you; please, ad-hoc 1989!", then 7 words is extracted`, () => {
      // Arrange
      const text = `Don't ever, if "you; please, ad-hoc 1989!`
      // Act
      const transcriptionDetails = createTranscriptionDetails(text)
      // Assert
      const cleanedWords = transcriptionDetails.cleanedWords
      expect(cleanedWords).toHaveLength(7)
      expect(cleanedWords).toMatchObject(["don't", "ever", "if", "you", "please", "ad-hoc", "1989"])
    })
  })

  describe(`Punctuation and stress marks`, () => {
    test(`When show punctuations is true, should preserve them in transcription: scenario 1`, () => {
      // Arrange
      const text = "Rave, live Phonetics!"
      const showPunctuations = true
      const transcriptionSetup = [
        {
          word: "rave",
          entries: [
            {
              classification: "Undefined",
              version: "Version 1",
              phonemic: "ɹ eɪ v",
              phonemic_syllables: "ɹ eɪ v",
              phonetic: null,
              phonetic_syllables: null,
            },
          ],
        },
        {
          word: "live",
          entries: [
            {
              classification: "Undefined",
              version: "Version 1",
              phonemic: "l aɪ v",
              phonemic_syllables: "l aɪ v",
              phonetic: null,
              phonetic_syllables: null,
            },
            {
              classification: "Undefined",
              version: "Version 2",
              phonemic: "l ɪ v",
              phonemic_syllables: "l ɪ v",
              phonetic: null,
              phonetic_syllables: null,
            },
          ],
        },
        {
          word: "phonetics",
          entries: [
            {
              classification: "Undefined",
              version: "Version 1",
              phonemic: "f ə ˈn ɛ t ɪ k s",
              phonemic_syllables: "f ə • ˈn ɛ • t ɪ k s",
              phonetic: null,
              phonetic_syllables: null,
            },
          ],
        },
      ]
      const transcriptionDetails = createTranscriptionDetails(text, { transcriptionSetup, showPunctuations })
      // Act
      const result = transcriptionDetails.applyConfigurationIntoTranscription()
      // Assert
      expect(result).toMatchObject([
        {
          word: "Rave,",
          entries: [
            {
              classification: "Undefined",
              version: "Version 1",
              phonemic: "ɹ eɪ v,",
              phonemic_syllables: "ɹ eɪ v",
            },
          ],
        },
        {
          word: "live",
          entries: [
            {
              classification: "Undefined",
              version: "Version 1",
              phonemic: "l aɪ v",
              phonemic_syllables: "l aɪ v",
            },
            {
              classification: "Undefined",
              version: "Version 2",
              phonemic: "l ɪ v",
              phonemic_syllables: "l ɪ v",
            },
          ],
        },
        {
          word: "Phonetics!",
          entries: [
            {
              classification: "Undefined",
              version: "Version 1",
              phonemic: "f ə n ɛ t ɪ k s!",
              phonemic_syllables: "f ə • n ɛ • t ɪ k s",
            },
          ],
        },
      ])
    })

    test(`When show punctuations is true, should preserve them in transcription: scenario 2`, () => {
      // Arrange
      const text = `Don't ever, if "you; please, ad-hoc 1989!`
      const showPunctuations = true
      const transcriptionSetup = [
        {
          word: "don't",
          entries: [
            {
              classification: "Undefined",
              version: "Version 1",
              phonemic: "d oʊ n t",
              phonemic_syllables: "d oʊ n t",
              phonetic: null,
              phonetic_syllables: null,
            },
          ],
        },
        {
          word: "ever",
          entries: [
            {
              classification: "Undefined",
              version: "Version 1",
              phonemic: "ˈɛ v ər",
              phonemic_syllables: "ˈɛ • v ər",
              phonetic: null,
              phonetic_syllables: null,
            },
          ],
        },
        {
          word: "if",
          entries: [
            {
              classification: "Undefined",
              version: "Version 1",
              phonemic: "ɪ f",
              phonemic_syllables: "ɪ f",
              phonetic: null,
              phonetic_syllables: null,
            },
          ],
        },
        {
          word: "you",
          entries: [
            {
              classification: "Undefined",
              version: "Version 1",
              phonemic: "j u",
              phonemic_syllables: "j u",
              phonetic: null,
              phonetic_syllables: null,
            },
          ],
        },
        {
          word: "please",
          entries: [
            {
              classification: "Undefined",
              version: "Version 1",
              phonemic: "p l i z",
              phonemic_syllables: "p l i z",
              phonetic: null,
              phonetic_syllables: null,
            },
          ],
        },
        {
          word: "ad-hoc",
          entries: [
            {
              classification: "Undefined",
              version: "Version 1",
              phonemic: "ˈæ ˈd h ɑ k",
              phonemic_syllables: "ˈæ ˈd • h ɑ k",
              phonetic: null,
              phonetic_syllables: null,
            },
          ],
        },
        { word: "1989", entries: null },
      ]
      const transcriptionDetails = createTranscriptionDetails(text, { transcriptionSetup, showPunctuations })
      // Act
      const result = transcriptionDetails.applyConfigurationIntoTranscription()
      // Assert
      expect(result).toMatchObject([
        {
          word: "Don't",
          entries: [
            {
              classification: "Undefined",
              version: "Version 1",
              phonemic: "d oʊ n t",
              phonemic_syllables: "d oʊ n t",
            },
          ],
        },
        {
          word: "ever,",
          entries: [
            {
              classification: "Undefined",
              version: "Version 1",
              phonemic: "ɛ v ər,",
              phonemic_syllables: "ɛ • v ər",
            },
          ],
        },
        {
          word: "if",
          entries: [
            {
              classification: "Undefined",
              version: "Version 1",
              phonemic: "ɪ f",
              phonemic_syllables: "ɪ f",
            },
          ],
        },
        {
          word: `"you;`,
          entries: [
            {
              classification: "Undefined",
              version: "Version 1",
              phonemic: `"j u;`,
              phonemic_syllables: "j u",
            },
          ],
        },
        {
          word: "please,",
          entries: [
            {
              classification: "Undefined",
              version: "Version 1",
              phonemic: "p l i z,",
              phonemic_syllables: "p l i z",
            },
          ],
        },
        {
          word: "ad-hoc",
          entries: [
            {
              classification: "Undefined",
              version: "Version 1",
              phonemic: "æ d h ɑ k",
              phonemic_syllables: "æ d • h ɑ k",
            },
          ],
        },
        { word: "1989!" },
      ])
    })
  })
})
