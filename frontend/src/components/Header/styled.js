import styled from "styled-components"
import { Button } from "gatsby-theme-material-ui"
import { AppBar, Drawer, Toolbar, Typography } from "@material-ui/core"
import { IconButton } from "@material-ui/core"

export const CustomAppBar = styled(AppBar).attrs({
  position: "fixed",
  color: "primary",
})``

export const Title = styled(Typography).attrs({
  component: "p",
  variant: "h6",
})`
  flex-grow: 1;
  ${props => props.theme.breakpoints.up("md")} {
    font-size: 30px;
  }
`

export const CustomToolbar = styled(Toolbar)`
  width: 100%;
  max-width: ${props => props.theme.breakpoints.values.xl}px;
  margin: auto;
`

export const CustomDrawer = styled(Drawer)`
  a {
    padding: 10px 30px;
  }
`

export const MenuButton = styled(Button).attrs({ color: "inherit" })``

export const MenuMobile = styled(IconButton).attrs({ color: "inherit" })`
  margin-right: 0;
  & svg {
    width: 25px;
  }
`
