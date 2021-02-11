import React, { useCallback, useEffect, useRef, useState } from "react"
import CardContent from "@material-ui/core/CardContent"
import Typography from "@material-ui/core/Typography"
import * as S from "./styled"
import { debounce } from "lodash"
import { FormControl, FormControlLabel, FormGroup, Popover, Radio, RadioGroup, Switch, TextField } from "@material-ui/core"
import { useDispatch, useSelector } from "react-redux"
import { setChosenLanguage, setText, setWithStress, transcriptionFromText } from "../../redux/slices/transcriptionSlice"
import { encodeQueryParams } from "serialize-query-params"
import { useQueryParam, StringParam, BooleanParam } from "use-query-params"
import { copyToClipboard } from "../../utils/general"
import { stringify } from "query-string"
import { useLocation } from "@reach/router"

export default function Transcription(props) {
  // Infrastructure
  const dispatch = useDispatch()
  const { origin } = useLocation()
  // States
  const [textQueryString] = useQueryParam("text", StringParam)
  const [languageQueryString] = useQueryParam("language", StringParam)
  const [withStressQueryString] = useQueryParam("with-stress", BooleanParam)
  const [currentText, setCurrentText] = useState(text)
  const [anchorWhenSomethingIsCopied, setAnchorWhenSomethingIsCopied] = React.useState(null)
  // Refs
  const textAreaReference = useRef(null)
  // Redux things
  const { text, chosenLanguage, withStress, isLoading, transcribedResult, isError, phones } = useSelector(
    state => state.transcription
  )
  // Memoized things
  const delayedSetText = useCallback(
    debounce(value => dispatch(setText(value)), 500),
    []
  )
  const delayedTranscribeAction = useCallback(
    debounce((text, chosenLanguage, withStress) => dispatch(transcriptionFromText(text, chosenLanguage, withStress)), 500),
    []
  )
  // Effects
  useEffect(() => {
    // It will set the fields through the query string params, if the exist
    if (textQueryString) {
      setCurrentText(textQueryString)
      dispatch(setText(textQueryString))
    }
    if (languageQueryString) {
      dispatch(setChosenLanguage(languageQueryString))
    }
    if (withStressQueryString) dispatch(setWithStress(withStressQueryString))
  }, [])
  useEffect(() => {
    // If an user clicks on the history table, then text field must be updated
    // TODO: Change to be like a state machine
    if (transcribedResult) {
      setCurrentText(text)
      textAreaReference.current.focus()
    }
  }, [transcribedResult])
  // Events
  const handleChangeForAlmostAll = (hook, evt) => {
    const value = evt.target.type === "checkbox" ? evt.target.checked : evt.target.value
    dispatch(hook(value))
  }
  const handleTextChange = e => {
    const value = e.target.value
    setCurrentText(value)
    delayedSetText(value)
  }
  const transcribeGivenText = event => {
    event.preventDefault()
    delayedTranscribeAction(text, chosenLanguage, withStress)
  }
  const copyLinkToClipboard = event => {
    const encodedQuery = encodeQueryParams(
      { text: StringParam, language: StringParam, "with-stress": BooleanParam },
      { text: text, language: chosenLanguage, "with-stress": withStress }
    )
    copyToClipboard(`${origin}?${stringify(encodedQuery)}`)
    setAnchorWhenSomethingIsCopied(event.currentTarget)
  }
  const copyTranscriptionToClipboard = event => {
    copyToClipboard(phones)
    setAnchorWhenSomethingIsCopied(event.currentTarget)
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
        <form onSubmit={transcribeGivenText}>
          <FormControl component="fieldset" fullWidth={true}>
            <TextField
              inputRef={textAreaReference}
              id="standard-multiline-flexible"
              label="Type the words here"
              multiline
              rowsMax={4}
              value={currentText || ""}
              autoFocus
              onChange={handleTextChange}
              name="textToBeTranscribed"
              required
            />
          </FormControl>
          <FormControl component="fieldset" fullWidth={true}>
            <RadioGroup
              row
              aria-label="language"
              name="chosenLanguage"
              value={chosenLanguage}
              onChange={e => handleChangeForAlmostAll(setChosenLanguage, e)}
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
              control={
                <Switch checked={withStress} onChange={e => handleChangeForAlmostAll(setWithStress, e)} name="withStress" />
              }
              label="With stress"
            />
          </FormGroup>
          <S.ActionsWrapper row>
            <S.TranscribeButton>Transcribe</S.TranscribeButton>
            <S.GenerateLink onClick={copyLinkToClipboard}>Copy link</S.GenerateLink>
            <S.CopyTranscription onClick={copyTranscriptionToClipboard}>Copy transcription</S.CopyTranscription>
            <Popover
              id={Boolean(anchorWhenSomethingIsCopied) ? "simple-popover" : undefined}
              open={Boolean(anchorWhenSomethingIsCopied)}
              anchorEl={anchorWhenSomethingIsCopied}
              onClose={() => setAnchorWhenSomethingIsCopied(null)}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "center",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "center",
              }}
            >
              <S.MessageLinkCopied>Copied!</S.MessageLinkCopied>
            </Popover>
          </S.ActionsWrapper>
          {isLoading && <S.LoadingTranscription />}
          {!isLoading && isError && (
            <S.TranscriptionSection>
              <p>An error was caught🤯! Time to see logs and stack-trace. I hope I'll get back soon 😶</p>
            </S.TranscriptionSection>
          )}
          {!isLoading && transcribedResult && (
            <S.TranscriptionSection>
              {transcribedResult.transcription.map((transcribedWord, index) => (
                <div key={index}>
                  <div>{transcribedWord.word}</div>
                  <div>{transcribedWord.phone}</div>
                </div>
              ))}
            </S.TranscriptionSection>
          )}
        </form>
      </CardContent>
    </S.CustomCard>
  )
}
