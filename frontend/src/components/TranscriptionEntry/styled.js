import styled from "styled-components"
import { Box, Typography } from "@material-ui/core"

export const TranscriptionEntryBox = styled(Box)`
  & div:first-child {
    color: ${props => props.theme.palette.text.secondary};
  }

  & div:first-child a {
    color: ${props => props.theme.palette.text.secondary};
  }

  & div:last-child {
    color: ${props => props.theme.palette.text.primary};
    font-weight: bold;
  }

  & div:last-child a {
    color: ${props => props.theme.palette.text.primary};
    font-weight: bold;
  }
`

export const ClassificationEntry = styled(Typography)`
  padding: ${props => props.theme.spacing(2)}px;
`
export const LinkThatApplyChanges = styled.a``

export const IPASymbolVisualizer = styled.div`
  ${({ isWord }) => isWord && `color: red !important;`}
`
