"use strict";
var $ = document.querySelector.bind(document)
const transcriptController = new TranscriptController()

// document.querySelector('select')
//     .addEventListener('click', event => transcriptController.speak(event))


transcriptController._inputForm.addEventListener("submit", transcriptController.speak.bind(transcriptController))
