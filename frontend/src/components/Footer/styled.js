import styled from "styled-components"
import { FacebookCircle, InstagramAlt, Twitter } from "@styled-icons/boxicons-logos"
import { Box } from "@material-ui/core"

export const FooterWrapper = styled(Box).attrs({
  component: "footer",
  justify: "center",
})`
  width: 100%;
  display: flex;
  justify-content: center;
  background-color: ${props => props.theme.palette.primary.main};
  position: fixed;
  bottom: 0;
  color: #fff;
  z-index: 10;
`

export const CustomFacebook = styled(FacebookCircle)`
  width: 25px;
`

export const CustomInstagramAlt = styled(InstagramAlt)`
  width: 25px;
`

export const CustomTwitter = styled(Twitter)`
  width: 25px;
`
