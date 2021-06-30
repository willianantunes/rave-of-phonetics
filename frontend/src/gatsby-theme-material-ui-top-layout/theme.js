import { createMuiTheme } from "@material-ui/core"

export const themeConfiguration = {
  typography: {
    fontFamily: ["Arvo", "serif"].join(","),
  },
  palette: {
    type: "light",
    primary: {
      main: "#26a69a",
    },
    secondary: {
      main: "#006064",
    },
  },
  spacing: [0, 4, 8, 16, 32, 64],
  breakpoints: {
    values: {
      // https://material-ui.com/customization/breakpoints/
      // Standard: xs: 0, sm: 600, md: 960, lg: 1280, xl: 1920
      xs: 0,
      sm: 400,
      md: 768,
      lg: 998,
      xl: 1280,
    },
  },
}

export default createMuiTheme(themeConfiguration)
