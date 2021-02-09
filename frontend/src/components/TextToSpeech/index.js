import React, { useEffect, useRef } from "react"
import CardContent from "@material-ui/core/CardContent"
import Typography from "@material-ui/core/Typography"
import * as S from "./styled"
import { Button } from "gatsby-theme-material-ui"
import { FormControl, FormControlLabel, FormGroup, InputLabel, MenuItem, Select, Slider, Switch } from "@material-ui/core"
import { connect, useDispatch, useSelector } from "react-redux"
import { WebSpeechAPI } from "../../services/WebSpeechAPI"
import Voices from "../Voices"
import { bindActionCreators } from "redux"
import { analyseVoices, setLoopSpeechAudio, setPitch, setRate, setVoiceToSpeech } from "../../redux/slices/textToSpeechSlice"

export default function TextToSpeech() {
  const dispatch = useDispatch()

  const { loopSpeechAudio, voices, filteredVoices, isLoading, voiceToSpeech } = useSelector(state => state.textToSpeech)
  const { chosenLanguage } = useSelector(state => state.transcription)
  const handleChange = (hook, evt) => {
    const value = evt.target.type === "checkbox" ? evt.target.checked : evt.target.value
    dispatch(hook(value))
  }
  let webSpeechAPI = null
  useEffect(() => {
    webSpeechAPI = new WebSpeechAPI(voices => dispatch(analyseVoices(voices, chosenLanguage)), null, null)
  }, [])
  useEffect(() => {
    dispatch(analyseVoices(voices, chosenLanguage))
  }, chosenLanguage)
  //
  const buttonPlayOrStop = useRef(null)
  //
  // const populateVoiceList = voices => {
  //   dispatch(includeVoices(voices))
  // }
  //
  // const drawAsSpeechSpeaking = () => {
  //   console.log("Draw as speech speaking")
  // }
  //
  // const drawAsSpeechIsAvailable = () => {
  //   console.log(`I'm available again!`)
  // }
  //
  const honestTest = ev => {
    // alert("Yeah!" + buttonPlayOrStop.current)
    alert("Here: " + filteredVoices)
    // alert(transcriptionReducer.language)
  }

  return (
    <S.CustomCard>
      <CardContent>
        <FormGroup row>
          <Button variant="contained" color="primary" ref={buttonPlayOrStop} onClick={honestTest}>
            Play
          </Button>
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
            onChange={e => handleChange(setRate, e)}
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
            onChange={e => handleChange(setPitch, e)}
          />
        </FormControl>
      </CardContent>
    </S.CustomCard>
  )
}
