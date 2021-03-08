import React, { useEffect, useState } from "react"
import * as S from "./styled"
import * as R from "../Responsive"
import { Link } from "gatsby-theme-material-ui"
import { dispatchEvent } from "../../analytics"
import ToggleTheme from "../ToggleTheme"
import { Menu } from "styled-icons/material-outlined"
import { Drawer, MenuItem } from "@material-ui/core"
import theme from "../../gatsby-theme-material-ui-top-layout/theme"

const trackClick = item => {
  dispatchEvent({
    category: "Menu",
    action: "click",
    label: `Menu - ${item}`,
  })
}

const menuLinkSetup = [
  {
    label: "Blog",
    to: "/blog",
    onClick: () => trackClick("Blog"),
    testId: "link-blog",
  },
  {
    label: "FAQ",
    to: "/faq",
    onClick: () => trackClick("FAQ"),
    testId: "link-faq",
  },
  {
    label: "Changelog",
    to: "/changelog",
    onClick: () => trackClick("Changelog"),
    testId: "link-changelog",
  },
]

const AllButtons = () => {
  return menuLinkSetup.map(({ label, to, testId, onClick }) => {
    return (
      <S.MenuButton key={to} data-testid={testId} to={to} onClick={onClick}>
        {label}
      </S.MenuButton>
    )
  })
}

const AllDrawerChoices = () => {
  return menuLinkSetup.map(({ label, to, testId, onClick }) => {
    return (
      <Link key={to} data-testid={testId} to={to} onClick={onClick}>
        <MenuItem>{label}</MenuItem>
      </Link>
    )
  })
}

const Header = () => {
  const [mobileView, setMobileView] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)

  useEffect(() => {
    const setResponsiveness = () => {
      return window.innerWidth < theme.breakpoints.values.sm ? setMobileView(true) : setMobileView(false)
    }

    setResponsiveness()

    window.addEventListener("resize", () => setResponsiveness())
  }, [])

  const displayDesktop = () => {
    return <AllButtons />
  }

  const displayMobile = () => {
    const handleDrawerClose = () => setDrawerOpen(false)

    return (
      <>
        <S.CustomDrawer anchor={"left"} open={drawerOpen} onClose={handleDrawerClose}>
          <AllDrawerChoices />
        </S.CustomDrawer>
        <S.MenuMobile aria-label="open drawer" onClick={() => setDrawerOpen(true)}>
          <Menu />
        </S.MenuMobile>
      </>
    )
  }

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
        {mobileView ? displayMobile() : displayDesktop()}
        <ToggleTheme />
      </S.CustomToolbar>
    </S.CustomAppBar>
  )
}

export default Header
