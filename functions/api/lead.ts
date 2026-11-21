/** POST /api/lead (Cloudflare Pages Function). Logic lives in src/server/lead.ts, shared with the Vercel route. */
import { handleLead, type LeadEnv } from '../../src/server/lead';

export const onRequestPost: PagesFunction<LeadEnv> = ({ request, env }) => handleLead(request, env);
