const regexNegationToExtractWordsAndEmojis = /([^\w’'\-\u00a9\u00ae\u2000-\u3300\ud83c\ud000-\udfff\ud83d\ud000-\udfff\ud83e\ud000-\udfff])+/g

export function extractRawWordsAndTheirTokensFromText(text) {
  const splitText = text.split(" ")

  return splitText
    .filter(entry => entry)
    .map(dirtyWord => dirtyWord.trim())
    .map(cleanedWord => {
      const token = cleanedWord.toLowerCase().replace(regexNegationToExtractWordsAndEmojis, "")
      return { raw: cleanedWord, token: token ? token : null }
    })
}

export function extractTokensFromText(text) {
  const tokens = extractRawWordsAndTheirTokensFromText(text)
  return tokens.map(({ raw, token }) => (token ? token : raw.toLowerCase()))
}
