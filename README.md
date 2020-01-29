# Rhyme Match Game

based off the work of Seif Ghezala in [this article](https://hackernoon.com/how-to-create-a-pwa-game-using-preact-in-5-steps-tutorial-c8b177037c80).

This will eventually be an offline first way for EFL students to practice identifying words that rhyme.

## local development

`npm start`

## local security vulnerability testing

(uses `is-website-vulnerable`)

- first, build the docker container locally using the information at https://github.com/lirantal/is-website-vulnerable

- then just run `npm run test:security`, which will use the container you just built
