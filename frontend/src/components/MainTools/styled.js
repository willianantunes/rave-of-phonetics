import styled from "styled-components"
import { Box } from "@material-ui/core"

export const ToolsWrapper = styled(Box).attrs({ component: "section" })`
  display: flex;
  flex-wrap: wrap;
  gap: 25px;

  & .MuiCard-root {
    margin-top: 0;
  }

  & .MuiCardContent-root {
    display: flex;
    flex-direction: column;
    height: 100%;
  }
`
