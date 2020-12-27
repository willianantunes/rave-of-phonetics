"use strict";
const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const transcriptController = new TranscriptController()

// document.querySelector('select')
//     .addEventListener('click', event => transcriptController.speak(event))


// transcriptController._formMain.addEventListener("submit", transcriptController.speak.bind(transcriptController))
transcriptController._inputTextToBeTranscribed.addEventListener("focus", transcriptController._cleanWarnings.bind(transcriptController))
transcriptController._inputPitch.addEventListener("change", ev => transcriptController._pitchValue.textContent = transcriptController._inputPitch.value)
transcriptController._inputRate.addEventListener("change", ev => transcriptController._rateValue.textContent = transcriptController._inputRate.value)

transcriptController._buttonPlayOrStop.addEventListener("click", transcriptController.speak.bind(transcriptController))
transcriptController._buttonClearHistory.addEventListener("click", transcriptController._clearHistory.bind(transcriptController))

// window.onbeforeunload = () => {
//     transcriptController._webSpeechAPI.stop()
// }
