import React from "react"
import Card from "@material-ui/core/Card"
import Typography from "@material-ui/core/Typography"
import styled from "styled-components"
import { Button } from "gatsby-theme-material-ui"
import { FormControl, LinearProgress } from "@material-ui/core"

export const CustomCard = styled(Card)`
  & .MuiFormGroup-row {
    justify-content: center;
  }
`

export const PlayOrStopButton = styled(Button).attrs(props => ({
  variant: "contained",
  color: "primary",
}))`
  & svg {
    width: 25px;
  }
`

export const UnsupportedVoiceEngine = styled(Typography)`
  margin: 15px 0px 15px 0px;
`

export const AvailableVoicesFormControl = styled(FormControl)`
  margin: 15px 0px 15px 0px;
`

export const LoadingVoices = styled(LinearProgress)`
  margin: 15px 0px 15px 0px;
`
