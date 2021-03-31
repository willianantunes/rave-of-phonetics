import React from "react"
import Card from "@material-ui/core/Card"
import Typography from "@material-ui/core/Typography"
import styled from "styled-components"
import { Button } from "gatsby-theme-material-ui"
import { Box, FormGroup, LinearProgress } from "@material-ui/core"
import { LinkAlt, Send, CopyAlt } from "styled-icons/boxicons-regular"

export const Title = styled(Typography).attrs({
  component: "h1",
  variant: "h5",
  align: "center",
})``

export const ActionsWrapper = styled(FormGroup)`
  gap: 10px;
`

export const TranscribeButton = styled(Button).attrs({
  variant: "contained",
  color: "primary",
  endIcon: <Send />,
  size: "small",
  type: "submit",
})`
  & svg {
    width: 25px;
  }
`

export const GenerateLink = styled(Button).attrs({
  variant: "contained",
  color: "primary",
  endIcon: <LinkAlt />,
  size: "small",
})`
  & svg {
    width: 25px;
  }
`

export const CopyTranscription = styled(Button).attrs({
  variant: "contained",
  color: "primary",
  endIcon: <CopyAlt />,
  size: "small",
})`
  & svg {
    width: 25px;
  }
`

export const MessageLinkCopied = styled(Typography)`
  padding: ${props => props.theme.spacing(2)}px;
`

export const CustomCard = styled(Card)`
  flex: 1 1 550px;
  & .MuiFormGroup-row {
    justify-content: center;
  }
`

export const TranscriptionForm = styled.form`
  flex-basis: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`

export const LoadingTranscription = styled(LinearProgress)`
  margin: 35px 0px 20px 0px;
`

export const TranscriptionSection = styled(Box).attrs({ "data-testid": "section-transcription-result" })`
  margin: 15px 0px 0px 0px;
  gap: 20px;
  display: flex;
  flex-flow: wrap;
`
