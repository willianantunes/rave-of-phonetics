import React from "react"
import * as S from "./styled"
import * as R from "../Responsive"
import { Button, Link } from "gatsby-theme-material-ui"

const Header = () => {
  return (
    <S.CustomAppBar>
      <S.CustomToolbar variant={"dense"}>
        <S.CustomTypography>
          <R.LessThanTablet>
            <Link to="/" color="inherit">
              RoP
            </Link>
          </R.LessThanTablet>
          <R.GreaterThanTablet>
            <Link to="/" color="inherit">
              Rave of Phonetics
            </Link>
          </R.GreaterThanTablet>
        </S.CustomTypography>
        <Button color="inherit" to="/blog">
          Blog
        </Button>
        <Button color="inherit" to="/changelog">
          Changelog
        </Button>
      </S.CustomToolbar>
    </S.CustomAppBar>
  )
}

export default Header
