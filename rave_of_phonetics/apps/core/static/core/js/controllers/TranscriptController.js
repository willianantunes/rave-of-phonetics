class TranscriptController {
    constructor() {
        this._inputForm = $('form');
        this._inputWordToBeSpoken = $('input[name=word-to-be-evaluated]');
        this._voiceSelect = $('select[name=available-voices]');
        this._pitch = $('input[name=pitch]');
        this._pitchValue = $('.pitch-value');
        this._rate = $('input[name=rate]');
        this._rateValue = $('.rate-value');
        this._webSpeechAPI = new WebSpeechAPI(this._populateVoiceList.bind(this))
    }

    speak(event) {
        event.preventDefault()

        if (this._inputWordToBeSpoken.value !== '') {
            const wordToBeSpoken = this._inputWordToBeSpoken.value;
            const utteranceSetup = new SpeechSynthesisUtterance(wordToBeSpoken);

            // utterThis.onend = function (event) {
            //     console.log('SpeechSynthesisUtterance.onend');
            // }
            // utterThis.onerror = function (event) {
            //     console.error('SpeechSynthesisUtterance.onerror');
            // }

            const selectedVoiceName = this._voiceSelect.selectedOptions[0].getAttribute('data-name');
            const voice = this._webSpeechAPI.voices.find(voice => voice.name === selectedVoiceName)

            utteranceSetup.voice = voice
            utteranceSetup.lang = voice.lang
            utteranceSetup.pitch = 1
            utteranceSetup.rate = 1

            this._webSpeechAPI._speechSynthesis.speak(utteranceSetup)
        } else {
            alert("Please, write something!")
        }
    }

    _populateVoiceList(voices) {
        voices.filter(voice => voice.lang === "en-US" || voice.lang === "en")
            .forEach((voice, index) => {
                const option = document.createElement('option');
                option.textContent = voice.name + ' (' + voice.lang + ')';
                if (voice.default) {
                    option.textContent += ' (default)';
                }
                option.setAttribute('data-lang', voice.lang);
                option.setAttribute('data-name', voice.name);
                this._voiceSelect.appendChild(option);
            })
    }
}
