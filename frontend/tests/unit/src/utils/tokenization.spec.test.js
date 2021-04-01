import { extractRawWordsFromText, extractWordsFromText } from "../../../../src/utils/tokenization"

describe("Tokenization", () => {
  describe("Words extraction", () => {
    test(`When with text "Rave, \r\nlive Phonetics!", then 3 words is extracted`, () => {
      // Arrange
      const sampleText = "Rave, live Phonetics!"
      // Act
      const result = extractWordsFromText(sampleText)
      // Assert
      expect(result).toHaveLength(3)
      expect(result).toMatchObject(["rave", "live", "phonetics"])
    })

    test(`When with text "Don't ever, if "you; please, ad-hoc 1989!", then 7 words is extracted`, () => {
      // Arrange
      const sampleText = `Don't ever, if "you; please, ad-hoc 1989!`
      // Act
      const result = extractWordsFromText(sampleText)
      // Assert
      expect(result).toHaveLength(7)
      expect(result).toMatchObject(["don't", "ever", "if", "you", "please", "ad-hoc", "1989"])
    })
  })

  describe("Raw words extraction", () => {
    test("When with SCENARIO 1, then 3 words is extracted", () => {
      // Arrange
      const sampleText = " Rave, live Phonetics!"
      // Act
      const result = extractRawWordsFromText(sampleText)
      // Assert
      expect(result).toHaveLength(3)
      expect(result).toMatchObject(["Rave,", "live", "Phonetics!"])
    })

    test("When with SCENARIO 2, then 5 words is extracted", () => {
      // Arrange
      const sampleText = ` Rave,     OF\n live \r\nPhonetics! @antunes\r\n\r\n`
      // Act
      const result = extractRawWordsFromText(sampleText)
      // Assert
      expect(result).toHaveLength(5)
      expect(result).toMatchObject(["Rave,", "OF", "live", "Phonetics!", "@antunes"])
    })
  })
})
