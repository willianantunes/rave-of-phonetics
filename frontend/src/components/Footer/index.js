import React from "react"
import * as S from "./styled"

const Footer = () => {
  return (
    <S.FooterWrapper>
      <S.WrapperSocialButton to="https://twitter.com/raveofphonetics">
        <S.CustomTwitter />
      </S.WrapperSocialButton>
      <S.WrapperSocialButton to="https://www.instagram.com/raveofphonetics/">
        <S.CustomInstagramAlt />
      </S.WrapperSocialButton>
      <S.WrapperSocialButton to="https://www.facebook.com/raveofphonetics/">
        <S.CustomFacebook />
      </S.WrapperSocialButton>
    </S.FooterWrapper>
  )
}

export default Footer
