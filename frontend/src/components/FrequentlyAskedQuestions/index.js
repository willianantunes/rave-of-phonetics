import React from "react"
import * as S from "./styled"
import { slugify } from "../../utils/general"

const entries = [
  {
    question: "How do I use Rave of Phonetics?",
    text: `The main function of Rave of Phonetics is to provide you a phonemic transcription of a word or text in order 
    to help you pronounce it. You can also see its syllables, stress marks and the phonetic version as well, if they are 
    available. Simply type a word in the space provided and read the transcription as well as listen to the audio 
    to improve your listening skills.`,
  },
  {
    question: "Can I improve my accent with this page?",
    text: `Yes. The computer-generated audio is programmed to mimic the dialect of the region you selected and if you 
    practice enough you will acquire the accent.`,
  },
  {
    question: "What does pitch mean?",
    text: `Pitch refers to how high or low a voice is, like in the case of men and women. Also, changes in pitch could signal a 
    question or emotional information.`,
  },
  {
    question: "Why do I need a history section?",
    text: `Good question. Well, sometimes you want to go back and check which words you searched for in a particular week and 
    practice them. This option is also great for identifying which kinds of words, and sounds, give you trouble.`,
  },
  {
    question: "How do I share my transcriptions?",
    text: `Sharing is caring. At the bottom of the <strong>IPA Transcription Tool</strong> panel, there is an option named 
    <strong>copy link</strong>. Just type in the desired word you would like to transcribe, apply your options of stress, 
    syllables, etc. and after that you can simply click on <strong>copy link</strong>. Then 
    it will be available on your clipboard! Just press CTRL+V on your social media and you'll see it!`,
  },
  {
    question: "Is there a blog for this page?",
    text: `Of course, there is. If you click <a href="/blog">here</a>, you will find a blog section that has interesting 
    topics related to Phonetics and Languages. Please share with all your friends 
    <span role="img" aria-label="slightly smiling face">😊</span>`,
  },
  {
    question: "Can I practice my English here with a tutor?",
    text: `Not at the moment, but soon. We are constantly trying to improve the site to offer you and other language 
    learners the opportunity to improve their language skills. More to come soon.`,
  },
  {
    question: "How do I understand the transcription?",
    text: `Thanks for asking this question, which others might also have. Phonetic and phonemic transcription uses symbols 
    from the IPA (International Phonetic Alphabet) which you can check 
    <a target="noreferrer noopener" href="https://www.google.com/search?q=phonemic+charts+for+english">HERE</a>. Each symbol 
    represents a sound in a particular language and you can practice them 
    <a target="_blank" rel="noreferrer noopener" href="https://www.internationalphoneticalphabet.org/ipa-sounds/ipa-chart-with-sounds/">HERE</a>.`,
  },
  {
    question: "What does ‘show stress’ mean?",
    text: `Glad you asked, no need to stress. This option is used to see which syllable of the word has primary and 
    secondary stress. This option shows standard pronunciation.`,
  },
  {
    question: "Why do I need to loop the speech?",
    text: `Well, you don’t have to but this option could come in handy in case you want to listen to a sound many times and 
    therefore you would not have to keep clicking the option on or off. This is also helpful for getting your ear “familiar” 
    with a specific sound or sequence of sounds.`,
  },
  {
    question: "How do I leave a comment?",
    text: `Ah, yes. Please let us know what you think. If you want to leave a comment you can go to the bottom of the 
    page and find our comment section. They are available in our home, changelog, FAQ and blog sections. Also, you can 
    get in touch with us through our social medias (see the bottom bar).`,
  },
  {
    question: "How can I ask questions?",
    text: `We encourage you to ask us any question that you do not find in the FAQ section. The easiest way is go down 
    this page and post something in the comment section. You can contact us through our social media 
    profiles as well (see the bottom bar).`,
  },
  {
    question: "What is the difference between phonetic and phonemic?",
    text: `This is an excellent question. For the sake of accessibility, we use the word ‘phonetic’ for all the 
    transcription that is done on the site. However, there is a slight difference: phonemic could be understood as the 
    ‘theoretical’ sounds and ‘phonetic’ as the real sounds made by speakers. We are working hard to bring you both 
    options but for now you will see mainly phonemic transcriptions.`,
  },
  {
    question: "Is there an option for phonetic variations of the word?",
    text: `I knew we would have some experts ask this question. For the moment, we mainly provide phonemic transcriptions. 
    Phonetic transcription, syllables and allophone variations are still being developed as well as receiving 
    contributions and suggestions by our great community of learners and experts in the area. If you'd like to check 
    alternate variations of the word, you should check if the transcription is underlined, if so, just click on it to 
    see its variations. The details can be seen if you click on the word, which will be underlined as well.`,
  },
  {
    question: "I would like to add or fix a transcription. Is it possible? How do I do that?",
    text: `Sure thing! First you try to transcribe the desired word or phrase and then click on the underlined word. 
    You should see the option <strong>apply suggestion</strong>. If you click on it, a window will open describing what 
    you can do. If you'd like to provide only the phonemic, just fill the field related to that and give us some reasons 
    why you made the suggestion before you click on <strong>send suggestion</strong>. The same applies to phonetic. 
    Syllables will be handled by us, so you don't have to worry.`,
  },
]

const entriesWithAnchor = entries.map(entry => {
  entry.anchor = slugify(entry.question)
  return entry
})

export function FrequentlyAskedQuestions() {
  return (
    <>
      <S.Title>
        Frequently asked questions{" "}
        <span role="img" aria-label="thinking face">
          🤔
        </span>
      </S.Title>
      <S.FAQsWrapper>
        <ul>
          {entriesWithAnchor.map(entry => (
            <li key={entry.anchor}>
              <S.AnchorLink href={`#${entry.anchor}`}>{entry.question}</S.AnchorLink>
            </li>
          ))}
        </ul>
        {entriesWithAnchor.map(entry => (
          <S.FAQEntry key={entry.question}>
            <S.FAQEntryTitle>
              <S.AnchorWorkaround id={entry.anchor} />
              {entry.question}
            </S.FAQEntryTitle>
            <S.FAQEntryText dangerouslySetInnerHTML={{ __html: entry.text }} />
          </S.FAQEntry>
        ))}
      </S.FAQsWrapper>
    </>
  )
}
