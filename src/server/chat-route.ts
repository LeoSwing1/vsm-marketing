/** POST /api/chat on Vercel. Injected by astro.config.mjs only when VERCEL is set. */
import type { APIRoute } from 'astro';
import { handleChat } from './chat';

export const prerender = false;
export const POST: APIRoute = ({ request }) => handleChat(request, process.env);
