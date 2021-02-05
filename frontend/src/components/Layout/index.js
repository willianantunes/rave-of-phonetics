import React from "react"
import * as S from "./styled"
import Header from "../Header"
import Footer from "../Footer"
import PropTypes from "prop-types"

const Layout = ({ children }) => {
  return (
    <>
      <Header />
      <S.Main>{children}</S.Main>
      {/*<Footer />*/}
    </>
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout
