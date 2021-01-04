import {WebSpeechAPI} from "../services/WebSpeechAPI";
import {BindModelView} from "../services/BindModelView";
import {Message} from "../domain/Message";
import {TextHistory} from "../domain/TextHistory";
import {HistoryView} from "../ui/HistoryView";
import {TextConfiguration} from "../domain/TextConfiguration";
import {$, $$, checkedRadioValue} from "../utils/dom";
import {ToastView} from "../ui/ToastView";

export class TranscriptController {
    constructor(isTextToSpeechSectionDrawn) {
        if(isTextToSpeechSectionDrawn) {
            // Services
            this._webSpeechAPI = new WebSpeechAPI((voices) => this._populateVoiceList(voices), () => this._drawAsSpeechSpeaking(), () => this._drawAsSpeechIsAvailable())
            // Views
            this._deviceUnsupportedWarning = $('p.tts-device-unsupported')
            this._ttsSelection = $('.tts-selection')
        }
        // All inputs
        this._inputTextToBeTranscribed = $('textarea[name=text-to-be-transcribed]');
        this._inputPitch = $('input[name=pitch]');
        this._inputRate = $('input[name=rate]');
        this._inputLanguage = $$('input[name=chosen-language]')
        this._selectVoice = $('select[name=available-voices]');
        // Buttons
        this._buttonPlayOrStop = $('a.play-tts');
        this._buttonClearHistory = $('a.clear-history');
        // Values
        this._pitchValue = $('.pitch-value');
        this._rateValue = $('.rate-value');
        // Models and Views
        this._textHistory = new BindModelView(new TextHistory(), new HistoryView(".history-table", ".history-actions"), "add", "erase")
        this._message = new BindModelView(new Message(), new ToastView(), "text")
        // Events
        this._initAllEvents(isTextToSpeechSectionDrawn)
    }

    _initAllEvents(isTextToSpeechSectionDrawn) {
        this._buttonClearHistory.addEventListener("click", (e) => this.clearHistory(e))
        if (isTextToSpeechSectionDrawn) {
            this._buttonPlayOrStop.addEventListener("click", (e) => this.speak(e))
        }
    }

    _drawAsSpeechSpeaking() {
        this._buttonPlayOrStop.innerHTML = `<i class="material-icons right">stop</i>Stop`
        this._buttonPlayOrStop.className = "waves-effect waves-light btn play-tts speech-speaking"
    }

    _drawAsSpeechIsAvailable() {
        this._buttonPlayOrStop.innerHTML = `<i class="material-icons right">play_arrow</i>Play`
        this._buttonPlayOrStop.className = "waves-effect waves-light btn play-tts speech-play"
    }

    speak(event) {
        event.preventDefault()

        if (this._buttonPlayOrStop.classList.contains("speech-play")) {
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
                this._message.text = 'Please write something first 😉! Go up and do the thing 💪';
            }
        } else {
            this._webSpeechAPI.stopSpeakingImmediately()
        }
    }

    _populateVoiceList(voices) {
        if (this._selectVoice.length === 0) {
            this._ttsSelection.style.display = 'block'
            this._deviceUnsupportedWarning.style.display = 'none'
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

    clearHistory(event) {
        event.preventDefault()
        this._textHistory.erase()
    }
}
