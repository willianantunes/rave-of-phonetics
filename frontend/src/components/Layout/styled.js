import styled from "styled-components"
import { Box } from "@material-ui/core"

export const Main = styled(Box)`
  width: 100%;
  max-width: ${props => (props.blog ? "800" : props.theme.breakpoints.values.xl)}px;
  padding-left: 8px;
  padding-right: 8px;
  margin: 75px auto auto;
  // Because of the fixed footer
  padding-bottom: 80px;

  & .MuiCard-root {
    margin-top: 25px;
  }
`
