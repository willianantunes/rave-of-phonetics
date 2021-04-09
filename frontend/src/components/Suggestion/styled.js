import React from "react"
import styled from "styled-components"
import { CircularProgress, FormControl, FormGroup, Modal, Typography } from "@material-ui/core"
import { Button, Link } from "gatsby-theme-material-ui"
import { Send } from "styled-icons/boxicons-regular"

export const SuggestionModal = styled(Modal)`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 15px;
`

export const PaperLike = styled.div`
  background-color: ${props => props.theme.palette.background.paper};
  border: 2px solid #000;
  box-shadow: ${props => props.theme.shadows[5]};
  padding: ${props => props.theme.spacing(2, 4, 3)};
`

export const SuggestionForm = styled.form`
  flex-basis: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 20px;
`

export const FieldSetWrapper = styled(FormControl).attrs({ component: "fieldset", fullWidth: true })``

export const ActionSection = styled(FormGroup)`
  justify-content: space-between;
  gap: 20px;
  align-items: center;
`

export const SendButton = styled(Button).attrs({
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

export const WaitingRequestProgress = styled(CircularProgress)`
  display: none;
  ${({ visible }) => visible && `display: block;`}
`

export const ErrorMessage = styled(Typography)`
  font-size: 14px;
`

export const ExternalLink = styled(Link)``
