export function extractWordsFromText(text) {
  // This is only for EN-US and EN-GB
  const regexToExtractWords = /([\w’'-])+/g
  return text.match(regexToExtractWords).map(value => value.toLowerCase())
}

export function extractRawWordsFromText(text) {
  const splitText = text.split(" ")
  return splitText.filter(entry => entry).map(dirtyWord => dirtyWord.trim())
}
