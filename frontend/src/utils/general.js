export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export function copyToClipboard(text) {
  const temporaryTextArea = document.createElement("textarea")
  temporaryTextArea.innerText = text
  document.body.appendChild(temporaryTextArea)
  temporaryTextArea.select()
  document.execCommand("copy")
  console.log("Copied!")
  temporaryTextArea.remove()
}

export function slugify(word, separator = "-") {
  return (
    word
      .toString()
      // split an accented letter in the base letter and the acent
      .normalize("NFD")
      // Remove all previously split accents
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim()
      // remove all chars not letters, numbers and spaces (to be replaced)
      .replace(/[^a-z0-9 ]/g, "")
      .replace(/\s+/g, separator)
  )
}
