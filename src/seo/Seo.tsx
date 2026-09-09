import { Head } from 'vite-react-ssg';
import { routeMeta, type RouteMeta, type RoutePath } from './meta';

/**
 * Sets the per-route <title>, description, canonical and the route-varying
 * OG/Twitter fields. Site-wide tags (charset, og:image, og:site_name, fonts,
 * JSON-LD, etc.) stay in index.html, so there are no duplicates.
 *
 * Pass either a `route` (looked up in routeMeta) or an explicit `meta` object
 * for dynamic pages such as guides whose copy lives outside routeMeta.
 */
type SeoProps = {
  jsonLd?: object | object[];
} & ({ route: RoutePath; meta?: never } | { route?: never; meta: RouteMeta });

export const Seo = ({ route, meta, jsonLd }: SeoProps) => {
  const m: RouteMeta = meta ?? routeMeta[route as RoutePath];
  const blocks = jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : [];
  return (
    <Head>
      <title>{m.title}</title>
      <meta name="description" content={m.description} />
      <link rel="canonical" href={m.canonical} />
      {m.noindex ? (
        <meta name="robots" content="noindex,follow" />
      ) : (
        // Let Google show full text/image/video previews and rich results.
        <meta
          name="robots"
          content="index,follow,max-snippet:-1,max-image-preview:large,max-video-preview:-1"
        />
      )}
      <meta property="og:title" content={m.title} />
      <meta property="og:description" content={m.description} />
      <meta property="og:url" content={m.canonical} />
      <meta name="twitter:title" content={m.title} />
      <meta name="twitter:description" content={m.description} />
      {/* Per-page structured data (e.g. an industry Service or a guide Article).
          The site-wide @graph stays in index.html and is baked into every route. */}
      {blocks.map((block, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(block)}
        </script>
      ))}
    </Head>
  );
};
