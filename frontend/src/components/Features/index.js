import React from "react"
import * as S from "./styled"
import { FeatureEntry } from "../FeatureEntry"

const features = [
  {
    title: "To be, or not to be STRESSED: that is the question",
    createdAt: "January 25th, 2021",
    added: 1,
    updated: 0,
    text: `You may have noticed that we only had been outputting words without their stressed version. That is because it was the standard behavior. You are able now to choose whether you want your word with stress or not.`,
  },
  {
    title: `French, Spanish and Italian!`,
    createdAt: "January 22th, 2021",
    added: 3,
    updated: 0,
    text: `Prior this feature you were only able to use English (American and British). On this day and forth you are able to use French, Spanish and Italian as well. Try to transcribe something using these well known languages. More to come!`,
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
    text: `When we launched the site some features were already included, like the history of what you transcribe/listen, but without allowing you to click on a row to avoid you to type it again, now it's available and you can use the generated link to share with your friends.`,
  },
  {
    title: `Loop speech audio`,
    createdAt: "January 8th, 2021",
    added: 1,
    updated: 0,
    text: `It's quite annoying to have to press PLAY button to repeat a word or phrase you want to hear again many times, now you can activate an option which will allow you to listen repeatedly until you press STOP.`,
  },
  {
    title: `New icons`,
    createdAt: "January 7th, 2021",
    added: 1,
    updated: 0,
    text: `Before if you share our site through Telegram, WhatsApp and others you would get nothing in terms of description, image and/or icon, and now you have!`,
  },
  {
    title: `Launch of Rave of Phonetics`,
    createdAt: "January 6th, 2021",
    added: 1,
    updated: 0,
    text: `After some weeks of work, we launched this IPA transcription and spelling tool! We were tired of using another phonetics transcription sites and as such we decided to build ours.`,
  },
]

export function Features() {
  return (
    <>
      <S.Title>Latest updates</S.Title>
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
