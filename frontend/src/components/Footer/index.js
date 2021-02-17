import React from "react"
import * as S from "./styled"
import { IconButton } from "gatsby-theme-material-ui"

const Footer = () => {
  return (
    <S.FooterWrapper>
      <IconButton color="inherit" rel="noreferrer noopener" target="_blank" to="https://twitter.com/raveofphonetics">
        <S.CustomTwitter />
      </IconButton>
      <IconButton
        color="inherit"
        rel="noreferrer noopener"
        target="_blank"
        to="https://www.instagram.com/raveofphonetics/"
      >
        <S.CustomInstagramAlt />
      </IconButton>
      <IconButton
        color="inherit"
        rel="noreferrer noopener"
        target="_blank"
        to="https://www.facebook.com/raveofphonetics/"
      >
        <S.CustomFacebook />
      </IconButton>
    </S.FooterWrapper>
  )
}

export default Footer
