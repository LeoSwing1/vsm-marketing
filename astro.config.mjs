import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Static site for Cloudflare Pages. The lead API lives in /functions (Pages Functions).
export default defineConfig({
  site: 'https://vsmgrowth.com',
  trailingSlash: 'always',
  output: 'static',
  build: { format: 'directory', inlineStylesheets: 'auto' },
  integrations: [sitemap({ filter: (p) => !p.includes('/404'), changefreq: 'weekly', lastmod: new Date(), serialize: (i) => { const u = new URL(i.url).pathname; i.priority = u === '/' ? 1 : /agency-|^\/services\/[^/]+\/$/.test(u) ? 0.9 : u.split('/').length > 4 ? 0.7 : 0.8; return i; } })],
  vite: { assetsInclude: ['**/*.glsl', '**/*.frag', '**/*.vert'] },
});
