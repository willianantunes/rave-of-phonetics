import styled from "styled-components"
import { Box, Chip, Paper, Typography } from "@material-ui/core"
import React from "react"

export const CustomPaper = styled(Paper)`
  padding: ${props => props.theme.spacing(3)}px;
  color: ${props => props.theme.palette.text.primary};
  max-width: 320px;
  display: flex;
  flex-flow: column;
`

export const WrapperTitle = styled(Box)`
  flex: 0 1 auto;
`
export const WrapperDetails = styled(Box).attrs({ component: "article" })`
  flex: 1 1 auto;
`
export const WrapperQuantity = styled(Box)`
  flex: 0 1 50px;
  display: flex;
  justify-content: flex-end;
  align-items: flex-end;
  gap: 20px;
`

export const Title = styled(Typography).attrs({
  component: "h2",
  variant: "h6",
  align: "center",
})``

export const WhenItWasAvailable = styled(Typography).attrs({})`
  font-style: oblique;
  margin: ${props => props.theme.spacing(3)}px 0px ${props => props.theme.spacing(3)}px 0px;
`

export const FeatureAdded = styled(Chip)``

export const FeatureUpdated = styled(Chip)``
