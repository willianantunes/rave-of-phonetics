import { TranscriptionDetails } from "../../../../src/domains/TranscriptionDetails"

test("Should create text configuration domain", () => {
  const sampleTranscriptionDetails = [{ word: "Jafar", phone: "dʒˈæfɑːɹ" }]
  const transcriptionDetails = new TranscriptionDetails(null, "Jafar", "en-us", "dʒæfɑːɹ", true, sampleTranscriptionDetails)

  expect(transcriptionDetails.createdAt).toBeDefined()
  expect(transcriptionDetails.text).toBe("Jafar")
  expect(transcriptionDetails.language).toBe("en-us")
  expect(transcriptionDetails.transcription).toBe("dʒæfɑːɹ")
  expect(transcriptionDetails.withStress).toBe(true)
  expect(transcriptionDetails.transcriptionSetup).toBe(sampleTranscriptionDetails)
})
