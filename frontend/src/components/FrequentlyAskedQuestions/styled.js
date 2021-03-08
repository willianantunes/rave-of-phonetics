import styled from "styled-components"
import { Box, Typography } from "@material-ui/core"

export const Title = styled(Typography).attrs({
  component: "h1",
  variant: "h5",
  align: "center",
})``

export const FAQsWrapper = styled(Box)`
  margin-top: 25px;
`

export const AnchorLink = styled.a`
  color: ${props => props.theme.palette.text.primary};
`

export const FAQEntry = styled(Box)``

export const FAQEntryTitle = styled(Typography).attrs({
  component: "h2",
  variant: "h6",
  align: "left",
})`
  position: relative;
  font-weight: bolder;
`

export const FAQEntryText = styled(Typography).attrs({
  align: "justify",
})`
  margin: 1rem;
  & a {
    color: ${props => props.theme.palette.text.primary};
  }
`

export const AnchorWorkaround = styled.span`
  // https://stackoverflow.com/a/13138463/3899136
  position: absolute;
  top: -50px;
`
