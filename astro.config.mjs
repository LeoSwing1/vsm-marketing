import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';

// Pages are prerendered either way. On Vercel (VERCEL=1 during the build) the adapter is added and
// POST /api/lead and /api/chat run as Vercel Functions; on Cloudflare Pages the same handler runs from /functions.
const onVercel = !!process.env.VERCEL;
const leadApi = {
  name: 'vsm-lead-api',
  hooks: { 'astro:config:setup': ({ injectRoute }) => { if (onVercel) { injectRoute({ pattern: '/api/lead', entrypoint: './src/server/lead-route.ts', prerender: false }); injectRoute({ pattern: '/api/chat', entrypoint: './src/server/chat-route.ts', prerender: false }); } } },
};

export default defineConfig({
  site: 'https://vsmgrowth.com',
  trailingSlash: 'always',
  output: 'static',
  adapter: onVercel ? vercel() : undefined,
  build: { format: 'directory', inlineStylesheets: 'auto' },
  integrations: [leadApi, sitemap({ filter: (p) => !p.includes('/404') && !p.includes('/api/'), changefreq: 'weekly', lastmod: new Date(), serialize: (i) => { const u = new URL(i.url).pathname; i.priority = u === '/' ? 1 : /agency-|^\/services\/[^/]+\/$/.test(u) ? 0.9 : u.split('/').length > 4 ? 0.7 : 0.8; return i; } })],
  vite: { assetsInclude: ['**/*.glsl', '**/*.frag', '**/*.vert'] },
});
