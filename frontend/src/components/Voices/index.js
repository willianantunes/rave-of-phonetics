import * as S from "./styled"
import React, { useEffect, useState } from "react"
import PropTypes from "prop-types"
import { InputLabel, MenuItem, Select } from "@material-ui/core"
import { useDispatch } from "react-redux"

function Voices({ voices, voiceToSpeech, isLoading, updateVoiceToSpeech }) {
  // Infrastructure
  const dispatch = useDispatch()
  // States
  const [voiceEngineSupported, setVoiceEngineSupported] = useState(false)
  // Effects
  useEffect(() => {
    setVoiceEngineSupported(voices.length !== 0)
  }, [voices])

  const renderVoices = () => {
    const menuItems = voices.map(voice => {
      let voiceLabel = voice.name + " (" + voice.lang + ")"
      return (
        <MenuItem key={voice.name} value={voice.name}>
          {voiceLabel}
        </MenuItem>
      )
    })
    return (
      <S.AvailableVoicesFormControl variant="outlined" fullWidth={true}>
        <InputLabel id="available-voices">Available voices</InputLabel>
        <Select
          labelId="available-voices"
          name="voice"
          value={voiceToSpeech}
          onChange={e => dispatch(updateVoiceToSpeech(e.target.value))}
          label="Available voices"
        >
          {menuItems}
        </Select>
      </S.AvailableVoicesFormControl>
    )
  }

  // TODO: It's buggy. I must implement a transition thing to make the update smooth.
  if (isLoading) return <S.LoadingLanguages />
  else {
    if (voiceEngineSupported) return renderVoices()
    return (
      <S.UnsupportedVoiceEngine align="center">
        If you can't select the voice, then <strong>your device sadly does not support TTS for the desired language </strong>
        🤷 Don't worry, if you hit play we'll try to use the default TTS service available in your device 👍
      </S.UnsupportedVoiceEngine>
    )
  }
}

Voices.propTypes = {
  voices: PropTypes.array.isRequired,
  voiceToSpeech: PropTypes.string.isRequired,
  isLoading: PropTypes.bool.isRequired,
  updateVoiceToSpeech: PropTypes.func.isRequired,
}

export default Voices
