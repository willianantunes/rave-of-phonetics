import { createMuiTheme } from "@material-ui/core"

const theme = createMuiTheme({
  typography: {
    fontFamily: ["Montserrat", "sans-serif"].join(","),
  },
  palette: {
    primary: {
      main: "#26a69a",
    },
    secondary: {
      main: "#b2ebf2",
    },
  },
  spacing: [0, 4, 8, 16, 32, 64],
  breakpoints: {
    values: {
      mobile: 320,
      tablet: 768,
      desktop: 992,
      desktopL: 1280,
    },
  },
})

export default theme
