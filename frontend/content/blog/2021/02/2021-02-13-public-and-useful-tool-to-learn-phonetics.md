---
id: a97c5410-6e3d-11eb-9fbe-31a4fdd703fc
title: Public and useful tool to learn phonetics
date: 2021-02-13T19:28:19.016Z
thumbnail: tools-rave-of-phonetics.png
description: Know where this site came from, how it was built, and understand
  how a problem faced by a person can be translated into a tool that everyone
  can use.
tags:
  - challenge
  - history
  - pronunciation
---
Have you ever used a tool out there that, well, has been serving you, but it wasn't good enough? It can come in handy, but it's possible that it may lack some features that would make things a lot easier for you and everyone who is using it. That was exactly my situation.

## The problem I faced

Months ago I started a very immersive way of learning English. One platform that I've been using a lot is Cambly. There you can find native English speakers to talk everything you want, and when you find a good tutor, the learning process is boosted, and I think this is important as any part of your immersive approach to learn a new language. This tutor, which is by the way my partner here at Rave of Phonetics, taught me an interesting way of gradually understand how to speak a word through phonetics. I was amazed with that!

## Pronouncing through phonetics

To illustrate one situation, I was pronouncing CHEW instead of TO, all the time! To be honest I was always pronouncing CHEW, not even for TO, but for TOO and TWO. Pretty quickly he noticed my problem and explained how to pronounce correctly, and to do that he used some tools out there, that's the moment I was again amazed, but not in a good way. There are many phonetics transcription sites, but they don't have some basic features and just to point some:

* No history of what you researched
* Loop speech audio to repeat the word or phrase
* Sharing a link to your friend through WhatsApp, WeChat, Telegram, Messenger and other
* Off-line functionally

## Solving a problem and creating a public tool

Being a developer, something like the mason on the internet, has its benefits. From time to time, I'm used to take a challenge and share its code on my GitHub profile, like [this one](https://github.com/willianantunes/runner-said-no-one-ever) made in Ruby a time ago, and I was reaching the moment to do that again, so that's when I saw the opportunity to change the game with a new tool to help which would help me (and you) to learn phonetics! Hence I did the first version of Rave of Phonetics and I made it publicly available in January of 2021 (see the [changelog](/changelog) so you can see more details). After that day, I haven't stopped improving it! The image below shows how many [commits](https://en.wikipedia.org/wiki/Commit_(version_control)) I have on the repository:

![GitHub repository of the Rave of Phonetics project](github-refactor-rop.png "A monorepo of the entire project")

## Technologies used

I started the project basically using [Django](https://www.djangoproject.com/) and [Parcel](https://parceljs.org/), but now I changed the whole architecture! [Gatsby](https://www.gatsbyjs.com/) is used on the front-end with [Material UI](https://material-ui.com/) and I'm still using Django on the back-end, because, you may know, it is the web framework for perfectionists with deadlines. By the way, I'm still using others like [Inkscape](https://inkscape.org/):

![Print screen of Inkscape program](inkscape-rop.png "Inkscape can be used to draw things")

Let's build something together! Feedbacks and critics are welcome!