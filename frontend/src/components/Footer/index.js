import React from "react"
import * as S from "./styled"
import ReactGA from "react-ga"

const trackClick = item => {
  ReactGA.event({
    category: "Social",
    action: "click",
    label: `Social - ${item}`,
  })
}

const Footer = () => {
  return (
    <S.FooterWrapper>
      <S.WrapperSocialButton to="https://twitter.com/raveofphonetics" onClick={() => trackClick("Twitter")}>
        <S.CustomTwitter />
      </S.WrapperSocialButton>
      <S.WrapperSocialButton to="https://www.instagram.com/raveofphonetics/" onClick={() => trackClick("Instagram")}>
        <S.CustomInstagramAlt />
      </S.WrapperSocialButton>
      <S.WrapperSocialButton to="https://www.facebook.com/raveofphonetics/" onClick={() => trackClick("Facebook")}>
        <S.CustomFacebook />
      </S.WrapperSocialButton>
    </S.FooterWrapper>
  )
}

export default Footer
