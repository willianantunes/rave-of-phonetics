import styled from "styled-components"
import { AppBar, Toolbar, Typography } from "@material-ui/core"
import React from "react"

export const CustomAppBar = styled(AppBar).attrs({
  position: "static",
  color: "primary",
})``

export const CustomTypography = styled(Typography).attrs({
  component: "p",
  variant: "h6",
})`
  flex-grow: 1;
  ${props => props.theme.breakpoints.up("tablet")} {
    font-size: 30px;
  }
`

export const CustomToolbar = styled(Toolbar)`
  width: 100%;
  max-width: ${props => props.theme.breakpoints.values.desktopL}px;
  margin: auto;
`
