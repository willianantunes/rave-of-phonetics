import { slugify } from "../../../../src/utils/general"
import React from "react"

test("Should slugify a phrase that ends with a question mark", () => {
  const samplePhrase = "Is there an option for allophone variations?"

  const result = slugify(samplePhrase)

  expect(result).toBe("is-there-an-option-for-allophone-variations")
})
