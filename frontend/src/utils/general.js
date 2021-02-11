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
