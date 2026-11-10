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

// Serves /api/github-contributions during `npm run dev`. Production uses the
// Vercel function in api/github-contributions.ts. The token stays in Node.
const contributionsDevApi = (): Plugin => ({
  name: 'contributions-dev-api',
  configureServer(server) {
    server.middlewares.use(async (req, res, next) => {
      const path = req.url?.split('?')[0];
      if (path !== '/api/github-contributions') {
        next();
        return;
      }
      if (req.method !== 'GET') {
        res.statusCode = 405;
        res.setHeader('Cache-Control', 'no-store');
        res.end();
        return;
      }
      try {
        const mod = (await server.ssrLoadModule('/api/github-contributions.ts')) as {
          GET: () => Promise<Response>;
        };
        const response = await mod.GET();
        res.statusCode = response.status;
        response.headers.forEach((value, key) => {
          res.setHeader(key, value);
        });
        res.end(Buffer.from(await response.arrayBuffer()));
      } catch (error) {
        console.error('github contributions dev api failed', error);
        res.statusCode = 503;
        res.setHeader('Cache-Control', 'no-store');
        res.end();
      }
    });
  },
});

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), buildCommitMeta(), contributionsDevApi()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
