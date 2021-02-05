import React from "react"
import CardContent from "@material-ui/core/CardContent"
import Typography from "@material-ui/core/Typography"
import * as S from "./styled"
import { Button } from "gatsby-theme-material-ui"
import { FormControl, FormControlLabel, FormGroup, Radio, RadioGroup, Switch, TextField } from "@material-ui/core"

export default function Transcription() {
  const initialState = {
    withStress: false,
    chosenLanguage: "en-us",
    textToBeTranscribed: "",
  }
  const [state, setState] = React.useState(initialState)
  const handleChange = evt => {
    const value = evt.target.type === "checkbox" ? evt.target.checked : evt.target.value
    setState({ ...state, [evt.target.name]: value })
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
            value={state.textToBeTranscribed}
            onChange={handleChange}
            name="textToBeTranscribed"
          />
        </FormControl>
        <FormControl component="fieldset" fullWidth={true}>
          <RadioGroup
            row
            aria-label="language"
            name="chosenLanguage"
            value={state.chosenLanguage}
            onChange={handleChange}
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
            control={<Switch checked={state.withStress} onChange={handleChange} name="withStress" />}
            label="With stress"
          />
        </FormGroup>
        <FormGroup row>
          <Button variant="contained" color="primary">
            Transcribe
          </Button>
        </FormGroup>
      </CardContent>
    </S.CustomCard>
  )
}
