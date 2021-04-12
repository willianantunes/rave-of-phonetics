import { TranscriptionDetails } from "../../src/domains/TranscriptionDetails"

export function createTranscriptionDetails({
  id = null,
  text = "Rave, live Phonetics!",
  language = "en-us",
  showStress = false,
  showSyllables = false,
  showPunctuations = false,
  showPhonetic = false,
  transcriptionSetup = {
    rave: [
      {
        classification: "Undefined",
        version: "Version 1",
        phonemic: "ɹ eɪ v",
        phonemic_syllables: "ɹ eɪ v",
        phonetic: null,
        phonetic_syllables: null,
      },
    ],
    live: [
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
    phonetics: [
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
} = {}) {
  return new TranscriptionDetails(
    id,
    text,
    language,
    showStress,
    showSyllables,
    showPunctuations,
    showPhonetic,
    transcriptionSetup
  )
}
