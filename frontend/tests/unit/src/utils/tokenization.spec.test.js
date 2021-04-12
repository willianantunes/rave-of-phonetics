import { extractRawWordsAndTheirTokensFromText, extractTokensFromText } from "../../../../src/utils/tokenization"

describe("Tokenization", () => {
  describe("Words extraction", () => {
    test(`When with text "Rave, live Phonetics!" including line feed, then 3 words is extracted`, () => {
      // Arrange
      const sampleText = "Rave, live Phonetics!"
      // Act
      const result = extractTokensFromText(sampleText)
      // Assert
      expect(result).toHaveLength(3)
      expect(result).toMatchObject(["rave", "live", "phonetics"])
    })

    test(`When with text "Don't ever, if "you; please, ad-hoc 1989!", then 7 words is extracted`, () => {
      // Arrange
      const sampleText = `Don't ever, if "you; please, ad-hoc 1989!`
      // Act
      const result = extractTokensFromText(sampleText)
      // Assert
      expect(result).toHaveLength(7)
      expect(result).toMatchObject(["don't", "ever", "if", "you", "please", "ad-hoc", "1989"])
    })

    test(`When with text "Until her father’s health" or "Until her father's health", then 4 words is extracted`, () => {
      // Arrange
      const sampleTextOne = `Until her father’s health`
      const sampleTextTwo = `Until her father's health`
      // Act
      const resultOne = extractTokensFromText(sampleTextOne)
      const resultTwo = extractTokensFromText(sampleTextTwo)
      // Assert
      expect(resultOne).toStrictEqual(["until", "her", "father’s", "health"])
      expect(resultTwo).toMatchObject(["until", "her", "father's", "health"])
    })

    test(`When with text "Frequently asked questions 🤔", then 7 words is extracts (even the emoji)`, () => {
      // Arrange
      const sampleText = `😎 Frequently 🤔 asked 🥵 questions 🤬`
      // Act
      const result = extractTokensFromText(sampleText)
      // Assert
      expect(result).toStrictEqual(["😎", "frequently", "🤔", "asked", "🥵", "questions", "🤬"])
    })

    test(`When with text "We, are checking! here @", then 5 words is extracts (even the emoji)`, () => {
      // Arrange
      const sampleText = `We, are checking! here @`
      // Act
      const result = extractTokensFromText(sampleText)
      // Assert
      expect(result).toStrictEqual(["we", "are", "checking", "here", "@"])
    })
  })

  describe("Raw words extraction", () => {
    test("When with SCENARIO 1, then 3 objects is extracted", () => {
      // Arrange
      const sampleText = " Rave, live Phonetics!"
      // Act
      const result = extractRawWordsAndTheirTokensFromText(sampleText)
      // Assert
      expect(result).toHaveLength(3)
      expect(result).toMatchObject([
        {
          raw: "Rave,",
          token: "rave",
        },
        {
          raw: "live",
          token: "live",
        },
        {
          raw: "Phonetics!",
          token: "phonetics",
        },
      ])
    })

    test("When with SCENARIO 2, then 5 objects is extracted", () => {
      // Arrange
      const sampleText = ` Rave,     OF\n live \r\nPhonetics! @antunes\r\n\r\n`
      // Act
      const result = extractRawWordsAndTheirTokensFromText(sampleText)
      // Assert
      expect(result).toHaveLength(5)
      expect(result).toMatchObject([
        {
          raw: "Rave,",
          token: "rave",
        },
        {
          raw: "OF",
          token: "of",
        },
        {
          raw: "live",
          token: "live",
        },
        {
          raw: "Phonetics!",
          token: "phonetics",
        },
        {
          raw: "@antunes",
          token: "antunes",
        },
      ])
    })

    test("When with SCENARIO 3, then 7 objects is extracted", () => {
      // Arrange
      const sampleText = `😎 Frequently 🤔 asked 🥵 questions 🤬`
      // Act
      const result = extractRawWordsAndTheirTokensFromText(sampleText)
      // Assert
      expect(result).toHaveLength(7)
      expect(result).toMatchObject([
        {
          raw: "😎",
          token: "😎",
        },
        {
          raw: "Frequently",
          token: "frequently",
        },
        {
          raw: "🤔",
          token: "🤔",
        },
        {
          raw: "asked",
          token: "asked",
        },
        {
          raw: "🥵",
          token: "🥵",
        },
        {
          raw: "questions",
          token: "questions",
        },
        {
          raw: "🤬",
          token: "🤬",
        },
      ])
    })

    test("When with SCENARIO 4, then 7 objects is extracted", () => {
      // Arrange
      const sampleText = `Don't ever, if "you; please, ad-hoc 1989!`
      // Act
      const result = extractRawWordsAndTheirTokensFromText(sampleText)
      // Assert
      expect(result).toHaveLength(7)
      expect(result).toMatchObject([
        {
          raw: "Don't",
          token: "don't",
        },
        {
          raw: "ever,",
          token: "ever",
        },
        {
          raw: "if",
          token: "if",
        },
        {
          raw: `"you;`,
          token: "you",
        },
        {
          raw: "please,",
          token: "please",
        },
        {
          raw: "ad-hoc",
          token: "ad-hoc",
        },
        {
          raw: "1989!",
          token: "1989",
        },
      ])
    })

    test("When with SCENARIO 5, then 5 objects is extracted", () => {
      // Arrange
      const sampleText = `We, are checking! here @`
      // Act
      const result = extractRawWordsAndTheirTokensFromText(sampleText)
      // Assert
      expect(result).toHaveLength(5)
      expect(result).toMatchObject([
        {
          raw: "We,",
          token: "we",
        },
        {
          raw: "are",
          token: "are",
        },
        {
          raw: "checking!",
          token: "checking",
        },
        {
          raw: "here",
          token: "here",
        },
        {
          raw: "@",
          token: null,
        },
      ])
    })

    test("When with SCENARIO 6, then X objects is extracted", () => {
      // Arrange
      const sampleText = `The 2015 Boat Races took place on 11 April. The Boat Race is an annual side-by-side rowing race between crews from the universities of Oxford and Cambridge along a 4.2-mile (6.8 km) tidal stretch of the River Thames`
      // Act
      const result = extractRawWordsAndTheirTokensFromText(sampleText)
      // Assert
      expect(result).toHaveLength(38)
      expect(result).toMatchObject([
        {
          raw: "The",
          token: "the",
        },
        {
          raw: "2015",
          token: "2015",
        },
        {
          raw: "Boat",
          token: "boat",
        },
        {
          raw: "Races",
          token: "races",
        },
        {
          raw: "took",
          token: "took",
        },
        {
          raw: "place",
          token: "place",
        },
        {
          raw: "on",
          token: "on",
        },
        {
          raw: "11",
          token: "11",
        },
        {
          raw: "April.",
          token: "april",
        },
        {
          raw: "The",
          token: "the",
        },
        {
          raw: "Boat",
          token: "boat",
        },
        {
          raw: "Race",
          token: "race",
        },
        {
          raw: "is",
          token: "is",
        },
        {
          raw: "an",
          token: "an",
        },
        {
          raw: "annual",
          token: "annual",
        },
        {
          raw: "side-by-side",
          token: "side-by-side",
        },
        {
          raw: "rowing",
          token: "rowing",
        },
        {
          raw: "race",
          token: "race",
        },
        {
          raw: "between",
          token: "between",
        },
        {
          raw: "crews",
          token: "crews",
        },
        {
          raw: "from",
          token: "from",
        },
        {
          raw: "the",
          token: "the",
        },
        {
          raw: "universities",
          token: "universities",
        },
        {
          raw: "of",
          token: "of",
        },
        {
          raw: "Oxford",
          token: "oxford",
        },
        {
          raw: "and",
          token: "and",
        },
        {
          raw: "Cambridge",
          token: "cambridge",
        },
        {
          raw: "along",
          token: "along",
        },
        {
          raw: "a",
          token: "a",
        },
        {
          raw: "4.2-mile",
          token: "42-mile",
        },
        {
          raw: "(6.8",
          token: "68",
        },
        {
          raw: "km)",
          token: "km",
        },
        {
          raw: "tidal",
          token: "tidal",
        },
        {
          raw: "stretch",
          token: "stretch",
        },
        {
          raw: "of",
          token: "of",
        },
        {
          raw: "the",
          token: "the",
        },
        {
          raw: "River",
          token: "river",
        },
        {
          raw: "Thames",
          token: "thames",
        },
      ])
    })
  })
})
