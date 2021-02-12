import styled from "styled-components"
import { FacebookCircle, InstagramAlt, Twitter } from "@styled-icons/boxicons-logos"
import { Grid } from "@material-ui/core"

export const FooterWrapper = styled(Grid).attrs(props => ({
  component: "footer",
  container: true,
  justify: "center",
}))`
  background-color: ${props => props.theme.palette.primary.main};
  position: fixed;
  bottom: 0;
  color: #fff;
  z-index: 500;
  ${props => props.theme.breakpoints.up("mobile")} {
    //background-color: yellow;
    //height: 150px;
  }
`

// export const FooterWrapper = styled(Grid, {
//   component: "footer",
//   container: true,
//   spacing: 16,
// })(theme => ({
//   background: theme.palette,
//   padding: `${theme.spacing.unit * 4}px 0`,
//   "& a:link, & a:visited": {
//     cursor: "pointer",
//     color: "inherit",
//     textDecoration: "none",
//   },
//   "& a:hover, & a:active": {
//     cursor: "pointer",
//     color: "inherit",
//     textDecoration: "underline",
//   },
// }))

export const CustomFacebook = styled(FacebookCircle)`
  width: 25px;
`

export const CustomInstagramAlt = styled(InstagramAlt)`
  width: 25px;
`

export const CustomTwitter = styled(Twitter)`
  width: 25px;
`
