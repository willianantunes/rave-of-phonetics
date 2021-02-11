import React, { useCallback, useEffect, useRef, useState } from "react"
import CardContent from "@material-ui/core/CardContent"
import Typography from "@material-ui/core/Typography"
import * as S from "./styled"
import { FormControl, FormControlLabel, FormGroup, Slider, Switch } from "@material-ui/core"
import { useDispatch, useSelector } from "react-redux"
import { WebSpeechAPI } from "../../services/WebSpeechAPI"
import { Play, Stop } from "styled-icons/boxicons-regular"
import Voices from "../Voices"
import { analyseVoices, setLoopSpeechAudio, setPitch, setRate, setVoiceToSpeech } from "../../redux/slices/textToSpeechSlice"
import { debounce } from "lodash"

export default function TextToSpeech() {
  // States
  const [buttonValue, setButtonValue] = useState("Play")
  const [buttonIcon, setButtonIcon] = useState(<Play />)
  // Infrastructure
  const dispatch = useDispatch()
  // Redux things
  const { loopSpeechAudio, voices, filteredVoices, isLoading, voiceToSpeech, pitch, rate, voicesWereLoadedOnce } = useSelector(
    state => state.textToSpeech
  )
  const { chosenLanguage, text } = useSelector(state => state.transcription)
  // Services
  const webSpeechAPI = useRef(null)
  // Effects
  useEffect(() => {
    const onVoiceChangedCallable = voices => dispatch(analyseVoices(voices, chosenLanguage))
    const hookWhenSpeaking = () => {
      setButtonValue("Stop")
      setButtonIcon(<Stop />)
    }
    const hookWhenFinishedSpeech = () => {
      setButtonValue("Play")
      setButtonIcon(<Play />)
    }
    webSpeechAPI.current = new WebSpeechAPI(onVoiceChangedCallable, hookWhenSpeaking, hookWhenFinishedSpeech)
  }, [])
  useEffect(() => {
    dispatch(analyseVoices(voices, chosenLanguage))
  }, [voicesWereLoadedOnce, chosenLanguage])
  // Events
  const speakWhatIsConfigured = () => {
    if (buttonValue === "Play") {
      webSpeechAPI.current.speechWith(text, chosenLanguage, pitch, rate, voiceToSpeech, loopSpeechAudio)
    } else {
      webSpeechAPI.current.stopSpeakingImmediately()
    }
  }
  const handleChange = (hook, evt) => {
    const value = evt.target.type === "checkbox" ? evt.target.checked : evt.target.value
    dispatch(hook(value))
  }
  // Memoized things
  const delayedSpeakWhatIsConfigured = useCallback(
    debounce(() => speakWhatIsConfigured(), 500),
    [text, chosenLanguage, pitch, rate, voiceToSpeech, loopSpeechAudio, buttonValue]
  )

  return (
    <S.CustomCard>
      <CardContent>
        <FormGroup row>
          <S.PlayOrStopButton onClick={delayedSpeakWhatIsConfigured} endIcon={buttonIcon}>
            {buttonValue}
          </S.PlayOrStopButton>
        </FormGroup>
        <FormGroup row>
          <FormControlLabel
            control={<Switch checked={loopSpeechAudio} onChange={e => handleChange(setLoopSpeechAudio, e)} name="loopSpeech" />}
            label="Loop the speech audio"
          />
        </FormGroup>
        <Voices
          voices={filteredVoices}
          voiceToSpeech={voiceToSpeech}
          isLoading={isLoading}
          updateVoiceToSpeech={setVoiceToSpeech}
        />
        <FormControl component="fieldset" fullWidth={true}>
          <Typography id="rateSlider" gutterBottom>
            Rate
          </Typography>
          <Slider
            defaultValue={1}
            aria-labelledby="rateSlider"
            valueLabelDisplay="auto"
            step={0.1}
            marks
            min={0.5}
            max={2}
            name="rate"
            onChange={(e, newValue) => dispatch(setRate(newValue))}
          />
          <Typography id="pitchSlider" gutterBottom>
            Pitch
          </Typography>
          <Slider
            defaultValue={1}
            aria-labelledby="pitchSlider"
            valueLabelDisplay="auto"
            step={0.1}
            marks
            min={0}
            max={2}
            name="pitch"
            onChange={(e, newValue) => dispatch(setPitch(newValue))}
          />
        </FormControl>
      </CardContent>
    </S.CustomCard>
  )
}
