import { sleep } from "../components/utils/general"

export async function transcribeText(text, chosenLanguage, withStress) {
  const fakePayload = {
    withStress: false,
    language: "en-us",
    transcription: [
      { phone: "wʌnhʌndɹɪd twɛnti θɹiː", word: "123" },
      { phone: "sʌmθɪŋ", word: "something" },
      { phone: "mʌst", word: "must" },
      { phone: "biː", word: "be" },
      { phone: "ɐvɔɪdᵻd", word: "avoided" },
    ],
  }
  await sleep(2000)

  return fakePayload
}
