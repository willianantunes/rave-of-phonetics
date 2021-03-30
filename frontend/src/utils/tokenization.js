export function extractWordsFromText(text) {
  // This is only for EN-US and EN-GB
  const regexToExtractWords = /([\w'-])+/g
  return text.match(regexToExtractWords).map(value => value.toLowerCase())
}
