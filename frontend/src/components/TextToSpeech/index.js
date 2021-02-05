import React from "react"
import CardContent from "@material-ui/core/CardContent"
import Typography from "@material-ui/core/Typography"
import * as S from "./styled"
import { Button } from "gatsby-theme-material-ui"
import {
  FormControl,
  FormControlLabel,
  FormGroup,
  InputLabel,
  MenuItem,
  Select,
  Slider,
  Switch,
} from "@material-ui/core"

export default function TextToSpeech() {
  const initialState = { rate: 1, pitch: 1, loopSpeech: false, voice: "" }
  const [state, setState] = React.useState(initialState)
  const handleChange = evt => {
    const value = evt.target.type === "checkbox" ? evt.target.checked : evt.target.value
    console.log(`${evt.target.type}: ${evt.target.name} / ${value}`)
    setState({ ...state, [evt.target.name]: value })
  }

  return (
    <S.CustomCard>
      <CardContent>
        <FormGroup row>
          <Button variant="contained" color="primary">
            Play
          </Button>
        </FormGroup>
        <FormGroup row>
          <FormControlLabel
            control={<Switch checked={state.loopSpeech} onChange={handleChange} name="loopSpeech" />}
            label="Loop the speech audio"
          />
        </FormGroup>
        {/*<S.UnsupportedVoiceEngine align="center">*/}
        {/*  If you can't select the voice, then <strong>your device sadly does not support TTS</strong> 🤷 Don't worry, if*/}
        {/*  you hit play we'll try to use the default TTS service available in your device 👍*/}
        {/*</S.UnsupportedVoiceEngine>*/}
        <S.AvailableVoicesFormControl variant="outlined" fullWidth={true}>
          <InputLabel id="available-voices">Available voices</InputLabel>
          <Select
            labelId="available-voices"
            name="voice"
            value={state.voice}
            onChange={handleChange}
            label="Available voices"
          >
            <MenuItem value={10}>Ten</MenuItem>
            <MenuItem value={20}>Twenty</MenuItem>
            <MenuItem value={30}>Thirty</MenuItem>
          </Select>
        </S.AvailableVoicesFormControl>
        <FormControl component="fieldset" fullWidth={true}>
          <Typography id="rateSlider" gutterBottom>
            Rate
          </Typography>
          <Slider
            defaultValue={state.rate}
            aria-labelledby="rateSlider"
            valueLabelDisplay="auto"
            step={0.1}
            marks
            min={0.5}
            max={2}
            name="rate"
            onChange={handleChange}
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
          />
        </FormControl>
      </CardContent>
    </S.CustomCard>
  )
}
