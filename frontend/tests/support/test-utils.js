import React from "react"
import { render } from "@testing-library/react"
import TopLayout from "../../src/gatsby-theme-material-ui-top-layout/components/top-layout"
import theme from "../../src/gatsby-theme-material-ui-top-layout/theme"
import { Context as ResponsiveContext } from "react-responsive"

// See more details at: https://testing-library.com/docs/react-testing-library/setup/#custom-render
// https://github.com/styled-components/styled-components/issues/1319#issuecomment-692018195
// https://stackoverflow.com/questions/48503037/cant-get-jest-to-work-with-styled-components-which-contain-theming

const AllTheProviders = ({ children }) => {
  return TopLayout({ children, theme })
}

const ResponsiveAllTheProviders = width => {
  return ({ children }) => {
    return <ResponsiveContext.Provider value={{ width }}>{TopLayout({ children, theme })}</ResponsiveContext.Provider>
  }
}

const customRender = (ui, options) => {
  if (options && "useWidthReactResponsive" in options) {
    return render(ui, { wrapper: ResponsiveAllTheProviders(options.useWidthReactResponsive), ...options })
  }

  return render(ui, { wrapper: AllTheProviders, ...options })
}

// Re-export everything
export * from "@testing-library/react"

// Override render method
export { customRender as render }
