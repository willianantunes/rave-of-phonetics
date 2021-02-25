import React, { useMemo } from "react"
import * as S from "./styled"
import * as R from "../Responsive"
import { Button, Link } from "gatsby-theme-material-ui"
import { dispatchEvent } from "../../analytics"
import useWindowDarkModeStrategy from "../../hooks/useWindowDarkModeStrategy"
import ToggleTheme from "../ToggleTheme"

const trackClick = item => {
  dispatchEvent({
    category: "Menu",
    action: "click",
    label: `Menu - ${item}`,
  })
}

const Header = () => {
  return (
    <S.CustomAppBar>
      <S.CustomToolbar variant={"dense"}>
        <S.CustomTypography>
          <R.LessThanTablet>
            <Link data-testid="link-home-less-than-tablet" to="/" color="inherit" onClick={() => trackClick("Home")}>
              RoP
            </Link>
          </R.LessThanTablet>
          <R.GreaterThanTablet>
            <Link data-testid="link-home-greater-than-tablet" to="/" color="inherit" onClick={() => trackClick("Home")}>
              Rave of Phonetics
            </Link>
          </R.GreaterThanTablet>
        </S.CustomTypography>
        <Button data-testid="link-blog" color="inherit" to="/blog" onClick={() => trackClick("Blog")}>
          Blog
        </Button>
        <Button data-testid="link-changelog" color="inherit" to="/changelog" onClick={() => trackClick("Changelog")}>
          Changelog
        </Button>
        <ToggleTheme />
      </S.CustomToolbar>
    </S.CustomAppBar>
  )
}

export default Header
