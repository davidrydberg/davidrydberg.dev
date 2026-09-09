import { ViteReactSSG } from 'vite-react-ssg';
import { routes } from './App';
import './index.css';

// vite-react-ssg owns mount/hydration: it calls hydrateRoot on the client and
// renderToString at build time, emitting one static HTML file per route with
// the real body copy baked in. No manual createRoot/document access here.
export const createRoot = ViteReactSSG({ routes });
