import { extractWordsFromText } from "../../../../src/utils/tokenization"

describe(`Words extraction`, () => {
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
