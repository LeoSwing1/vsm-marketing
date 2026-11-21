/**
 * POST /api/lead — shared handler used by both hosts:
 *   Vercel:     src/server/lead-route.ts (Astro on-demand route, injected only when building on Vercel)
 *   Cloudflare: functions/api/lead.ts   (Pages Function)
 * Saves a website enquiry as a Lead in Zoho CRM, and optionally forwards it to a backup webhook.
 *
 * Secrets (Vercel: Project > Settings > Environment Variables · Cloudflare: Pages > Settings > Variables and secrets):
 *   ZOHO_CLIENT_ID, ZOHO_CLIENT_SECRET, ZOHO_REFRESH_TOKEN   (Self Client, scope ZohoCRM.modules.leads.CREATE)
 *   ZOHO_ACCOUNTS_URL  default https://accounts.zoho.in    (India data centre)
 *   ZOHO_API_URL       default https://www.zohoapis.in
 *   LEAD_WEBHOOK_URL   optional backup (Google Apps Script, Make, Zapier...)
 */
export interface LeadEnv {
  ZOHO_CLIENT_ID?: string; ZOHO_CLIENT_SECRET?: string; ZOHO_REFRESH_TOKEN?: string;
  ZOHO_ACCOUNTS_URL?: string; ZOHO_API_URL?: string; LEAD_WEBHOOK_URL?: string;
}
interface Lead { name: string; phone: string; email?: string; business?: string; website?: string; city?: string; service?: string; budget?: string; industry?: string; message?: string; page?: string; utm?: Record<string, string>; hp?: string }

const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json', 'cache-control': 'no-store' } });
const clip = (s: unknown, n: number) => String(s ?? '').trim().slice(0, n);

let token: { value: string; exp: number } | null = null; // per-isolate cache

async function zohoToken(env: LeadEnv): Promise<string> {
  if (token && token.exp > Date.now() + 60_000) return token.value;
  const u = new URL('/oauth/v2/token', env.ZOHO_ACCOUNTS_URL ?? 'https://accounts.zoho.in');
  u.search = new URLSearchParams({ refresh_token: env.ZOHO_REFRESH_TOKEN!, client_id: env.ZOHO_CLIENT_ID!, client_secret: env.ZOHO_CLIENT_SECRET!, grant_type: 'refresh_token' }).toString();
  const r = await fetch(u, { method: 'POST' });
  const d = (await r.json()) as { access_token?: string; expires_in?: number; error?: string };
  if (!d.access_token) throw new Error(`zoho token: ${d.error ?? r.status}`);
  token = { value: d.access_token, exp: Date.now() + (d.expires_in ?? 3600) * 1000 };
  return token.value;
}

async function toZoho(env: LeadEnv, l: Lead): Promise<boolean> {
  if (!env.ZOHO_CLIENT_ID || !env.ZOHO_CLIENT_SECRET || !env.ZOHO_REFRESH_TOKEN) return false;
  const [first, ...rest] = l.name.split(/\s+/);
  const utm = l.utm ?? {};
  const description = [
    l.message && `Message: ${l.message}`, `Service: ${l.service ?? '-'}`, l.budget && `Budget: ${l.budget}`, l.industry && `Industry: ${l.industry}`, l.website && `Website/Instagram: ${l.website}`, `Page: ${l.page ?? '/'}`,
    Object.keys(utm).length ? `UTM: ${Object.entries(utm).map(([k, v]) => `${k}=${v}`).join(', ')}` : '',
  ].filter(Boolean).join('\n');
  const record = {
    First_Name: rest.length ? first : undefined, Last_Name: rest.length ? rest.join(' ') : first,
    Company: l.business || `${l.name} (individual)`, Mobile: `+91${l.phone}`, Email: l.email || undefined, Website: /^https?:\/\//.test(l.website ?? '') ? l.website : undefined, City: l.city || undefined, Industry: l.industry || undefined,
    Lead_Source: 'Website', Description: description,
  };
  const r = await fetch(new URL('/crm/v7/Leads', env.ZOHO_API_URL ?? 'https://www.zohoapis.in'), {
    method: 'POST',
    headers: { authorization: `Zoho-oauthtoken ${await zohoToken(env)}`, 'content-type': 'application/json' },
    body: JSON.stringify({ data: [record], trigger: ['workflow', 'approval'] }),
  });
  return r.ok;
}

async function toWebhook(env: LeadEnv, l: Lead): Promise<boolean> {
  if (!env.LEAD_WEBHOOK_URL) return false;
  const r = await fetch(env.LEAD_WEBHOOK_URL, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ ...l, received: new Date().toISOString() }) });
  return r.ok;
}

export async function handleLead(request: Request, env: LeadEnv): Promise<Response> {
  const origin = request.headers.get('origin');
  if (origin && new URL(origin).host !== new URL(request.url).host) return json({ ok: false, error: 'origin' }, 403);

  let raw: Partial<Lead>;
  try { raw = await request.json(); } catch { return json({ ok: false, error: 'bad json' }, 400); }
  if (raw.hp) return json({ ok: true }); // honeypot: pretend success for bots

  const lead: Lead = {
    name: clip(raw.name, 80), phone: clip(raw.phone, 16).replace(/\D/g, '').slice(-10),
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clip(raw.email, 120)) ? clip(raw.email, 120) : '', website: clip(raw.website, 200),
    business: clip(raw.business, 120), city: clip(raw.city, 60), service: clip(raw.service, 60), budget: clip(raw.budget, 30), industry: clip(raw.industry, 60),
    message: clip(raw.message, 1000), page: clip(raw.page, 200),
    utm: Object.fromEntries(Object.entries(raw.utm ?? {}).filter(([k]) => k.startsWith('utm_') || k === 'gclid' || k === 'fbclid').map(([k, v]) => [k, clip(v, 120)])),
  };
  if (!lead.name || !/^[6-9]\d{9}$/.test(lead.phone)) return json({ ok: false, error: 'invalid' }, 422);

  const results = await Promise.allSettled([toZoho(env, lead), toWebhook(env, lead)]);
  const saved = results.some((r) => r.status === 'fulfilled' && r.value);
  results.forEach((r) => { if (r.status === 'rejected') console.error('lead sink failed', r.reason); });
  return json({ ok: saved }, saved ? 200 : 502);
}
