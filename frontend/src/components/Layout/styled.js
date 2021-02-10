import styled from "styled-components"
import { Box } from "@material-ui/core"

export const Main = styled(Box)`
  width: 100%;
  max-width: ${props => props.theme.breakpoints.values.desktopL}px;
  padding-left: 8px;
  padding-right: 8px;
  margin: 25px auto auto;
  //gap: 20px;
  //display: flex;
  // Because of the fixed footer
  //padding-bottom: 80px;
  //height: auto;

  & .MuiCard-root {
    margin-top: 25px;
  }
`

//
// export const Layout = styled.section`
//   background-color: var(--bg);
//   display: block;
//   transition: background-color ${V.Transition.default};
//   will-change: background-color;
// `
//
// export const Main = styled.main.attrs({
//   role: "main",
// })`
//   margin-bottom: ${V.Height.footer};
//   margin-top: ${V.Height.headerSm};
//   min-height: 100vh;
//   padding-bottom: ${V.Space.xxlg};
//   padding-top: ${V.Height.mainTop};
//   width: 100%;
//   ${media.greaterThan("medium")`
//     margin-top: ${V.Height.headerLg};
//   `}
// `
