import { transcribe } from "../../../../src/services/rop-api"

xdescribe("Rave of Phonetics API Service", () => {
  it("Should transcribe RAVE LIVE PHONETICS", async () => {
    // Arrange
    const words = ["rave", "live", "phonetics"]
    const language = "en-us"
    const token = "fake-token"

    // Act
    const result = await transcribe(words, language, token)

    // Assert
    expect(result).toHaveLength(3)
    const raveDetails = result[0]
    const liveDetails = result[1]
    const phoneticsDetails = result[2]
    expect(raveDetails.word).toEqual(words[0])
    expect(raveDetails.entries).toHaveLength(1)
    expect(raveDetails.entries[0]).toMatchObject({
      classification: "Undefined",
      version: "Version 1",
      phonemic: "ɹ eɪ v",
      phonemic_syllables: "ɹ eɪ v",
      phonetic: null,
      phonetic_syllables: null,
    })
    expect(liveDetails.word).toEqual(words[1])
    expect(liveDetails.entries).toHaveLength(2)
    expect(liveDetails.entries).toMatchObject([
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
    ])
    expect(phoneticsDetails.word).toEqual(words[2])
    expect(phoneticsDetails.entries).toHaveLength(1)
    expect(phoneticsDetails.entries).toMatchObject([
      {
        classification: "Undefined",
        version: "Version 1",
        phonemic: "f ə ˈn ɛ t ɪ k s",
        phonemic_syllables: "f ə • ˈn ɛ • t ɪ k s",
        phonetic: null,
        phonetic_syllables: null,
      },
    ])
  })
})
