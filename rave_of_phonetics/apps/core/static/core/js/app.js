"use strict";
var $ = document.querySelector.bind(document)
const transcriptController = new TranscriptController()

// document.querySelector('select')
//     .addEventListener('click', event => transcriptController.speak(event))


// transcriptController._formMain.addEventListener("submit", transcriptController.speak.bind(transcriptController))
transcriptController._buttonPlayOrStop.addEventListener("click", transcriptController.speak.bind(transcriptController))
transcriptController._inputPitch.addEventListener("change", ev => transcriptController._pitchValue.textContent = transcriptController._inputPitch.value)
transcriptController._inputRate.addEventListener("change", ev => transcriptController._rateValue.textContent = transcriptController._inputRate.value)
