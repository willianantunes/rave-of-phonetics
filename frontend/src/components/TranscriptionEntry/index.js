import React, { useEffect, useState } from "react"
import * as S from "./styled"
import PropTypes from "prop-types"
import { Popover } from "@material-ui/core"
import Suggestion from "../Suggestion"

function createCurrentTranscription(transcription, word, isPhonemic = null) {
  return transcription ? { output: transcription, isWord: false, isPhonemic } : { output: word, isWord: true, isPhonemic }
}

function TranscriptionEntry({ index, word, language, transcriptions, showSyllables, showPhonetic }) {
  // -------------------------------
  // States
  const [transcriptionSetup, setTranscriptionSetup] = useState({
    all: transcriptions,
    current: transcriptions[0],
    key: 0,
    length: transcriptions.length,
  })
  const [currentTranscription, setCurrentTranscription] = useState({ output: "⏳", isWord: false })
  const [wherePopperShouldUseAsRef, setWherePopperShouldUseAsRef] = React.useState(null)
  const [suggestionOpen, setSuggestionOpen] = React.useState(false)
  // -------------------------------
  // Effects
  useEffect(() => {
    setTranscriptionSetup({
      all: transcriptions,
      current: transcriptions[transcriptionSetup.key],
      key: transcriptionSetup.key,
      length: transcriptions.length,
    })
  }, [transcriptions])
  useEffect(() => {
    const currentSetup = transcriptionSetup.current
    if (currentSetup && typeof currentSetup === "object") {
      let transcriptionToBeUsed
      if (showPhonetic && showSyllables) {
        transcriptionToBeUsed = { transcription: currentSetup.phonetic_syllables, isPhonemic: false }
      } else if (!showPhonetic && showSyllables) {
        transcriptionToBeUsed = { transcription: currentSetup.phonemic_syllables, isPhonemic: true }
      } else if (showPhonetic) {
        transcriptionToBeUsed = { transcription: currentSetup.phonetic, isPhonemic: false }
      } else {
        transcriptionToBeUsed = { transcription: currentSetup.phonemic, isPhonemic: true }
      }
      setCurrentTranscription(
        createCurrentTranscription(transcriptionToBeUsed.transcription, word, transcriptionToBeUsed.isPhonemic)
      )
    } else {
      setCurrentTranscription(createCurrentTranscription(null, word))
    }
  }, [transcriptionSetup])
  // -------------------------------
  // Events
  const changeTranscription = event => {
    event.preventDefault()
    const newKeyTobeUsed = transcriptionSetup.key + 1
    const newCurrent = transcriptions[newKeyTobeUsed]
    if (newCurrent) {
      setTranscriptionSetup({ ...transcriptionSetup, current: newCurrent, key: newKeyTobeUsed })
    } else {
      setTranscriptionSetup({ ...transcriptionSetup, current: transcriptions[0], key: 0 })
    }
  }
  const showClassifications = event => {
    event.preventDefault()
    setWherePopperShouldUseAsRef(event.currentTarget)
  }
  const showSuggestionModal = event => {
    event.preventDefault()
    setSuggestionOpen(true)
  }
  const closeSuggestionModal = () => setSuggestionOpen(false)
  // -------------------------------
  // Stuff to be rendered
  const howTranscriptionMustBeRendered =
    transcriptionSetup.length > 1 && !currentTranscription.isWord ? (
      <S.LinkThatApplyChanges href="#" onClick={changeTranscription}>
        {currentTranscription.output}
      </S.LinkThatApplyChanges>
    ) : (
      currentTranscription.output
    )
  const howWordMustBeRendered = (
    <>
      <S.LinkThatApplyChanges onClick={showClassifications}>{word}</S.LinkThatApplyChanges>
      <Popover
        id={Boolean(wherePopperShouldUseAsRef) ? "simple-popover" : undefined}
        open={Boolean(wherePopperShouldUseAsRef)}
        anchorEl={wherePopperShouldUseAsRef}
        onClose={() => setWherePopperShouldUseAsRef(null)}
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
      >
        {transcriptionSetup.length > 0 &&
          transcriptionSetup.all.map((entry, key) => (
            <S.ClassificationEntry key={key}>
              {entry.version}: [{currentTranscription.isPhonemic ? entry.phonemic : entry.phonetic || "Unavailable"}] /
              Classification: {entry.classification}
            </S.ClassificationEntry>
          ))}
        {transcriptionSetup.length === 0 && (
          <S.ClassificationEntry>
            This is not in our database{" "}
            <span role="img" aria-label="grimacing face">
              😬
            </span>
          </S.ClassificationEntry>
        )}
        <S.ClassificationEntry>
          <S.LinkSuggestionModal onClick={showSuggestionModal}>
            Apply suggestion{" "}
            <span role="img" aria-label="nerd face">
              🤓
            </span>
          </S.LinkSuggestionModal>
        </S.ClassificationEntry>
        <Suggestion word={word} language={language} open={suggestionOpen} handleClose={closeSuggestionModal} />
      </Popover>
    </>
  )

  return (
    <S.TranscriptionEntryBox data-testid={`transcription-entry-${index}`}>
      <div>{howWordMustBeRendered}</div>
      <S.IPASymbolVisualizer isWord={currentTranscription.isWord}>{howTranscriptionMustBeRendered}</S.IPASymbolVisualizer>
    </S.TranscriptionEntryBox>
  )
}

TranscriptionEntry.propTypes = {
  index: PropTypes.number.isRequired,
  word: PropTypes.string.isRequired,
  language: PropTypes.string.isRequired,
  transcriptions: PropTypes.array.isRequired,
  showStress: PropTypes.bool.isRequired,
  showPunctuations: PropTypes.bool.isRequired,
  showSyllables: PropTypes.bool.isRequired,
  showPhonetic: PropTypes.bool.isRequired,
}

export default TranscriptionEntry
