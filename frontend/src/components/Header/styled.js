import styled from "styled-components"
import { Toolbar, Typography } from "@material-ui/core"

export const CustomTypography = styled(Typography)`
  flex-grow: 1;
`

export const CustomToolbar = styled(Toolbar)`
  width: 100%;
  max-width: ${props => props.theme.breakpoints.values.desktopL}px;
  margin: auto;
`
