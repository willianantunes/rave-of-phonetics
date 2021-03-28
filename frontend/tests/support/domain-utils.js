import { TranscriptionDetails } from "../../src/domains/TranscriptionDetails"

export function createTranscriptionDetails(
  text,
  {
    language = "en-us",
    showStress = false,
    showSyllables = false,
    showPunctuations = false,
    showPhonetic = false,
    transcriptionSetup = null,
  } = {}
) {
  return new TranscriptionDetails(
    null,
    text,
    language,
    null,
    showStress,
    showSyllables,
    showPunctuations,
    showPhonetic,
    transcriptionSetup
  )
}
