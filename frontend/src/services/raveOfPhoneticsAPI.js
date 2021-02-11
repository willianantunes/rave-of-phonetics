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

  // return {
  //   transcription: [
  //     { word: "I", phone: "aɪ" },
  //     { word: "know", phone: "noʊ" },
  //     { word: "of", phone: "ʌv" },
  //     { word: "many", phone: "mɛni" },
  //     { word: "myths", phone: "mɪθs" },
  //     { word: "and", phone: "ænd" },
  //     { word: "legends", phone: "lɛdʒəndz" },
  //     { word: "that", phone: "ðæt" },
  //     { word: "may", phone: "meɪ" },
  //     { word: "contain", phone: "kənteɪn" },
  //     { word: "answers", phone: "ænsɚz" },
  //     { word: "to", phone: "tuː" },
  //     { word: "questions", phone: "kwɛstʃənz" },
  //     { word: "that", phone: "ðæt" },
  //     { word: "may", phone: "meɪ" },
  //     { word: "arise", phone: "ɚɹaɪz" },
  //     { word: "in", phone: "ɪn" },
  //     { word: "your", phone: "jʊɹ" },
  //     { word: "journeys", phone: "dʒɜːniz" },
  //     { word: "into", phone: "ɪntʊ" },
  //     { word: "the", phone: "ðə" },
  //     { word: "labyrinth.", phone: "læbɚɹɪnθ." },
  //     { word: "If", phone: "ɪf" },
  //     { word: "you", phone: "juː" },
  //     { word: "come", phone: "kʌm" },
  //     { word: "across", phone: "əkɹɑːs" },
  //     { word: "questions", phone: "kwɛstʃənz" },
  //     { word: "and", phone: "ænd" },
  //     { word: "challenges", phone: "tʃælɪndʒᵻz" },
  //     { word: "to", phone: "tuː" },
  //     { word: "which", phone: "wɪtʃ" },
  //     { word: "you", phone: "juː" },
  //     { word: "seek", phone: "siːk" },
  //     { word: "knowledge,", phone: "nɑːlɪdʒ," },
  //     { word: "seek", phone: "siːk" },
  //     { word: "me", phone: "miː" },
  //     { word: "out,", phone: "aʊt," },
  //     { word: "and", phone: "ænd" },
  //     { word: "I", phone: "aɪ" },
  //     { word: "will", phone: "wɪl" },
  //     { word: "tell", phone: "tɛl" },
  //     { word: "you", phone: "juː" },
  //     { word: "what", phone: "wʌt" },
  //     { word: "I", phone: "aɪ" },
  //     { word: "can.", phone: "kæn." },
  //   ],
  // }
}
