export class WebSpeechAPI {
    constructor(_onVoicesChangedCallable, _hookWhenSpeaking, _hookWhenFinishedSpeech) {
        // TODO: Make params required
        Object.assign(this, {_onVoicesChangedCallable, _hookWhenSpeaking, _hookWhenFinishedSpeech})
        this._speechSynthesis = window.speechSynthesis;
        this.voices = []

        // https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesis/onvoiceschanged
        if (typeof this._speechSynthesis !== 'undefined' && this._speechSynthesis.onvoiceschanged !== undefined) {
            this._speechSynthesis.onvoiceschanged = this._configureSpeechService.bind(this);
        } else {
            this._configureSpeechService()
        }
    }

    _configureSpeechService() {
        this.voices = this._speechSynthesis.getVoices().sort((firstSpeechSynthesisVoice, secondSpeechSynthesisVoiceTwo) => {
            // https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesisVoice
            const firstVoiceAsUppercase = firstSpeechSynthesisVoice.name.toUpperCase()
            const secondVoiceAsUppercase = secondSpeechSynthesisVoiceTwo.name.toUpperCase();

            if (firstVoiceAsUppercase < secondVoiceAsUppercase) return -1;
            if (firstVoiceAsUppercase > secondVoiceAsUppercase) return 1;

            return 0;
        });

        if (this._onVoicesChangedCallable !== undefined) {
            this._onVoicesChangedCallable(this.voices)
        }
    }

    stopSpeakingImmediately() {
        this._speechSynthesis.cancel()
        this._hookWhenFinishedSpeech()
        if (this._timerId) {
            clearInterval(this._timerId)
            delete this._timerId
        }
    }

    speechWith(text, language, pitch = 1, rate = 1, selectedVoice = null, loop = false, interval = 1000) {
        this._utteranceSetup = new SpeechSynthesisUtterance();
        // Events
        this._utteranceSetup.onstart = this._hookWhenSpeaking
        this._utteranceSetup.onresume = this._utteranceSetup.onstart
        this._utteranceSetup.onend = this._hookWhenFinishedSpeech
        this._utteranceSetup.onerror = (e) => {
            console.error(`Something went wrong! Details: ${e}`)
            this._hookWhenFinishedSpeech()
        };

        if (this.voices && this.voices.length > 0 && selectedVoice) {
            const voice = this.voices.find(voice => voice.name === selectedVoice)
            this._utteranceSetup.voice = voice
            this._utteranceSetup.lang = voice.lang
        } else {
            // Android workaround
            this._utteranceSetup.lang = language
        }

        this._utteranceSetup.text = text
        this._utteranceSetup.pitch = pitch
        this._utteranceSetup.rate = rate

        if (loop) {
            this._utteranceSetup.onend = null
            this._timerId = setInterval(() => this._speechSynthesis.speak(this._utteranceSetup), interval);
        } else {
            this._speechSynthesis.speak(this._utteranceSetup)
        }
    }
}
