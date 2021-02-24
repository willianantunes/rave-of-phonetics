import React from "react"
import Header from "../../../../../src/components/Header"
import { render } from "../../../../support/test-utils"
import theme from "../../../../../src/gatsby-theme-material-ui-top-layout/theme"

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
})
