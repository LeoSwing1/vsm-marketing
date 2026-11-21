/**
 * POST /api/chat — website assistant: { mode: 'ask', messages } answers questions about VSM;
 * { mode: 'analysis', ...answers } writes a quick competitor read. Shared by Vercel (src/server/chat-route.ts) and Cloudflare (functions/api/chat.ts).
 *
 * Env:
 *   ANTHROPIC_API_KEY   required for AI answers; without it the endpoint answers 503 and the widget uses its built-in checklist
 *   CHAT_MODEL          default claude-haiku-5-5
 *   ANTHROPIC_VERSION   default 2023-06-01
 *
 * The model is told it cannot see competitors' accounts, so it must not invent follower counts, ad spends or rankings:
 * it reasons from what the visitor typed and lists what VSM's full audit will measure.
 */
import { knowledgeText } from '../content/knowledge';

export interface ChatEnv { ANTHROPIC_API_KEY?: string; CHAT_MODEL?: string; ANTHROPIC_VERSION?: string }
export interface ChatAnswers { business: string; city: string; competitors: string; handle: string; goal: string }

const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json', 'cache-control': 'no-store' } });
const clip = (s: unknown, n: number) => String(s ?? '').replace(/[\u0000-\u001f]/g, ' ').trim().slice(0, n);

const SYSTEM = `You are the growth assistant on the website of VSM Marketing, a digital marketing agency in Meerut and Noida (India) that does social media and reels, video production, Meta & Google Ads, SEO and Google Business Profile, websites, software and PR.
A visitor wants a quick competitor analysis. You cannot browse or see anyone's accounts, so NEVER state or estimate follower counts, ad budgets, rankings, review counts or any other figure about the visitor or their competitors. Reason only from what they told you and from how businesses of that type usually compete in that city.
Write in clear, simple English (a few Hinglish words are fine if the visitor used Hinglish). Be specific to their category, city and goal. No fluff, no guarantees.
Format exactly as plain text with these four headings, each on its own line starting with "## ", and short "- " bullets under each:
## Where competitors usually win
(3 bullets: what businesses like the named competitors typically do well in this category and city)
## Your openings
(3 bullets: realistic gaps the visitor can own)
## Quick wins this week
(3 bullets: concrete, doable actions tied to their goal)
## What VSM's full audit will check
(1 sentence: we compare content, reels, ads library, Google Maps ranking and reviews side by side with real numbers)
Keep the whole answer under 220 words.`;

const ASK = `You are the assistant on vsmgrowth.com for VSM Marketing. Answer visitors' questions about VSM's services, plans, process and offices using ONLY the facts below. If something isn't covered (exact quotes for custom work, availability, anything unknown), say the team will confirm and suggest a call or WhatsApp on +91 82795 74755. Never invent prices, results, clients or guarantees.
Reply in the visitor's language (English, Hindi or Hinglish), friendly and short: 2–4 sentences, or up to 4 "- " bullets. Plain text only, no markdown headings or bold.
If they ask about competitors or how they compare to rivals, tell them to tap "Free competitor analysis".

FACTS
${knowledgeText()}`;

const hits = new Map<string, number[]>(); // per-isolate soft rate limit
function limited(ip: string): boolean {
  const now = Date.now(), win = 10 * 60_000;
  const list = (hits.get(ip) ?? []).filter((t) => now - t < win);
  list.push(now); hits.set(ip, list);
  if (hits.size > 5000) hits.clear();
  return list.length > 6;
}

export async function handleChat(request: Request, env: ChatEnv): Promise<Response> {
  const origin = request.headers.get('origin');
  if (origin && new URL(origin).host !== new URL(request.url).host) return json({ ok: false, error: 'origin' }, 403);
  if (!env.ANTHROPIC_API_KEY) return json({ ok: false, error: 'ai-off' }, 503);

  const ip = request.headers.get('cf-connecting-ip') ?? request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'anon';
  if (limited(ip)) return json({ ok: false, error: 'slow-down' }, 429);

  let raw: Partial<ChatAnswers> & { hp?: string; mode?: string; messages?: { role?: string; content?: unknown }[] };
  try { raw = await request.json(); } catch { return json({ ok: false, error: 'bad json' }, 400); }
  if (raw.hp) return json({ ok: false, error: 'invalid' }, 422);

  let system: string, messages: { role: 'user' | 'assistant'; content: string }[], maxTokens: number;
  if (raw.mode === 'ask') {
    messages = (Array.isArray(raw.messages) ? raw.messages : []).slice(-10)
      .map((m) => ({ role: m.role === 'assistant' ? 'assistant' as const : 'user' as const, content: clip(m.content, 600) }))
      .filter((m) => m.content);
    while (messages.length && messages[0].role !== 'user') messages.shift(); // API wants user first
    if (!messages.length || messages[messages.length - 1].role !== 'user') return json({ ok: false, error: 'invalid' }, 422);
    system = ASK; maxTokens = 350;
  } else {
    const a: ChatAnswers = { business: clip(raw.business, 160), city: clip(raw.city, 80), competitors: clip(raw.competitors, 240), handle: clip(raw.handle, 120), goal: clip(raw.goal, 60) };
    if (!a.business || !a.competitors) return json({ ok: false, error: 'invalid' }, 422);
    messages = [{ role: 'user', content: `Business: ${a.business}\nCity / area: ${a.city || 'not given'}\nCompetitors: ${a.competitors}\nTheir own Instagram / website: ${a.handle || 'not given'}\nMain goal: ${a.goal || 'more customers'}` }];
    system = SYSTEM; maxTokens = 700;
  }

  try {
    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'x-api-key': env.ANTHROPIC_API_KEY, 'anthropic-version': env.ANTHROPIC_VERSION ?? '2023-06-01', 'content-type': 'application/json' },
      body: JSON.stringify({ model: env.CHAT_MODEL ?? 'claude-haiku-5-5', max_tokens: maxTokens, system, messages }),
    });
    if (!r.ok) { console.error('chat upstream', r.status, await r.text().catch(() => '')); return json({ ok: false, error: 'upstream' }, 502); }
    const d = (await r.json()) as { content?: { type: string; text?: string }[] };
    const text = (d.content ?? []).filter((b) => b.type === 'text').map((b) => b.text ?? '').join('').trim();
    return text ? json({ ok: true, text }) : json({ ok: false, error: 'empty' }, 502);
  } catch (e) {
    console.error('chat failed', e);
    return json({ ok: false, error: 'upstream' }, 502);
  }
}
