// Derive the routing base from Vite's configured `base` so the router and the
// build stay in sync. Serving at the web root (the Netlify default) yields ''.
// To deploy under a sub-path, set `base` in vite.config.js and this follows.
const setupPath = () => import.meta.env.BASE_URL.replace(/\/$/, '');

export default setupPath;
