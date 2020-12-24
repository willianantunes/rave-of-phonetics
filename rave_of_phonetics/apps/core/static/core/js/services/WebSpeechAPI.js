class WebSpeechAPI {
    constructor(onVoicesChangedCallable) {
        this._speechSynthesis = window.speechSynthesis;
        this.voices = []
        this._onVoiceChangedCallable = onVoicesChangedCallable

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

        if (this._onVoiceChangedCallable !== undefined) {
            this._onVoiceChangedCallable(this.voices)
        }
    }

    stop() {
        this._speechSynthesis.cancel()
    }
}
