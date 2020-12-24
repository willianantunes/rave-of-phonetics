class TranscriptController {
    constructor() {
        this._buttonPlayOrStop = $('button[name=play]');
        this._inputWordToBeSpoken = $('input[name=word-to-be-evaluated]');
        this._selectVoice = $('select[name=available-voices]');
        this._inputPitch = $('input[name=pitch]');
        this._pitchValue = $('.pitch-value');
        this._inputRate = $('input[name=rate]');
        this._rateValue = $('.rate-value');

        this._webSpeechAPI = new WebSpeechAPI(this._populateVoiceList.bind(this))
    }

    speak(event) {
        event.preventDefault()

        if (this._buttonPlayOrStop.className === "speech-play") {
            if (this._inputWordToBeSpoken.value !== '') {
                const wordToBeSpoken = this._inputWordToBeSpoken.value;
                this.utteranceSetup = new SpeechSynthesisUtterance();

                this.utteranceSetup.onstart = () => {
                    this._buttonPlayOrStop.innerText = "Stop"
                    this._buttonPlayOrStop.className = "speech-speaking"
                }
                this.utteranceSetup.onresume = this.utteranceSetup.onstart
                this.utteranceSetup.onend = () => {
                    this._buttonPlayOrStop.innerText = "Play"
                    this._buttonPlayOrStop.className = "speech-play"
                };
                this.utteranceSetup.onerror = (e) => {
                    alert(`Something went wrong! ${e}`)
                    this._buttonPlayOrStop.innerText = "Play"
                    this._buttonPlayOrStop.className = "speech-play"
                };

                if (this._webSpeechAPI.voices && this._webSpeechAPI.voices.length > 0 && this._selectVoice.selectedOptions[0]) {
                    const selectedVoiceName = this._selectVoice.selectedOptions[0].getAttribute('data-name');
                    const voice = this._webSpeechAPI.voices.find(voice => voice.name === selectedVoiceName)
                    this.utteranceSetup.voice = voice
                    this.utteranceSetup.lang = voice.lang
                } else {
                    // Android workaround
                    this.utteranceSetup.lang = "en"
                }

                this.utteranceSetup.text = wordToBeSpoken
                this.utteranceSetup.pitch = this._inputPitch.value
                this.utteranceSetup.rate = this._inputRate.value

                this._webSpeechAPI._speechSynthesis.speak(this.utteranceSetup)
            } else {
                alert("Please, write something!")
            }
        } else {
            this._webSpeechAPI.stop()
            this._buttonPlayOrStop.innerText = "Play"
            this._buttonPlayOrStop.className = "speech-play"
        }
    }

    _populateVoiceList(voices) {
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
