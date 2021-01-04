import {TranscriptController} from "./controllers/TranscriptController";
import {$} from "./utils/dom";

const textToSpeechSection = $('.text-to-speech-section')
const isTextToSpeechSectionDrawn = document.body.contains(textToSpeechSection)

new TranscriptController(isTextToSpeechSectionDrawn)
