export function extractWordsFromText(text) {
  const regexToExtractWordsAndEmojis = /([\w’'\-\u00a9\u00ae\u2000-\u3300\ud83c\ud000-\udfff\ud83d\ud000-\udfff\ud83e\ud000-\udfff])+/g
  return text.match(regexToExtractWordsAndEmojis).map(value => value.toLowerCase())
}

export function extractRawWordsFromText(text) {
  const splitText = text.split(" ")
  return splitText.filter(entry => entry).map(dirtyWord => dirtyWord.trim())
}
