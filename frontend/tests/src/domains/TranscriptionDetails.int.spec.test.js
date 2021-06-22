import { createTranscriptionDetails } from "../../support/domain-utils"

describe("Transcription domain", () => {
  describe(`Punctuation and stress marks`, () => {
    test(`When with default options: scenario 1`, () => {
      // Arrange
      const transcriptionDetails = createTranscriptionDetails()
      // Act
      const transcription = transcriptionDetails.refreshedTranscriptionSetup
      const phones = transcriptionDetails.singleLineTranscription
      // Assert
      expect(phones).toStrictEqual(`ɹeɪv laɪv fənɛtɪks`)
      expect(transcription).toMatchObject([
        {
          word: "Rave,",
          entries: [
            {
              classification: "Undefined",
              version: "Version 1",
              phonemic: "ɹeɪv",
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
              phonemic: "laɪv",
              phonemic_syllables: "l aɪ v",
            },
            {
              classification: "Undefined",
              version: "Version 2",
              phonemic: "lɪv",
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
              phonemic: "fənɛtɪks",
              phonemic_syllables: "f ə • n ɛ • t ɪ k s",
            },
          ],
        },
      ])
    })

    test(`When show punctuations is true, should preserve them in transcription: scenario 1`, () => {
      // Arrange
      const showPunctuations = true
      const transcriptionDetails = createTranscriptionDetails({ showPunctuations })
      // Act
      const transcription = transcriptionDetails.refreshedTranscriptionSetup
      const phones = transcriptionDetails.singleLineTranscription
      // Assert
      expect(phones).toStrictEqual("ɹeɪv, laɪv fənɛtɪks!")
      expect(transcription).toMatchObject([
        {
          word: "Rave,",
          entries: [
            {
              classification: "Undefined",
              version: "Version 1",
              phonemic: "ɹeɪv,",
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
              phonemic: "laɪv",
              phonemic_syllables: "l aɪ v",
            },
            {
              classification: "Undefined",
              version: "Version 2",
              phonemic: "lɪv",
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
              phonemic: "fənɛtɪks!",
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
      const transcriptionSetup = {
        "don't": [
          {
            classification: "Undefined",
            version: "Version 1",
            phonemic: "d oʊ n t",
            phonemic_syllables: "d oʊ n t",
            phonetic: null,
            phonetic_syllables: null,
          },
        ],
        ever: [
          {
            classification: "Undefined",
            version: "Version 1",
            phonemic: "ˈɛ v ər",
            phonemic_syllables: "ˈɛ • v ər",
            phonetic: null,
            phonetic_syllables: null,
          },
        ],
        if: [
          {
            classification: "Undefined",
            version: "Version 1",
            phonemic: "ɪ f",
            phonemic_syllables: "ɪ f",
            phonetic: null,
            phonetic_syllables: null,
          },
        ],
        you: [
          {
            classification: "Undefined",
            version: "Version 1",
            phonemic: "j u",
            phonemic_syllables: "j u",
            phonetic: null,
            phonetic_syllables: null,
          },
        ],
        please: [
          {
            classification: "Undefined",
            version: "Version 1",
            phonemic: "p l i z",
            phonemic_syllables: "p l i z",
            phonetic: null,
            phonetic_syllables: null,
          },
        ],
        "ad-hoc": [
          {
            classification: "Undefined",
            version: "Version 1",
            phonemic: "ˈæ ˈd h ɑ k",
            phonemic_syllables: "ˈæ ˈd • h ɑ k",
            phonetic: null,
            phonetic_syllables: null,
          },
        ],
        1989: null,
      }

      const transcriptionDetails = createTranscriptionDetails({ text, transcriptionSetup, showPunctuations })
      // Act
      const transcription = transcriptionDetails.refreshedTranscriptionSetup
      const phones = transcriptionDetails.singleLineTranscription
      // Assert
      expect(phones).toStrictEqual(`doʊnt ɛvər, ɪf "ju; pliz, ædhɑk 1989!`)
      expect(transcription).toMatchObject([
        {
          word: "Don't",
          entries: [
            {
              classification: "Undefined",
              version: "Version 1",
              phonemic: "doʊnt",
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
              phonemic: "ɛvər,",
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
              phonemic: "ɪf",
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
              phonemic: `"ju;`,
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
              phonemic: "pliz,",
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
              phonemic: "ædhɑk",
              phonemic_syllables: "æ d • h ɑ k",
            },
          ],
        },
        { word: "1989!" },
      ])
    })
  })
})
