import React from "react"
import MediaQuery from "react-responsive"
import theme from "../../gatsby-theme-material-ui-top-layout/theme"

export const GreaterThanMobile = ({ children }) => {
  return <MediaQuery minWidth={theme.breakpoints.values.mobile}>{children}</MediaQuery>
}

export const LessThanMobile = ({ children }) => {
  return <MediaQuery maxWidth={theme.breakpoints.values.mobile}>{children}</MediaQuery>
}

export const GreaterThanTablet = ({ children }) => {
  return <MediaQuery minWidth={theme.breakpoints.values.tablet}>{children}</MediaQuery>
}

export const LessThanTablet = ({ children }) => {
  return <MediaQuery maxWidth={theme.breakpoints.values.tablet}>{children}</MediaQuery>
}
