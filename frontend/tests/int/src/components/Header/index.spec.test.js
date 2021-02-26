import React from "react"
import Header from "../../../../../src/components/Header"
import { render } from "../../../../support/test-utils"
import theme from "../../../../../src/gatsby-theme-material-ui-top-layout/theme"
import { fireEvent, screen } from "@testing-library/react"
import { Helmet } from "react-helmet/es/Helmet"

describe("Header", () => {
  beforeEach(() => {
    window.__toggleTheme = jest.fn().mockImplementation(() => {
      window.__theme = window.__theme === "dark" ? "light" : "dark"
    })
    window.__theme = "light"
  })

  afterEach(() => {
    delete window.__toggleTheme
    delete window.__theme
  })

  it("has home link less than tablet", () => {
    const { container } = render(<Header />, { useWidthReactResponsive: theme.breakpoints.values.md })

    const testId = "link-home-less-than-tablet"
    const element = container.querySelector(`[data-testid="${testId}"]`)

    expect(element.textContent).toBe("RoP")
    expect(element.closest("a")).toHaveAttribute("href", "/")
  })

  it("has home link greater than tablet", () => {
    const { container } = render(<Header />, { useWidthReactResponsive: theme.breakpoints.values.md + 1 })

    const testId = "link-home-greater-than-tablet"
    const element = container.querySelector(`[data-testid="${testId}"]`)

    expect(element.textContent).toBe("Rave of Phonetics")
    expect(element.closest("a")).toHaveAttribute("href", "/")
  })

  it("has blog link", () => {
    const { container } = render(<Header />)

    const testId = "link-blog"
    const element = container.querySelector(`[data-testid="${testId}"]`)

    expect(element.textContent).toBe("Blog")
    expect(element.closest("a")).toHaveAttribute("href", "/blog")
  })

  it("has changelog link", () => {
    const { container } = render(<Header />)

    const testId = "link-changelog"
    const element = container.querySelector(`[data-testid="${testId}"]`)

    expect(element.textContent).toBe("Changelog")
    expect(element.closest("a")).toHaveAttribute("href", "/changelog")
  })

  it("has toggle theme", async () => {
    const { container } = render(<Header />)

    const testId = "button-toggle-theme"
    const element = container.querySelector(`[data-testid="${testId}"]`)

    const titleWhenLight = "Change to light mode"
    const titleWhenDark = "Change to dark mode"

    // https://github.com/testing-library/react-testing-library/issues/402
    // https://stackoverflow.com/questions/44073960/unit-testing-react-helmet-code
    expect(element.classList.contains("theme-light")).toBeTruthy()
    expect(element.getAttribute("title")).toBe(titleWhenDark)
    expect(element.getAttribute("aria-pressed")).toBe("false")

    fireEvent.click(element)
    await screen.findByTitle(titleWhenLight)

    expect(window.__toggleTheme).toHaveBeenCalledTimes(1)
    expect(element.classList.contains("theme-dark")).toBeTruthy()
    expect(element.getAttribute("title")).toBe(titleWhenLight)
    expect(element.getAttribute("aria-pressed")).toBe("true")
  })
})
