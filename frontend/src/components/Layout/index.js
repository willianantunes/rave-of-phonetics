import React from "react"
import * as S from "./styled"
import Header from "../Header"
import Footer from "../Footer"
import PropTypes from "prop-types"
import { SnackbarNotes } from "../SnackbarNotes"

const Layout = ({ children }) => {
  return (
    <>
      <Header />
      <S.Main>{children}</S.Main>
      {/*<Footer />*/}
      <SnackbarNotes />
    </>
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout
