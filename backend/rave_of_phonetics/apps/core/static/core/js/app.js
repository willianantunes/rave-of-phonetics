import {PageLayoutController, TranscriptController} from "./controllers/index";
import {$} from "./utils/dom";

const transcriptControllerIsNeeded = document.body.contains($('.transcript-section'));

new PageLayoutController()

if (transcriptControllerIsNeeded) {
    const textToSpeechSection = $('.text-to-speech-section')
    const isTextToSpeechSectionDrawn = document.body.contains(textToSpeechSection)
    new TranscriptController(isTextToSpeechSectionDrawn)
}


