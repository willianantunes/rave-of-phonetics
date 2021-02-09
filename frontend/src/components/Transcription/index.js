import React from "react"
import CardContent from "@material-ui/core/CardContent"
import Typography from "@material-ui/core/Typography"
import * as S from "./styled"
import { FormControl, FormControlLabel, FormGroup, Radio, RadioGroup, Switch, TextField } from "@material-ui/core"
import { Send } from "styled-icons/boxicons-solid"
import { useDispatch, useSelector } from "react-redux"
import { setChosenLanguage, setText, setWithStress, transcriptionFromText } from "../../redux/slices/transcriptionSlice"

export default function Transcription() {
  // Infrastructure
  const dispatch = useDispatch()
  // Redux things
  const { text, chosenLanguage, withStress, isLoading, transcribedResult } = useSelector(state => state.transcription)
  // Events
  const handleChange = (hook, evt) => {
    const value = evt.target.type === "checkbox" ? evt.target.checked : evt.target.value
    dispatch(hook(value))
  }
  const transcribeGivenText = () => {
    dispatch(transcriptionFromText(text, chosenLanguage, withStress))
  }

  return (
    <S.CustomCard>
      <CardContent>
        <Typography component="h1" variant="h5" align="center">
          Your IPA transcription tool
        </Typography>
        <S.HelloMyFriendTypography color="textSecondary" align="center">
          Hello my friend, stay awhile and... Discover phones! 🔎
        </S.HelloMyFriendTypography>
        <FormControl component="fieldset" fullWidth={true}>
          <TextField
            id="standard-multiline-flexible"
            label="Type the words here"
            multiline
            rowsMax={4}
            value={text}
            onChange={e => handleChange(setText, e)}
            name="textToBeTranscribed"
          />
        </FormControl>
        <FormControl component="fieldset" fullWidth={true}>
          <RadioGroup
            row
            aria-label="language"
            name="chosenLanguage"
            value={chosenLanguage}
            onChange={e => handleChange(setChosenLanguage, e)}
          >
            <FormControlLabel value="en-us" control={<Radio />} label="American" />
            <FormControlLabel value="en-gb" control={<Radio />} label="British" />
            <FormControlLabel value="fr-fr" control={<Radio />} label="French" />
            <FormControlLabel value="es" control={<Radio />} label="Spanish" />
            <FormControlLabel value="it" control={<Radio />} label="Italian" />
          </RadioGroup>
        </FormControl>
        <FormGroup row>
          <FormControlLabel
            control={<Switch checked={withStress} onChange={e => handleChange(setWithStress, e)} name="withStress" />}
            label="With stress"
          />
        </FormGroup>
        <FormGroup row>
          <S.TranscribeButton variant="contained" color="primary" onClick={transcribeGivenText} endIcon={<Send />}>
            Transcribe
          </S.TranscribeButton>
        </FormGroup>
        {/*<S.LoadingTranscription />*/}
        {isLoading && <S.LoadingTranscription />}
        {!isLoading && transcribedResult && (
          <S.TranscriptionSection>
            {transcribedResult.map(transcribedWord => (
              <div>
                <div>{transcribedWord.word}</div>
                <div>{transcribedWord.phone}</div>
              </div>
            ))}
          </S.TranscriptionSection>
        )}
      </CardContent>
    </S.CustomCard>
  )
}
