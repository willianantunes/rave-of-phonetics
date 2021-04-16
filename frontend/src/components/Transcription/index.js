import React, { useCallback, useEffect, useState } from "react"
import CardContent from "@material-ui/core/CardContent"
import * as S from "./styled"
import { debounce } from "lodash"
import { FormControl, FormControlLabel, FormGroup, Popover, Radio, RadioGroup, Switch, TextField } from "@material-ui/core"
import { useDispatch, useSelector } from "react-redux"
import {
  setChosenLanguage,
  setShowPhonetic,
  setShowPunctuations,
  setShowStress,
  setShowSyllables,
  setText,
  setTranscriptionDetails,
  transcriptionFromText,
} from "../../redux/slices/transcription-slice"
import { encodeQueryParams } from "serialize-query-params"
import { BooleanParam, StringParam, useQueryParam } from "use-query-params"
import { copyToClipboard } from "../../utils/general"
import { stringify } from "query-string"
import { useLocation } from "@reach/router"
import { useGoogleReCaptcha } from "react-google-recaptcha-v3"
import { dispatchEvent } from "../../analytics"
import { TranscriptionDetails } from "../../domains/TranscriptionDetails"
import TranscriptionEntry from "../TranscriptionEntry"

const trackTranscribeClick = language => {
  dispatchEvent({
    category: "Transcription tool",
    action: `transcribe using ${language}`,
  })
}

const trackTranscribeError = () => {
  dispatchEvent({
    category: "Transcription tool",
    action: `Error shown`,
  })
}

const trackCopyLinkClick = language => {
  dispatchEvent({
    category: "Transcription tool",
    action: `copied link using ${language}`,
  })
}

const trackCopyTranscriptionClick = language => {
  dispatchEvent({
    category: "Transcription tool",
    action: `copied transcription using ${language}`,
  })
}

export default function Transcription() {
  // -------------------------------
  // Infrastructure
  const dispatch = useDispatch()
  const { origin } = useLocation()
  const { executeRecaptcha } = useGoogleReCaptcha()
  // -------------------------------
  // Redux things
  const {
    text,
    chosenLanguage,
    showStress,
    showSyllables,
    showPunctuations,
    showPhonetic,
    isLoading,
    transcriptionDetails,
    isError,
    counterOfLoadedTranscription,
  } = useSelector(state => state.transcription)
  // -------------------------------
  // States
  const [textQueryString] = useQueryParam("text", StringParam)
  const [languageQueryString] = useQueryParam("language", StringParam)
  const [showStressQueryString] = useQueryParam("show-stress", BooleanParam)
  const [showSyllablesQueryString] = useQueryParam("show-syllables", BooleanParam)
  const [showPunctuationsQueryString] = useQueryParam("show-punctuations", BooleanParam)
  const [showPhoneticQueryString] = useQueryParam("show-phonetic", BooleanParam)
  const [currentText, setCurrentText] = useState(text)
  const [anchorWhenSomethingIsCopied, setAnchorWhenSomethingIsCopied] = React.useState(null)
  // -------------------------------
  // Memoized things
  const delayedSetText = useCallback(
    debounce(value => dispatch(setText(value)), 500),
    []
  )
  const delayedTranscribeAction = useCallback(
    debounce(
      (text, chosenLanguage, token) => dispatch(transcriptionFromText(text, chosenLanguage, token, trackTranscribeError)),
      500
    ),
    []
  )
  // -------------------------------
  // Effects
  useEffect(() => {
    // It will set the fields through the query string params, if they exist
    if (textQueryString) {
      delayedSetText(textQueryString)
      setCurrentText(textQueryString)
    }
    if (languageQueryString) dispatch(setChosenLanguage(languageQueryString))
    if (showStressQueryString) dispatch(setShowStress(showStressQueryString))
    if (showSyllablesQueryString) dispatch(setShowSyllables(showSyllablesQueryString))
    if (showPunctuationsQueryString) dispatch(setShowPunctuations(showPunctuationsQueryString))
    if (showPhoneticQueryString) dispatch(setShowPhonetic(showPhoneticQueryString))
  }, [])
  useEffect(() => {
    // This will be fired every time a transcription is loaded from the history
    if (text) {
      setCurrentText(text)
    }
  }, [counterOfLoadedTranscription])
  // -------------------------------
  // Events
  const handleChangeForShowsOptions = (hook, evt) => {
    const value = evt.target.type === "checkbox" ? evt.target.checked : evt.target.value
    dispatch(hook(value))
    if (transcriptionDetails) {
      const target = {}
      Object.assign(target, transcriptionDetails)
      target[evt.target.name] = value
      const updatedTranscriptionDetails = TranscriptionDetails.newFromDatabaseRow(target)
      dispatch(
        setTranscriptionDetails(
          updatedTranscriptionDetails.convertToObject({
            withSingleLineTranscription: true,
            withRefreshedTranscription: true,
          })
        )
      )
    }
  }
  const handleTextChange = e => {
    const value = e.target.value
    setCurrentText(value)
    delayedSetText(value)
  }
  const transcribeGivenText = async event => {
    event.preventDefault()
    // TODO: Identify why the onSubmit handler from Suggestion/index.js is triggering this one
    if (event.target.id === "form-transcription") {
      const token = await executeRecaptcha("transcribe")

      trackTranscribeClick(chosenLanguage)
      delayedTranscribeAction(text, chosenLanguage, token)
    }
  }
  const copyLinkToClipboard = event => {
    const encodedQuery = encodeQueryParams(
      {
        text: StringParam,
        language: StringParam,
        "show-stress": BooleanParam,
        "show-syllables": BooleanParam,
        "show-punctuations": BooleanParam,
        "show-phonetic": BooleanParam,
      },
      {
        text: text,
        language: chosenLanguage,
        "show-stress": showStress,
        "show-syllables": showSyllables,
        "show-punctuations": showPunctuations,
        "show-phonetic": showPhonetic,
      }
    )
    copyToClipboard(`${origin}?${stringify(encodedQuery)}`)
    trackCopyLinkClick(chosenLanguage)
    setAnchorWhenSomethingIsCopied(event.currentTarget)
  }
  const copyTranscriptionToClipboard = event => {
    if (transcriptionDetails) {
      copyToClipboard(transcriptionDetails.singleLineTranscription)
    } else {
      copyToClipboard("Have you tried to transcribe something first?")
    }
    trackCopyTranscriptionClick(chosenLanguage)
    setAnchorWhenSomethingIsCopied(event.currentTarget)
  }

  return (
    <S.CustomCard>
      <CardContent>
        <S.Title>IPA transcription tool</S.Title>
        <S.TranscriptionForm id="form-transcription" onSubmit={transcribeGivenText}>
          <FormControl component="fieldset" fullWidth={true}>
            <TextField
              inputProps={{ maxLength: 500 }}
              data-testid="wrapper-text-to-be-transcribed"
              label="Type the words here"
              multiline
              rowsMax={4}
              value={currentText}
              // autoFocus
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
              onChange={e => dispatch(setChosenLanguage(e.target.value))}
            >
              <FormControlLabel value="en-us" control={<Radio />} label="American" />
              <FormControlLabel value="en-gb" control={<Radio />} label="British" />
            </RadioGroup>
          </FormControl>
          <FormGroup row>
            <FormControlLabel
              control={
                <Switch checked={showStress} onChange={e => handleChangeForShowsOptions(setShowStress, e)} name="showStress" />
              }
              label="Show stress"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={showPunctuations}
                  onChange={e => handleChangeForShowsOptions(setShowPunctuations, e)}
                  name="showPunctuations"
                />
              }
              label="Show punctuations"
            />
          </FormGroup>
          <FormGroup row>
            <FormControlLabel
              control={
                <Switch
                  checked={showSyllables}
                  onChange={e => handleChangeForShowsOptions(setShowSyllables, e)}
                  name="showSyllables"
                />
              }
              label="Show syllables"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={showPhonetic}
                  onChange={e => handleChangeForShowsOptions(setShowPhonetic, e)}
                  name="showPhonetic"
                />
              }
              label="Show phonetic"
            />
          </FormGroup>
          <S.ActionsWrapper row>
            <S.TranscribeButton data-testid="button-transcribe">Transcribe</S.TranscribeButton>
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
          {isLoading && (
            <>
              <S.LoadingTranscription />
              <p>
                We're checking if you're a{" "}
                <span role="img" aria-label="robot">
                  🤖
                </span>
                . The first time delays a bit{" "}
                <span role="img" aria-label="grinning face with sweat">
                  😅
                </span>
              </p>
            </>
          )}
          {!isLoading && isError && (
            <S.TranscriptionSection>
              <p>
                Oops! Something went wrong
                <span role="img" aria-label="Exploding head">
                  🤯
                </span>
                ! Please try to transcribe again, friend{" "}
                <span role="img" aria-label="grinning face with big eyes">
                  😃
                </span>
              </p>
            </S.TranscriptionSection>
          )}
          {!isLoading && transcriptionDetails && (
            <S.TranscriptionSection>
              {transcriptionDetails.refreshedTranscriptionSetup.map((details, index) => (
                <TranscriptionEntry
                  key={index}
                  index={index}
                  language={transcriptionDetails.language}
                  showStress={transcriptionDetails.showStress}
                  showPunctuations={transcriptionDetails.showPunctuations}
                  showSyllables={transcriptionDetails.showSyllables}
                  showPhonetic={transcriptionDetails.showPhonetic}
                  word={details.word}
                  transcriptions={details.entries || []}
                />
              ))}
            </S.TranscriptionSection>
          )}
        </S.TranscriptionForm>
      </CardContent>
    </S.CustomCard>
  )
}
