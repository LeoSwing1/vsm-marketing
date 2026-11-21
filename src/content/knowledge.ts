/**
 * What the website assistant knows. Built from the same content as the site, so answers never drift from the pages.
 * Used in the browser (instant keyword answers) and on the server (context for Claude).
 */
import { site } from './site';
import { promise } from './extra';

export interface KbEntry { q: string; a: string; keys: string[]; link?: { label: string; href: string } }

const words = (s: string) => s.toLowerCase().replace(/[^a-z0-9₹\s]/g, ' ').split(/\s+/).filter((w) => w.length > 2 && !STOP.has(w));
const STOP = new Set(['the', 'and', 'for', 'you', 'your', 'are', 'can', 'what', 'how', 'does', 'did', 'with', 'our', 'any', 'kya', 'hai', 'hain', 'aap', 'mein', 'kaise', 'kitna', 'kitne', 'this', 'that', 'from', 'about', 'have', 'will', 'who', 'which', 'when', 'where', 'there', 'they', 'them', 'into', 'also', 'just', 'like', 'want', 'need', 'please', 'tell']);

const office = site.offices.map((o) => `${o.city} (${o.label}): ${o.lines.join(', ')}`).join('; ');

export const kb: KbEntry[] = [
  ...site.faqs.map((f) => ({ q: f.q, a: f.a, keys: words(f.q) })),
  ...site.services.flatMap((s) => [
    { q: s.name, a: `${s.desc} Includes: ${s.includes.slice(0, 5).join(', ')}.`, keys: [...words(s.name), ...words(s.short), ...s.tags.flatMap(words)], link: { label: `${s.name} →`, href: `/services/${s.slug}/` } },
    ...s.faqs.map(([q, a]) => ({ q, a, keys: [...words(q), ...words(s.short)], link: { label: `${s.name} →`, href: `/services/${s.slug}/` } })),
  ]),
  { q: 'Pricing and plans', a: `Monthly plans (+ GST, no lock-in): ${site.plans.map((p) => `${p.name} ${p.price}: ${p.blurb}`).join(' · ')} Ad budget is separate and paid directly to Meta or Google.`, keys: ['price', 'pricing', 'cost', 'charges', 'charge', 'fee', 'fees', 'plan', 'plans', 'package', 'packages', 'rate', 'rates', 'budget', 'paisa', 'paise', 'kharcha', 'starter', 'growth', 'premium', '₹'], link: { label: 'See all plans →', href: '/#pricing' } },
  { q: 'Office address', a: `${office}. ${site.hours}.`, keys: ['office', 'address', 'location', 'located', 'where', 'visit', 'meet', 'meerut', 'noida', 'map', 'directions', 'kahan'], link: { label: 'Get directions →', href: '/contact/' } },
  { q: 'Contact', a: `Call or WhatsApp ${site.phoneDisplay}, email ${site.email}. ${site.hours}.`, keys: ['contact', 'call', 'phone', 'number', 'whatsapp', 'email', 'mail', 'reach', 'timing', 'timings', 'hours', 'open', 'sunday', 'saturday'] },
  { q: 'Why VSM', a: `With every plan: ${promise.join('; ')}.`, keys: ['why', 'different', 'better', 'trust', 'revision', 'revisions', 'report', 'reports', 'team', 'in-house', 'cancel', 'contract', 'lock'] },
  { q: 'Results and clients', a: `Some results: ${site.cases.map((c) => `${c.client} (${c.city}): ${c.result}`).join(' · ')}.`, keys: ['result', 'results', 'client', 'clients', 'case', 'work', 'portfolio', 'example', 'examples', 'proof', 'brands'], link: { label: 'See our work →', href: '/work/' } },
];

/** Best local answer for a question, with a confidence score (0 = nothing). */
export function match(question: string): { entry: KbEntry; score: number } | null {
  const qw = words(question);
  if (!qw.length) return null;
  let best: { entry: KbEntry; score: number } | null = null;
  for (const e of kb) {
    const set = new Set(e.keys);
    let score = 0;
    for (const w of qw) if (set.has(w) || [...set].some((k) => k.length > 4 && (k.startsWith(w) || w.startsWith(k)))) score++;
    const norm = score / Math.min(qw.length, 4);
    if (!best || norm > best.score) best = { entry: e, score: norm };
  }
  return best && best.score > 0 ? best : null;
}

/** Compact facts for the model's system prompt. */
export function knowledgeText(): string {
  return [
    `VSM Marketing: revenue-driven digital marketing agency, founded 2021 in Meerut. Offices: ${office}. Hours: ${site.hours}. Phone/WhatsApp: ${site.phoneDisplay}. Email: ${site.email}.`,
    `Services: ${site.services.map((s) => `${s.name} (${s.tags.join(', ')})`).join('; ')}.`,
    `Plans (per month + GST, no lock-in, ad budget separate): ${site.plans.map((p) => `${p.name} ${p.price} — ${p.includes.join(', ')}`).join(' | ')}.`,
    `Promise: ${promise.join('; ')}.`,
    `FAQs: ${[...site.faqs.map((f) => `${f.q} ${f.a}`), ...site.services.flatMap((s) => s.faqs.map(([q, a]) => `${q} ${a}`))].join(' ')}`,
    `Case results: ${site.cases.map((c) => `${c.client}, ${c.city}: ${c.result}`).join('; ')}.`,
  ].join('\n');
}
