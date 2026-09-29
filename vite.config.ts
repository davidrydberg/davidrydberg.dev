import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { getBuildInfo } from './scripts/build-info.mjs';

// Stamps every rendered page with the commit it was built from, so a visitor's
// response can be matched to a build independently of /health.
const buildCommitMeta = (): Plugin => ({
  name: 'build-commit-meta',
  transformIndexHtml: () => [
    {
      tag: 'meta',
      attrs: { name: 'build-commit', content: getBuildInfo().commit },
      injectTo: 'head',
    },
  ],
});

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), buildCommitMeta()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
