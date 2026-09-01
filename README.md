# Rhyme Match

An accessible, arcade-styled rhyme-matching game for English language learners.
Get the word, match the rhyme.

Live at **[https://rhyme-match-game.netlify.app](https://rhyme-match-game.netlify.app)**.

## How it works

1. Pick a reference word from a rhyme family (e.g. _"night" — /aɪt/_).
2. You're shown a grid of 12 word cards: **6 that rhyme** with the reference
   word and **6 distractors** that share the same number of syllables but a
   different ending sound.
3. Tap the words you think rhyme. Find all **6 matches** to win.
4. **3 misses** ends the round. Then move on to the next rhyme or try again.

Rhyme families are curated from the [CMU Pronouncing Dictionary][cmudict]
(CMUdict). Each family groups words with the same syllable count and the same
pronunciation from the final stressed vowel onward. Rhyme labels use broad IPA —
pronunciation can vary by accent.

[cmudict]: https://github.com/cmusphinx/cmudict

## Highlights

- **Zero framework** — vanilla TypeScript rendering to the DOM.
- **Accessible by design** — skip links, semantic landmarks, ARIA labels and
  live regions for feedback, keyboard-operable cards, and `prefers-reduced-motion`
  support.
- **Data integrity checks** — a script verifies every word's pronunciation
  against CMUdict so rhyme families stay correct.
- **Testable domain** — game logic is separated from the UI and covered by unit
  tests, with deterministic randomness for reproducible rounds.

## Tech stack

| Concern      | Tool                          |
| ------------ | ----------------------------- |
| Language     | TypeScript                    |
| Build / dev  | [Vite](https://vitejs.dev)    |
| Unit tests   | [Vitest](https://vitest.dev)  |
| Lint / format| [Biome](https://biomejs.dev)  |
| Hosting      | [Netlify](https://netlify.com) |

## Project layout

```
src/
  data/words.ts      Rhyme families and word lists (the source of truth)
  domain/game.ts     Round logic: deck building, scoring, rhyme selection
  ui/app.ts          DOM rendering and event handling
  main.ts            Entry point
  styles.css         Styles
scripts/
  verify-rhyme-data.mjs   Validates word data against CMUdict
tests/               Vitest unit tests
```

## Local development

**Prerequisites:** Node.js `>=24` and npm `>=11.6.1` (see `.nvmrc`).

```bash
npm install       # install dependencies
npm run dev       # start the Vite dev server with hot reload
```

Then open the URL Vite prints (defaults to http://localhost:5173).

### Useful scripts

```bash
npm run build         # type-check and build for production (output in dist/)
npm run preview       # serve the production build locally

npm test              # run unit tests once
npm run test:watch    # run unit tests in watch mode

npm run lint          # lint with Biome
npm run format        # auto-format with Biome
npm run format:check  # check formatting without writing

npm run data:check    # verify rhyme data against CMUdict (needs network access)

npm run check         # lint + unit tests + build + format check (CI gate)
```

## License

MIT — see [LICENSE.txt](./LICENSE.txt).
