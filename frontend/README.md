# Front-end

Gatsby with Netlify CMS that handles the front-end side of [Rave of Phonetics](https://www.raveofphonetics.com/).

## Running the project

First execute:

    npm run cms

Then the following:

    npm run develop

## Learning Redux

- https://github.com/reduxjs/redux/tree/master/examples
- https://github.com/reduxjs/redux-essentials-example-app/tree/tutorial-steps/src/features
- https://github.com/reduxjs/cra-template-redux/blob/master/template/src/features/counter/counterSlice.js

## Learning about CSS

- https://flexbox.buildwithreact.com/
- https://css-tricks.com/snippets/css/a-guide-to-flexbox/
- https://grid.layoutit.com/
- https://css-tricks.com/snippets/css/complete-guide-grid/
- https://webflow.com/grid
- https://stackoverflow.com/a/7354648/3899136

Walk-through:

- https://flexboxfroggy.com/
- https://cssgridgarden.com/

SASS:

- adopt-a-pup site [here](https://adopt-a-pup.glitch.me/) and its [source-code](https://glitch.com/edit/#!/adopt-a-pup)
- material-example-app-shrine site [here]() and its [source-code](https://glitch.com/edit/#!/material-example-app-shrine?path=readme.md%3A1%3A0)

## Gatsby

- https://medium.com/swlh/optimizing-gravatars-in-gatsby-ccf8cf359ccf

## Tools to evaluate your website

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
