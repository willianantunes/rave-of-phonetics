import React from "react"
import {
  AppBar,
  Box,
  darken,
  makeStyles,
  Toolbar,
  Typography,
} from "@material-ui/core"
import {
  BottomNavigationAction,
  Button,
  CardActionArea,
  Fab,
  IconButton,
  Link,
} from "gatsby-theme-material-ui"
import styled from "styled-components"
import media from "styled-media-query"
import { Menu, AccountCircle, Lock } from "@styled-icons/material"
import {
  InstagramAlt,
  Twitter,
  FacebookCircle,
} from "@styled-icons/boxicons-logos"

const CustomFacebook = styled(FacebookCircle)`
  width: 25px;
`

const CustomInstagramAlt = styled(InstagramAlt)`
  width: 25px;
`

const CustomTwitter = styled(Twitter)`
  width: 25px;
`

const CustomTypography = styled(Typography)`
  flex-grow: 1;
`

const RavePage = () => {
  return (
    <Box>
      <AppBar position="static">
        <Toolbar>
          <CustomTypography variant="h6">Rave of Phonetics</CustomTypography>
          <IconButton color="inherit">
            <CustomTwitter />
          </IconButton>
          <IconButton color="inherit">
            <CustomInstagramAlt />
          </IconButton>
          <IconButton color="inherit">
            <CustomFacebook />
          </IconButton>
          <Button color="inherit" to="/">
            Blog
          </Button>
          <Button color="inherit">Changelog</Button>
        </Toolbar>
      </AppBar>
    </Box>
  )
}

export default RavePage
