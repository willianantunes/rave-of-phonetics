import styled from "styled-components"
import { Box, Typography, lighten } from "@material-ui/core"
import { Link } from "gatsby-theme-material-ui"

export const TranscriptionEntryBox = styled(Box)`
  font-family: "Montserrat", sans-serif;

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
export const LinkThatApplyChanges = styled(Link).attrs({ href: "#" })`
  text-decoration: underline;
`

export const LinkSuggestionModal = styled(Link).attrs({ href: "#" })``

export const IPASymbolVisualizer = styled.div`
  ${({ isWord }) => isWord && `color: ${lighten("#006064", 0.4)} !important;`}
`
