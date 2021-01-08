import {WebSpeechAPI} from "../services/WebSpeechAPI";
import {BindModelView} from "../services/BindModelView";
import {Message} from "../domain/Message";
import {TextHistory} from "../domain/TextHistory";
import {HistoryView} from "../ui/HistoryView";
import {TextConfiguration} from "../domain/TextConfiguration";
import {$, $$, checkedRadioValue} from "../utils/dom";
import {ToastView} from "../ui/ToastView";
import {debounce} from "../utils/general";

export class TranscriptController {
    constructor(isTextToSpeechSectionDrawn) {
        // All inputs
        this._inputTextToBeTranscribed = $('textarea[name=text-to-be-transcribed]');
        this._inputPitch = $('input[name=pitch]');
        this._inputRate = $('input[name=rate]');
        this._inputLanguage = $$('input[name=chosen-language]')
        this._selectVoice = $('select[name=available-voices]');
        this._loopSpeech = $('input[name=loop-speech]')
        // All hidden inputs
        this._chosenLanguage = $('input[name=chosen-language-from-transcription]');
        this._chosenText = $('input[name=chosen-text-from-transcription]');
        // Buttons
        this._buttonPlayOrStop = $('a.play-tts');
        this._buttonClearHistory = $('a.clear-history');
        // Values
        this._pitchValue = $('.pitch-value');
        this._rateValue = $('.rate-value');
        // Models and Views
        this._textHistory = new BindModelView(new TextHistory(), new HistoryView(".history-table", ".history-actions"), "add", "erase")
        this._message = new BindModelView(new Message(), new ToastView(), "text")
        // Flow control
        this._ttsWasNotCalled = true
        if (isTextToSpeechSectionDrawn) {
            // Views
            this._deviceUnsupportedWarning = $('p.tts-device-unsupported')
            this._ttsSelection = $('.tts-selection')
            // Services
            this._webSpeechAPI = new WebSpeechAPI((voices) => this._populateVoiceList(voices), () => this._drawAsSpeechSpeaking(), () => this._drawAsSpeechIsAvailable())
            this._webSpeechAPI = new WebSpeechAPI((voices) => this._populateVoiceList(voices), () => this._drawAsSpeechSpeaking(), () => this._drawAsSpeechIsAvailable())
        }
        // Events
        this._initAllEvents(isTextToSpeechSectionDrawn)
    }

    _initAllEvents(isTextToSpeechSectionDrawn) {
        this._buttonClearHistory.addEventListener("click", (e) => this.clearHistory(e))
        if (isTextToSpeechSectionDrawn) {
            this._buttonPlayOrStop.addEventListener("click", debounce(() => this.speak()))
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

    _drawAsSpeechLoading() {
        this._buttonPlayOrStop.innerHTML = `<i class="material-icons right">sync</i>Loading</a>`
    }

    speak() {
        if (this._buttonPlayOrStop.classList.contains("speech-play")) {
            if (this._chosenText.value !== '') {
                const textConfiguration = new TextConfiguration(null,
                    this._chosenText.value,
                    checkedRadioValue(this._inputLanguage),
                    this._inputPitch.value,
                    this._inputRate.value)

                const selectedVoice = this._selectVoice.selectedOptions[0] ? this._selectVoice.selectedOptions[0].getAttribute('data-name') : null
                const loopSpeech = this._loopSpeech.checked
                this._webSpeechAPI.speechWith(textConfiguration.text, textConfiguration.language, textConfiguration.pitch, textConfiguration.rate, selectedVoice, loopSpeech)
                if (this._ttsWasNotCalled) {
                    this._textHistory.add(textConfiguration)
                    this._ttsWasNotCalled = false
                }
            } else {
                this._message.text = 'Please write something first 😉! Go up and do the thing 💪';
            }
        } else {
            this._webSpeechAPI.stopSpeakingImmediately()
        }
    }

    _populateVoiceList(voices) {
        if (this._selectVoice.length === 0 && voices.length > 0) {
            const filteredVoices = voices.filter(voice => voice.lang.toLowerCase() === this._chosenLanguage.value)
            if (filteredVoices.length > 0) {
                this._ttsSelection.style.display = 'block'
                this._deviceUnsupportedWarning.style.display = 'none'
                filteredVoices.forEach((voice, index) => {
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
    }

    clearHistory(event) {
        event.preventDefault()
        this._textHistory.erase()
    }
}
