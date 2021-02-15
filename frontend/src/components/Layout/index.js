import React from "react"
import * as S from "./styled"
import Header from "../Header"
import Footer from "../Footer"
import PropTypes from "prop-types"
import { SnackbarNotes } from "../SnackbarNotes"
import SEO from "../SEO"

const Layout = ({ blog, children }) => {
  return (
    <>
      <Header />
      <S.Main blog={blog}>{children}</S.Main>
      <Footer />
      <SnackbarNotes />
    </>
  )
}

Layout.defaultProps = {
  blog: false,
}

Layout.propTypes = {
  blog: PropTypes.bool,
  children: PropTypes.node.isRequired,
}

export default Layout
