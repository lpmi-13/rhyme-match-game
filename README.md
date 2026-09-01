# Rhyme Match Game

Based off the work of Seif Ghezala in [this article](https://hackernoon.com/how-to-create-a-pwa-game-using-preact-in-5-steps-tutorial-c8b177037c80).

An offline-friendly way for EFL students to practice identifying words that rhyme.

Built with [Preact](https://preactjs.com/) and [Vite](https://vite.dev/).

## Requirements

- Node.js >= 24

## Local development

```sh
npm install
npm run dev
```

Vite serves the app with hot module replacement at http://localhost:5173.

## Available scripts

- `npm run dev` — start the dev server (HMR)
- `npm run build` — production build to `dist/`
- `npm run preview` — serve the production build locally (port 4173)
- `npm run lint` — run ESLint
- `npm test` — run the test suite once (Vitest)
- `npm run test:watch` — run tests in watch mode
- `npm run format` — format source with Prettier

## Deployment (Netlify)

`netlify.toml` is preconfigured:

- **Build command:** `npm run build`
- **Publish directory:** `dist`
- An SPA redirect (`/*` → `/index.html`) so client-side routes resolve on refresh.

Connect the repository to Netlify and it will pick up these settings automatically.

The app is served from the web root. To deploy under a sub-path instead, set
`base` in `vite.config.js`; the router follows it via `src/utils/setupPath.js`.

## Local security vulnerability testing

Uses [`is-website-vulnerable`](https://github.com/lirantal/is-website-vulnerable).

```sh
npm run test:security
```

This builds the app, serves the production build, and scans it via the Docker
image (which reaches the host through `host.docker.internal`).
