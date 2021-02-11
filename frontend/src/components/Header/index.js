import React from "react"
import { AppBar } from "@material-ui/core"
import * as S from "./styled"
import { Button, Link } from "gatsby-theme-material-ui"

const Header = () => {
  return (
    <AppBar position="static">
      <S.CustomToolbar variant={"dense"}>
        <S.CustomTypography variant="h6">
          <Link to="/" color="inherit">
            Rave of Phonetics
          </Link>
        </S.CustomTypography>
        <Button color="inherit" to="/blog">
          Blog
        </Button>
        <Button color="inherit" to="/faq">
          FAQ
        </Button>
        <Button color="inherit" to="/changelog">
          Changelog
        </Button>
      </S.CustomToolbar>
    </AppBar>
  )
}

export default Header