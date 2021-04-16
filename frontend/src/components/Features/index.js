import React from "react"
import * as S from "./styled"
import { FeatureEntry } from "../FeatureEntry"

const features = [
  {
    title: `Syllables, phonetic and phonemic variations, and now you can apply a suggestion <span role="img" aria-label="detective">🕵</span>`,
    createdAt: "April 12th, 2021",
    added: 3,
    updated: 1,
    text: `With this release, now you have more options to study. You are now able to consult the syllables of what you 
    transcribed including the phonetic version too. Let's say you transcribe a word that the phonetic does not exist, if 
    you click on the word you transcribed, you'll see an option to leave a suggestion to us! Thus it may be included in 
    our database. One update is related to the history table, if you transcribe a word, it goes at the beginning 
    of the list. Enjoy!`,
  },
  {
    title: "FAQ page",
    createdAt: "March 8th, 2021",
    added: 1,
    updated: 0,
    text: `Do you have doubts about phonetics? Do you know what we can offer to you? Know more at out <a href="/faq">FAQ page!</a>`,
  },
  {
    title: "Dark mode!",
    createdAt: "February 25th, 2021",
    added: 1,
    updated: 0,
    text: `If you research the benefits of Dark Mode on the web, you'll find many discussions pointing out how important it is, 
    not only in terms of energy-saving which concerns your device but how good it is for you! We hope this helps 
    you during your studies here.`,
  },
  {
    title: "New site, history, blog, off-line functionality and many more ",
    createdAt: "February 19th, 2021",
    added: 5,
    updated: 2,
    text: `You can easily copy the link of your transcription setup, and copy its result as well. When you 
    transcribe a text, it is saved in the history at the bottom of the page. If you click on the row related to it, it will be 
    restored at what you got previously. You can also download us and use as an App, consulting the history of what you 
    have transcribed and play text-to-speech too, off-line if you want! Don't forget to consult our blog. 
    Learn more about phonetics!`,
  },
  {
    title: "To be, or not to be STRESSED: that is the question",
    createdAt: "January 25th, 2021",
    added: 1,
    updated: 0,
    text: `You may have noticed that words appear without any syllable stress markers. 
    That is because it is usually shown this way in other platforms, like dictionaries. 
    However, you are now able to choose whether you want your word to be shown with stress or not. Try it out!`,
  },
  {
    title: `Changelog page`,
    createdAt: "January 17th, 2021",
    added: 1,
    updated: 0,
    text: `It's the launch of this page itself! Now you can check all the notable changes made to this project.`,
  },
  {
    title: `History item now can be consulted`,
    createdAt: "January 10th, 2021",
    added: 0,
    updated: 1,
    text: `When we launched the site some features were already included, like the history of what you transcribed/listened to, 
    but without allowing you to click on the word in the history slot to avoid typing it again. 
    Now, it's available and you can use the generated link to share it with your friends.`,
  },
  {
    title: `Loop speech audio`,
    createdAt: "January 8th, 2021",
    added: 1,
    updated: 0,
    text: `It's quite annoying having to press the PLAY button to repeat a word or phrase you want to hear again many times. 
    Now, you can enable an option which will allow you to listen continuously until you press STOP.`,
  },
  {
    title: `New icons`,
    createdAt: "January 7th, 2021",
    added: 1,
    updated: 0,
    text: `Before if you shared our site through Telegram, WhatsApp and other social media you would get nothing in terms 
    of description, image and/or icons, and now there is information available!`,
  },
  {
    title: `Launch of Rave of Phonetics`,
    createdAt: "January 6th, 2021",
    added: 1,
    updated: 0,
    text: `After some weeks of hard work, we launched this IPA transcription and pronunciation tool! 
    We were tired of using other phonetics transcription sites and instead we decided to build ours.`,
  },
]

export function Features() {
  return (
    <>
      <S.Title>
        Latest updates{" "}
        <span role="img" aria-label="Beating heart">
          💓
        </span>
      </S.Title>
      <S.FeaturesWrapper>
        {features.map(feat => (
          <FeatureEntry
            key={feat.title}
            title={feat.title}
            createdAt={feat.createdAt}
            added={feat.added}
            updated={feat.updated}
            text={feat.text}
          />
        ))}
      </S.FeaturesWrapper>
    </>
  )
}
