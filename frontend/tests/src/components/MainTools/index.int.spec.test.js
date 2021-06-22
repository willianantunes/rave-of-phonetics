import React from "react"
import "fake-indexeddb/auto"
import { render } from "../../../support/test-utils"
import { fireEvent, screen } from "@testing-library/react"
import { useGoogleReCaptcha } from "react-google-recaptcha-v3"
import { debounce } from "lodash"
import { transcribe } from "../../../../src/services/rop-api"
import { createTranscriptionDetails } from "../../../support/domain-utils"
import MainTools from "../../../../src/components/MainTools"

jest.mock("react-google-recaptcha-v3")
jest.mock("lodash")
jest.mock("../../../../src/services/rop-api")

describe("MainTools component", () => {
  describe(`IPA Transcription Tool`, () => {
    it("Should transcribe text without any other options selected", async () => {
      // Arrange
      const fakeToken = "fake-token"
      const fakeGoogleReCaptchaObject = { executeRecaptcha: jest.fn(() => fakeToken) }
      useGoogleReCaptcha.mockReturnValue(fakeGoogleReCaptchaObject)
      debounce.mockImplementation(fn => fn)
      const fakeTranscriptionDetails = createTranscriptionDetails()
      transcribe.mockReturnValue(fakeTranscriptionDetails.transcriptionSetup)
      // Rendering
      const { container } = render(<MainTools />)
      // Consult what was rendered
      const buttonTranscribeTestId = "button-transcribe"
      const buttonTranscribe = container.querySelector(`[data-testid="${buttonTranscribeTestId}"]`)
      const wrapperTestId = "wrapper-text-to-be-transcribed"
      const wrapper = container.querySelector(`[data-testid="${wrapperTestId}"]`)
      const textarea = wrapper.querySelector("textarea")
      // Act
      const textToBeTranscribed = fakeTranscriptionDetails.text
      fireEvent.change(textarea, { target: { value: textToBeTranscribed } })
      fireEvent.click(buttonTranscribe)
      // Assert
      const transcriptionOne = await screen.findByTestId("transcription-entry-0")
      const transcriptionTwo = await screen.findByTestId("transcription-entry-1")
      const transcriptionThree = await screen.findByTestId("transcription-entry-2")
      expect(document.querySelector(`[data-testid="transcription-entry-3"]`)).not.toBeInTheDocument()
      expect(transcriptionOne.querySelector("div").textContent).toEqual("Rave,")
      expect(transcriptionOne.querySelector("div + div").textContent).toEqual("ɹeɪv")
      expect(transcriptionTwo.querySelector("div").textContent).toEqual("live")
      expect(transcriptionTwo.querySelector("div + div").textContent).toEqual("laɪv")
      expect(transcriptionThree.querySelector("div").textContent).toEqual("Phonetics!")
      expect(transcriptionThree.querySelector("div + div").textContent).toEqual("fənɛtɪks")
    })
  })
})
