/** POST /api/lead on Vercel. Injected by astro.config.mjs only when VERCEL is set, so Cloudflare builds stay fully static. */
import type { APIRoute } from 'astro';
import { handleLead } from './lead';

export const prerender = false;
export const POST: APIRoute = ({ request }) => handleLead(request, process.env);
