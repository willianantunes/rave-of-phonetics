import React from "react"
import { Backdrop, Fade, TextField } from "@material-ui/core"
import * as S from "./styled"
import { useGoogleReCaptcha } from "react-google-recaptcha-v3"
import { InvalidRequestError, NotAuthorizedError, suggest } from "../../services/rop-api"

export default function Suggestion({ open, handleClose, word, language }) {
  // -------------------------------
  // Infrastructure
  const { executeRecaptcha } = useGoogleReCaptcha()
  // -------------------------------
  // States
  const initialFormState = {
    phonemic: "",
    phonetic: "",
    explanation: "",
    showSuccess: false,
    showError: false,
    errorMessage: "",
    sending: false,
  }
  const [formState, setFormState] = React.useState(initialFormState)
  // -------------------------------
  // Events
  const handleChange = e => {
    const { name, value } = e.target
    setFormState(prevState => ({ ...prevState, [name]: value }))
  }
  const submitSuggestion = async event => {
    event.preventDefault()
    // TODO: Identify why the onSubmit handler from Transcription/index.js is triggering this one
    if (event.target.id === "form-suggestion") {
      setFormState(prevState => ({ ...prevState, sending: true }))
      const token = await executeRecaptcha("suggest")
      try {
        await suggest(word, formState.phonemic, formState.phonetic, formState.explanation, language, token)
        setFormState(prevState => ({ ...prevState, showSuccess: true, sending: false }))
      } catch (error) {
        if (error instanceof InvalidRequestError) {
          const errorMessage = "Did you forget to fill phonetic or phonemic? We need at least one of them!"
          setFormState(prevState => ({ ...prevState, showError: true, sending: false, errorMessage }))
        } else if (error instanceof NotAuthorizedError) {
          const errorMessage = "Sadly you are not authorized because you reCAPTCHA score is too low."
          setFormState(prevState => ({ ...prevState, showError: true, sending: false, errorMessage }))
        } else {
          const errorMessage = "Oops! Something went wrong! Please try again later...."
          setFormState(prevState => ({ ...prevState, showError: true, sending: false, errorMessage }))
        }
      }
    }
  }

  return (
    <S.SuggestionModal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={open}
      onClose={handleClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={open}>
        <S.PaperLike>
          <h2 id="transition-modal-title">
            Suggestions are welcome and help us improve{" "}
            <span role="img" aria-label="smiling face with hearts">
              🥰
            </span>
          </h2>
          {!formState.showSuccess && (
            <>
              <p id="transition-modal-description">
                The word you'd like to fix or add is <strong>{word}</strong> for language <strong>{language}</strong>. <br />
                We recommend{" "}
                <S.ExternalLink
                  href="https://westonruter.github.io/ipa-chart/keyboard/"
                  rel="noreferrer noopener"
                  target="_blank"
                >
                  this IPA keyboard
                </S.ExternalLink>{" "}
                to help you out with the symbols.
              </p>
              <S.SuggestionForm id="form-suggestion" onSubmit={submitSuggestion}>
                <S.FieldSetWrapper>
                  <TextField
                    label="Phonemic version"
                    disabled={formState.sending}
                    inputProps={{ maxLength: 128 }}
                    value={formState.phonemic}
                    onChange={handleChange}
                    variant="filled"
                    name="phonemic"
                  />
                </S.FieldSetWrapper>
                <S.FieldSetWrapper>
                  <TextField
                    disabled={formState.sending}
                    label="Phonetic version"
                    inputProps={{ maxLength: 128 }}
                    value={formState.phonetic}
                    onChange={handleChange}
                    variant="filled"
                    name="phonetic"
                  />
                </S.FieldSetWrapper>
                <S.FieldSetWrapper>
                  <TextField
                    disabled={formState.sending}
                    label="Reasons"
                    multiline
                    inputProps={{ maxLength: 100 }}
                    value={formState.explanation}
                    onChange={handleChange}
                    variant="filled"
                    required
                    name="explanation"
                  />
                </S.FieldSetWrapper>
                {formState.showError && <S.ErrorMessage>{formState.errorMessage}</S.ErrorMessage>}
                <S.ActionSection row>
                  <S.SendButton disabled={formState.sending}>Send suggestion</S.SendButton>
                  <S.WaitingRequestProgress visible={formState.sending ? 1 : 0} />
                </S.ActionSection>
              </S.SuggestionForm>
            </>
          )}
          {formState.showSuccess && (
            <p id="transition-modal-description">
              Your suggestion has been sent! We'll evaluate it as soon as possible. Stay tuned!
              <br />
              <br />
              Don't forget that you can contact us through the comment section at the end of the page or through our social
              medias.
            </p>
          )}
        </S.PaperLike>
      </Fade>
    </S.SuggestionModal>
  )
}
