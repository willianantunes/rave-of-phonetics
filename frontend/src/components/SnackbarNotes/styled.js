import styled from "styled-components"
import { Snackbar } from "@material-ui/core"

export const CustomSnackbar = styled(Snackbar)`
  & .MuiSnackbarContent-root {
    flex-grow: initial;
  }
`
