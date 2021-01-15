# Rave of Phonetics

Let's try to earn money solving people problems with phonetics!

## Running the project

Just issue the following command:

    docker-compose up remote-interpreter

If you want to simulate production, then you can type:

    docker-compose up production

In order to check the files included in the final container image, first you enter the container and list the files:

    docker-compose run production bash
    ls -la

## How to develop

### Front-end

You can execute the following:

    docker-compose up remote-interpreter

Now you can issue the command below and then update your HTML/CSS/JS:

    npm start

To run all tests:

    npm run test

#### Learning about CSS

- https://flexbox.buildwithreact.com/
- https://css-tricks.com/snippets/css/a-guide-to-flexbox/
- https://grid.layoutit.com/
- https://css-tricks.com/snippets/css/complete-guide-grid/
- https://webflow.com/grid

Walk-through:

- https://flexboxfroggy.com/
- https://cssgridgarden.com/

SASS:

- adopt-a-pup site [here](https://adopt-a-pup.glitch.me/) and its [source-code](https://glitch.com/edit/#!/adopt-a-pup)
- material-example-app-shrine site [here]() and its [source-code](https://glitch.com/edit/#!/material-example-app-shrine?path=readme.md%3A1%3A0)

#### Tools to evaluate your website

SEO and web standards:

- https://search.google.com/test/rich-results
- https://developers.facebook.com/tools/debug/
- https://www.opengraph.xyz/

PWA:

- https://web.dev/add-manifest/
- https://dev.to/thepassle/lessons-learned-building-a-covid-19-pwa-57fi

Purge unused CSS (main.css had 120K and after the command it changed to 17K):

    purgecss --css rave_of_phonetics/apps/core/**/*.css \
    --content rave_of_phonetics/apps/core/**/*.html \
    --safelist waves-ripple active thumb hiddendiv \
    history-table striped highlight responsive-table \
    table td tr th table.striped table.highlight tbody \
    optgroup span * :after :before \
    -o rave_of_phonetics/apps/core/static/core/dist/main.css

#### SEO

- https://www.expireddomains.net/
- https://web.archive.org/
- https://ahrefs.com/
- https://www.similarweb.com/
- https://www.tbsolutions.info/
- https://seoferramentas.com/
- [SEO Meta in 1 click](https://chrome.google.com/webstore/detail/seo-meta-in-1-click/bjogjfinolnhfhkbipphpdlldadpnmhc) by [SEO Extension](http://www.seo-extension.com/install-seo-meta-chrome-extension/)

### Back-end

#### Installing new packages

You can install it through docker-compose issuing the following command for example:

    docker-compose run remote-interpreter pipenv --python 3 install parsel --dev

After that it's required to update your remote interpreter:

    docker-compose build remote-interpreter

## Competitors

- [To Phonetics](https://tophonetics.com/)
- [Elsa Speak](https://elsaspeak.com/en/)

## Interesting links

- [Lessons Learned Using the javascript speechSynthesis API](https://talkrapp.com/speechSynthesis.html)
- [Talkr GitHub](https://github.com/talkr-app)
- [IPA Chart With Sounds](https://www.internationalphoneticalphabet.org/ipa-sounds/ipa-chart-with-sounds/)
- [ES6 modules in the browser: are they ready yet?](https://medium.com/@david.gilbertson/es6-modules-in-the-browser-are-they-ready-yet-715ca2c94d09)
- [Using Parcel with Django?](https://www.reddit.com/r/django/comments/ggxk3h/using_parcel_with_django/)

## Samples

- https://github.com/mdn/web-speech-api
