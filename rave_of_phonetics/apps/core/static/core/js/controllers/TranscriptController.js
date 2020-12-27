import {WebSpeechAPI} from "../services/WebSpeechAPI";
import {BindModelView} from "../services/BindModelView";
import {Message} from "../domain/Message";
import {TextHistory} from "../domain/TextHistory";
import {HistoryView} from "../ui/HistoryView";
import {MessageView} from "../ui/MessageView";
import {TextConfiguration} from "../domain/TextConfiguration";
import {checkedRadioValue} from "../utils/forms";

export class TranscriptController {
    constructor() {
        // All inputs
        this._inputTextToBeTranscribed = $('textarea[name=text-to-be-transcribed]');
        this._inputPitch = $('input[name=pitch]');
        this._inputRate = $('input[name=rate]');
        this._inputLanguage = $$('input[name=chosen-language]')
        this._selectVoice = $('select[name=available-voices]');
        // Buttons
        this._buttonPlayOrStop = $('button[name=play]');
        this._buttonClearHistory = $('button[name=clear-history]');
        // Values
        this._pitchValue = $('.pitch-value');
        this._rateValue = $('.rate-value');
        // Services
        this._webSpeechAPI = new WebSpeechAPI((voices) => this._populateVoiceList(voices), () => this._drawAsSpeechSpeaking(), () => this._drawAsSpeechIsAvailable())
        // Models and Views
        this._textHistory = new BindModelView(new TextHistory(), new HistoryView(".history"), "add", "erase")
        this._message = new BindModelView(new Message(), new MessageView('.custom-message'), "text")
    }

    _drawAsSpeechSpeaking() {
        this._buttonPlayOrStop.innerText = "Stop"
        this._buttonPlayOrStop.className = "speech-speaking"
    }

    _drawAsSpeechIsAvailable() {
        this._buttonPlayOrStop.innerText = "Play"
        this._buttonPlayOrStop.className = "speech-play"
    }

    speak(event) {
        event.preventDefault()

        if (this._buttonPlayOrStop.className === "speech-play") {
            if (this._inputTextToBeTranscribed.value !== '') {
                const textConfiguration = new TextConfiguration(null,
                    this._inputTextToBeTranscribed.value,
                    checkedRadioValue(this._inputLanguage),
                    this._inputPitch.value,
                    this._inputRate.value)

                const selectedVoice = this._selectVoice.selectedOptions[0] ? this._selectVoice.selectedOptions[0].getAttribute('data-name') : null
                this._webSpeechAPI.speechWith(textConfiguration.text, textConfiguration.language, textConfiguration.pitch, textConfiguration.rate, selectedVoice)
                this._textHistory.add(textConfiguration)
            } else {
                this._message.text = '👀 Please write something first 😉';
            }
        } else {
            this._webSpeechAPI.stopSpeakingImmediately()
        }
    }

    _populateVoiceList(voices) {
        if (!this._selectVoice.hasChildNodes()) {
            voices.filter(voice => voice.lang === "en-US" || voice.lang === "en" || voice.lang === "en-GB")
                .forEach((voice, index) => {
                    const option = document.createElement('option');
                    option.textContent = voice.name + ' (' + voice.lang + ')';
                    if (voice.default) {
                        option.textContent += ' (default)';
                    }
                    option.setAttribute('data-lang', voice.lang);
                    option.setAttribute('data-name', voice.name);
                    this._selectVoice.appendChild(option);
                })
        }
    }

    _cleanWarnings() {
        this._message.text = null
    }

    _clearHistory(event) {
        event.preventDefault()
        this._textHistory.erase()
    }
}
