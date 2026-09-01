import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';

// https://vite.dev/config/
export default defineConfig({
  // Served at the web root on Netlify. To deploy under a sub-path, change this
  // and `setupPath` (src/utils/setupPath.js) picks it up automatically.
  base: '/',
  plugins: [preact()],
  build: {
    outDir: 'dist',
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './tests/setup.js',
    include: ['tests/**/*.test.{js,jsx}'],
  },
});
