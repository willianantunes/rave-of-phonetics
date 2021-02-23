import React from "react"
import * as S from "./styled"
import * as R from "../Responsive"
import { Button, Link } from "gatsby-theme-material-ui"
import { dispatchEvent } from "../../analytics"

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
            <Link to="/" color="inherit" onClick={() => trackClick("Home")}>
              RoP
            </Link>
          </R.LessThanTablet>
          <R.GreaterThanTablet>
            <Link to="/" color="inherit" onClick={() => trackClick("Home")}>
              Rave of Phonetics
            </Link>
          </R.GreaterThanTablet>
        </S.CustomTypography>
        <Button color="inherit" to="/blog" onClick={() => trackClick("Blog")}>
          Blog
        </Button>
        <Button color="inherit" to="/changelog" onClick={() => trackClick("Changelog")}>
          Changelog
        </Button>
      </S.CustomToolbar>
    </S.CustomAppBar>
  )
}

export default Header
