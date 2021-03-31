import React, { useEffect, useState } from "react"
import * as S from "./styled"
import PropTypes from "prop-types"
import { Popover } from "@material-ui/core"

function createCurrentTranscription(transcription, word, isPhonemic = null) {
  return transcription ? { output: transcription, isWord: false, isPhonemic } : { output: word, isWord: true, isPhonemic }
}

function TranscriptionEntry({ index, word, transcriptions, showStress, showPunctuations, showSyllables, showPhonetic }) {
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
      if (showPhonetic) {
        transcriptionToBeUsed = { transcription: currentSetup.phonetic, isPhonemic: false }
      } else if (showPhonetic && showSyllables) {
        transcriptionToBeUsed = { transcription: currentSetup.phonetic_syllables, isPhonemic: false }
      } else if (!showPhonetic && showSyllables) {
        transcriptionToBeUsed = { transcription: currentSetup.phonemic_syllables, isPhonemic: true }
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
  const howWordMustBeRendered =
    transcriptionSetup.length > 0 ? (
      <>
        <S.LinkThatApplyChanges href="#" onClick={showClassifications}>
          {word}
        </S.LinkThatApplyChanges>
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
          {transcriptionSetup.all.map((entry, key) => (
            <S.ClassificationEntry key={key}>
              {entry.version}: [{currentTranscription.isPhonemic ? entry.phonemic : entry.phonetic || "Unavailable"}] /
              Classification: {entry.classification}
            </S.ClassificationEntry>
          ))}
        </Popover>
      </>
    ) : (
      <>{word}</>
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
  transcriptions: PropTypes.array.isRequired,
  showStress: PropTypes.bool.isRequired,
  showPunctuations: PropTypes.bool.isRequired,
  showSyllables: PropTypes.bool.isRequired,
  showPhonetic: PropTypes.bool.isRequired,
}

export default TranscriptionEntry
