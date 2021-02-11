import { sleep } from "../utils/general"
import axios from "axios"

// TODO
const endpoint = "http://localhost:8080/api/v1/transcribe"
const options = {
  method: "POST",
  url: endpoint,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json;charset=UTF-8",
  },
}

export async function transcribeText(text, language, withStress) {
  // TODO
  options.data = { text, language, "with-stress": withStress }

  const response = await axios(options)

  // await sleep(1000)

  return await response.data
  // return {
  //   transcription: [
  //     { word: "C'mon", phone: "kəmɑːn" },
  //     { word: "man", phone: "mæn" },
  //     { word: "you", phone: "juː" },
  //     { word: "should", phone: "ʃʊd" },
  //     { word: "do", phone: "duː" },
  //     { word: "something", phone: "sʌmθɪŋ" },
  //     { word: "different", phone: "dɪfɹənt" },
  //   ],
  // }
}
