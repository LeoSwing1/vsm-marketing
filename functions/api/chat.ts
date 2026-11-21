/** POST /api/chat (Cloudflare Pages Function). Logic lives in src/server/chat.ts, shared with the Vercel route. */
import { handleChat, type ChatEnv } from '../../src/server/chat';

export const onRequestPost: PagesFunction<ChatEnv> = ({ request, env }) => handleChat(request, env);
