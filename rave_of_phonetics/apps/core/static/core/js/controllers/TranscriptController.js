class TranscriptController {
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
        // Views
        // this._speechView = new SpeechView()
        // this._messageView = new MessageView('div.custom-message')
        this._history = new History()
        this._historyView = new HistoryView(".history")
        this._historyView.update(this._history)

        this._message = new Message();
        this._messageView = new MessageView('.custom-message');
        this._messageView.update(this._message)
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
                this._history.add(textConfiguration)
                this._historyView.update(this._history)
            } else {
                this._message.text = '👀 Please write something first 😉';
                this._messageView.update(this._message)
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
        this._message.text = ''
        this._messageView.update(this._message)
    }

    _clearHistory(event) {
        event.preventDefault()
        this._history.erase()
        this._historyView.update(this._history)
    }
}
