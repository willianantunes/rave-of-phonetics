import React from "react"
import Header from "../../../../src/components/Header"
import { render } from "../../../support/test-utils"
import theme from "../../../../src/gatsby-theme-material-ui-top-layout/theme"
import { fireEvent, screen, waitFor } from "@testing-library/react"

describe("Header", () => {
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

  it("has faq link", () => {
    const { container } = render(<Header />)

    const testId = "link-faq"
    const element = container.querySelector(`[data-testid="${testId}"]`)

    expect(element.textContent).toBe("FAQ")
    expect(element.closest("a")).toHaveAttribute("href", "/faq")
  })

  it("has toggle theme", async () => {
    const { container } = render(<Header />)

    const testId = "button-toggle-theme"
    const element = container.querySelector(`[data-testid="${testId}"]`)

    const titleWhenLight = "Change to light mode"
    const titleWhenDark = "Change to dark mode"

    const whenThemeIsLight = "theme-light"
    const whenThemeIsDark = "theme-dark"

    await waitFor(() => expect(document.querySelector(`.${whenThemeIsLight}`)).toBeInTheDocument())

    // https://github.com/testing-library/react-testing-library/issues/402
    // https://stackoverflow.com/questions/44073960/unit-testing-react-helmet-code
    expect(document.body.classList.contains(whenThemeIsLight)).toBeTruthy()
    expect(element.getAttribute("title")).toBe(titleWhenDark)
    expect(element.getAttribute("aria-pressed")).toBe("false")

    fireEvent.click(element)
    await screen.findByTitle(titleWhenLight)
    await waitFor(() => expect(document.querySelector(`.${whenThemeIsDark}`)).toBeInTheDocument())

    expect(document.body.classList.contains(whenThemeIsDark)).toBeTruthy()
    expect(element.getAttribute("title")).toBe(titleWhenLight)
    expect(element.getAttribute("aria-pressed")).toBe("true")
  })
})
