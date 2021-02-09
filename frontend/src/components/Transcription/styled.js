import React from "react"
import Card from "@material-ui/core/Card"
import Typography from "@material-ui/core/Typography"
import styled from "styled-components"
import { Button } from "gatsby-theme-material-ui"
import { Box, LinearProgress } from "@material-ui/core"

export const TranscribeButton = styled(Button)`
  & svg {
    width: 25px;
  }
`

export const CustomCard = styled(Card)`
  & .MuiFormGroup-row {
    justify-content: center;
  }
`

export const HelloMyFriendTypography = styled(Typography)`
  font-size: 20px;
`

export const LoadingTranscription = styled(LinearProgress)`
  margin: 35px 0px 20px 0px;
`

export const TranscriptionSection = styled(Box)`
  margin: 15px 0px 0px 0px;
  gap: 20px;
  display: flex;
  flex-flow: wrap;

  & div > div:first-child {
    color: dimgrey;
  }

  & div > div:last-child {
    color: black;
    font-weight: bold;
  }
`
