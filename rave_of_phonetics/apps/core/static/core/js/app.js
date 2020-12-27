import {TranscriptController} from "./controllers/TranscriptController";

const transcriptController = new TranscriptController()

transcriptController._inputTextToBeTranscribed.addEventListener("focus", transcriptController._cleanWarnings.bind(transcriptController))
transcriptController._inputPitch.addEventListener("change", ev => transcriptController._pitchValue.textContent = transcriptController._inputPitch.value)
transcriptController._inputRate.addEventListener("change", ev => transcriptController._rateValue.textContent = transcriptController._inputRate.value)

transcriptController._buttonPlayOrStop.addEventListener("click", transcriptController.speak.bind(transcriptController))
transcriptController._buttonClearHistory.addEventListener("click", transcriptController._clearHistory.bind(transcriptController))

// window.onbeforeunload = () => {
// # TODO: Ask if he/she is sure about that
//     transcriptController._webSpeechAPI.stop()
// }
