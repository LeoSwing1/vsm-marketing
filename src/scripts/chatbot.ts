/**
 * VSM website assistant.
 *  - Ask anything: instant answers from the site's own content (src/content/knowledge.ts); questions the site doesn't
 *    cover go to Claude via /api/chat when ANTHROPIC_API_KEY is set.
 *  - Free competitor analysis: five quick questions → a short read (Claude, or a built-in checklist) → offer of the full report.
 *  - Talk to the team: name + mobile → /api/lead (Zoho), WhatsApp as the fallback.
 * Everything typed by the visitor or returned by the model is inserted as text, never as HTML.
 */
import { match } from '../content/knowledge';
import { smooth } from './smooth';

type Mode = 'menu' | 'cq' | 'offer' | 'name' | 'phone' | 'busy' | 'done';
interface Answers { business: string; city: string; competitors: string; handle: string; goal: string }
type Q = { key: keyof Answers; ask: string; chips?: string[]; optional?: boolean; placeholder?: string };

const CQ: Q[] = [
  { key: 'business', ask: 'What is your business called, and what do you sell?', placeholder: 'e.g. Sharma Sweets, mithai & catering' },
  { key: 'city', ask: 'Where are most of your customers?', chips: ['Meerut', 'Noida', 'Ghaziabad', 'Delhi NCR', 'All India'], placeholder: 'City or area' },
  { key: 'competitors', ask: 'Name up to 3 competitors you keep an eye on (names or Instagram handles).', placeholder: '@competitor1, @competitor2' },
  { key: 'handle', ask: 'Your Instagram handle or website?', chips: ['Skip'], optional: true, placeholder: '@yourbrand or yourbrand.com' },
  { key: 'goal', ask: 'What do you want most right now?', chips: ['More leads & enquiries', 'More sales & walk-ins', 'More followers & reach', 'A stronger brand image'] },
];
const MENU = ['Free competitor analysis', 'Services', 'Pricing', 'Talk to the team'];
const AFTER = ['Free competitor analysis', 'Pricing', 'Talk to the team'];
const WA = '918279574755';
const TYPE_MS = 260; // short "typing" pause: feels conversational without slowing anyone down
const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));
const track = (name: string, p: Record<string, string> = {}) => (window as unknown as { gtag?: (...a: unknown[]) => void }).gtag?.('event', name, p);
let aiOff = false; // learned from the first 503, shared by both bots on the page

class Bot {
  private log: HTMLElement; private chips: HTMLElement; private form: HTMLFormElement; private input: HTMLInputElement;
  private mode: Mode = 'menu'; private q = 0; private purpose: 'report' | 'callback' = 'callback';
  private a: Answers = { business: '', city: '', competitors: '', handle: '', goal: '' };
  private lead = { name: '', phone: '' };
  private history: { role: 'user' | 'assistant'; content: string }[] = [];
  private started = false; engaged = false;

  constructor(private root: HTMLElement, private focusOnStart: boolean) {
    this.log = root.querySelector('.bot-log')!; this.chips = root.querySelector('.bot-chips')!;
    this.form = root.querySelector('.bot-input')!; this.input = this.form.querySelector('input[name=msg]')!;
    this.form.addEventListener('submit', (e) => { e.preventDefault(); this.engaged = true; void this.submit(this.input.value); });
    root.querySelector('[data-chat-restart]')?.addEventListener('click', () => this.reset());
  }

  start() { if (!this.started) { this.started = true; this.reset(); } }

  reset() {
    this.log.replaceChildren(); this.mode = 'menu'; this.q = 0; this.history = [];
    this.a = { business: '', city: '', competitors: '', handle: '', goal: '' }; this.lead = { name: '', phone: '' };
    this.bot('Hi! I\'m VSM\'s assistant. Ask me anything about our services, pricing or process, or get a free competitor analysis for your business.');
    this.setChips(MENU); this.placeholder('Ask a question…');
    if (this.focusOnStart || this.engaged) this.focus();
  }

  // ---------- rendering ----------
  private scroll() { requestAnimationFrame(() => { this.log.scrollTop = this.log.scrollHeight; }); }
  private bubble(who: 'bot' | 'me', build: (el: HTMLElement) => void) {
    const el = document.createElement('div'); el.className = `msg msg-${who}`; build(el);
    this.log.appendChild(el); this.scroll(); return el;
  }
  private bot(text: string, link?: { label: string; href: string }) {
    return this.bubble('bot', (el) => {
      el.textContent = text;
      if (link) { const a = document.createElement('a'); a.href = link.href; a.className = 'msg-link'; a.textContent = link.label; el.append(document.createElement('br'), a); }
    });
  }
  private typing() {
    return this.bubble('bot', (el) => { el.classList.add('msg-typing'); el.setAttribute('aria-label', 'Typing'); el.append(...[0, 1, 2].map(() => document.createElement('i'))); });
  }
  private async say(text: string, link?: { label: string; href: string }, ms = TYPE_MS) {
    const t = this.typing(); await wait(ms); t.remove(); return this.bot(text, link);
  }
  private setChips(list: string[] = []) {
    this.chips.replaceChildren(...list.map((c) => {
      const b = document.createElement('button'); b.type = 'button'; b.textContent = c;
      b.addEventListener('click', () => { this.engaged = true; void this.submit(c); });
      return b;
    }));
    this.scroll();
  }
  private placeholder(p: string, tel = false) { this.input.placeholder = p; this.input.inputMode = tel ? 'tel' : 'text'; }
  private focus() { if (matchMedia('(pointer: fine)').matches || this.root.dataset.chat === 'drawer') this.input.focus({ preventScroll: true }); }

  // ---------- input routing ----------
  async submit(raw: string) {
    const v = raw.trim().slice(0, 240);
    if (this.mode === 'busy' || this.mode === 'done' && !v) return;
    const optional = this.mode === 'cq' && CQ[this.q]?.optional;
    if (!v && !optional) { this.focus(); return; }
    this.input.value = ''; this.setChips();
    this.bubble('me', (el) => { el.textContent = v || 'Skip'; });

    switch (this.mode) {
      case 'cq': return this.answerCq(v);
      case 'offer': return this.offer(!/^(no|not|nahi|nah)\b/i.test(v));
      case 'name': return this.takeName(v);
      case 'phone': return this.takePhone(v);
      default: return this.route(v);
    }
  }

  private async route(v: string) {
    if (this.mode === 'done') this.mode = 'menu';
    if (/competit|rival|compare|analys|audit|competetor/i.test(v)) return this.startCq();
    if (/^talk to the team$|call ?back|talk to|contact me|speak|human|baat|call me|team se/i.test(v)) return this.startLead('callback');
    if (/^ask another question$/i.test(v)) { await this.say('Sure, what would you like to know?'); this.setChips(MENU); this.focus(); return; }
    if (/^services$/i.test(v)) {
      await this.say('We do six things, all in-house: Social media & video, Meta & Google Ads, SEO & Google Maps, Websites, Software & apps, and PR. Which one should I tell you about?', { label: 'All services →', href: '/services/' });
      this.setChips(['Social media & reels', 'Ads', 'SEO', 'Websites', 'Software & apps', 'PR']); return;
    }
    return this.ask(v);
  }

  /** Free-text question: a confident local answer is instant; otherwise ask Claude; otherwise best guess + handoff. */
  private async ask(v: string) {
    this.history.push({ role: 'user', content: v });
    const local = match(v);
    if (local && local.score >= 0.5) {
      await this.say(local.entry.a, local.entry.link);
      this.history.push({ role: 'assistant', content: local.entry.a });
      this.setChips(AFTER); return;
    }
    if (!aiOff) {
      this.mode = 'busy'; const t = this.typing();
      let text = '';
      try {
        const r = await fetch('/api/chat', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ mode: 'ask', messages: this.history }) });
        if (r.status === 503 || r.status === 404 || r.status === 405 || r.status === 501) aiOff = true;
        if (r.ok) text = ((await r.json()) as { text?: string }).text ?? '';
      } catch { /* fall through */ }
      t.remove(); this.mode = 'menu';
      if (text) { this.bot(text); this.history.push({ role: 'assistant', content: text }); this.setChips(AFTER); track('chat_answer', { source: 'ai' }); return; }
    }
    if (local && local.score > 0.34) { await this.say(local.entry.a, local.entry.link); this.setChips(AFTER); return; }
    await this.say('Good question. I don\'t have that on hand. Want someone from our team to call you back? Or call us on +91 82795 74755.');
    this.setChips(['Talk to the team', 'Free competitor analysis']);
  }

  // ---------- competitor analysis ----------
  private async startCq() {
    track('chat_start', { tool: 'competitor_analysis' });
    this.mode = 'cq'; this.q = 0;
    await this.say('Let\'s do it: 5 quick questions, about a minute.');
    return this.askCq();
  }
  private async askCq() {
    const s = CQ[this.q];
    await this.say(s.ask); this.setChips(s.chips); this.placeholder(s.placeholder ?? 'Type your answer…'); this.focus();
  }
  private async answerCq(v: string) {
    this.a[CQ[this.q].key] = /^skip$/i.test(v) ? '' : v;
    this.q++;
    if (this.q < CQ.length) return this.askCq();
    return this.analyse();
  }
  private async analyse() {
    this.mode = 'busy';
    const t = this.typing(); let text = '';
    if (!aiOff) {
      try {
        const hp = (this.form.querySelector('input[name=hp]') as HTMLInputElement).value;
        const r = await fetch('/api/chat', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ mode: 'analysis', ...this.a, hp }) });
        if (r.status === 503 || r.status === 404 || r.status === 405 || r.status === 501) aiOff = true;
        if (r.ok) text = ((await r.json()) as { text?: string }).text ?? '';
      } catch { /* fall back */ }
    } else await wait(500);
    t.remove();
    this.report(text || this.checklist());
    track('chat_analysis', { source: text ? 'ai' : 'checklist' });
    await this.say('Want the full competitor report free, with real numbers side by side? It comes on WhatsApp within 24 hours.', undefined, 450);
    this.mode = 'offer'; this.setChips(['Yes, send it', 'Not now']); this.placeholder('Yes / No');
  }
  private async offer(yes: boolean) {
    if (!yes) { this.mode = 'menu'; await this.say('No problem. Anything else I can help with?'); this.setChips(AFTER); this.placeholder('Ask a question…'); return; }
    return this.startLead('report');
  }

  // ---------- lead capture ----------
  private async startLead(purpose: 'report' | 'callback') {
    this.purpose = purpose; this.mode = 'name';
    await this.say(purpose === 'report' ? 'Great. What is your name?' : 'Sure! What is your name? Someone from our team will call you back.');
    this.placeholder('Your name'); this.focus();
  }
  private async takeName(v: string) {
    this.lead.name = v; this.mode = 'phone';
    await this.say(`Thanks ${v.split(/\s+/)[0]}! Your 10-digit mobile number (WhatsApp)?`);
    this.placeholder('98XXXXXXXX', true);
  }
  private async takePhone(v: string) {
    const phone = v.replace(/\D/g, '').slice(-10);
    if (!/^[6-9]\d{9}$/.test(phone)) { await this.say('That doesn\'t look like a 10-digit Indian mobile number. Please try again.'); return; }
    this.lead.phone = phone; return this.saveLead();
  }
  private summary() {
    if (this.purpose === 'callback') {
      const asked = this.history.filter((m) => m.role === 'user').map((m) => `- ${m.content}`).join('\n');
      return `Callback request from the website chat${asked ? `\nAsked:\n${asked}` : ''}`;
    }
    return `Competitor analysis request\nBusiness: ${this.a.business}\nArea: ${this.a.city || '-'}\nCompetitors: ${this.a.competitors}\nInstagram/website: ${this.a.handle || '-'}\nGoal: ${this.a.goal || '-'}`;
  }
  private async saveLead() {
    this.mode = 'busy';
    const t = this.typing(); let ok = false;
    try {
      const r = await fetch('/api/lead', {
        method: 'POST', headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ name: this.lead.name, phone: this.lead.phone, business: this.a.business, city: this.a.city, website: this.a.handle, service: this.purpose === 'report' ? 'Competitor analysis' : 'Chatbot enquiry', message: this.summary(), page: location.pathname, utm: Object.fromEntries(new URLSearchParams(location.search)) }),
      });
      ok = r.ok;
    } catch { ok = false; }
    t.remove(); this.mode = 'done';
    const wa = `https://wa.me/${WA}?text=${encodeURIComponent(`Hi VSM, I'm ${this.lead.name}.${this.purpose === 'report' ? ' Please send my free competitor report.' : ' Please call me back.'}\n\n${this.summary()}`)}`;
    if (ok) {
      track('generate_lead', { source: 'chatbot', service: this.purpose });
      this.bot(this.purpose === 'report' ? 'Done! Our team will send your full report on WhatsApp within 24 hours (Mon–Sat).' : 'Done! Someone from our team will call you shortly (Mon–Sat, 10am–7pm).');
    } else this.bot('I couldn\'t save that just now. Tap below to send it on WhatsApp instead; everything is already filled in.');
    this.bubble('bot', (el) => {
      const a = document.createElement('a'); a.href = wa; a.target = '_blank'; a.rel = 'noopener'; a.className = 'bot-wa'; a.dataset.track = 'whatsapp_chatbot';
      a.textContent = ok ? 'Chat on WhatsApp now ↗' : 'Send on WhatsApp ↗'; el.appendChild(a);
    });
    this.setChips(['Ask another question']); this.placeholder('Ask a question…');
  }

  // ---------- competitor report ----------
  /** "## heading" / "- bullet" / plain lines → DOM, no HTML parsing. */
  private report(text: string) {
    this.bubble('bot', (el) => {
      el.classList.add('msg-report');
      let ul: HTMLUListElement | null = null;
      for (const line of text.split('\n').map((l) => l.trim()).filter(Boolean)) {
        const clean = line.replace(/\*\*/g, '');
        if (clean.startsWith('## ')) { ul = null; const h = document.createElement('b'); h.textContent = clean.slice(3); el.appendChild(h); }
        else if (/^[-•*]\s+/.test(clean)) { if (!ul) { ul = document.createElement('ul'); el.appendChild(ul); } const li = document.createElement('li'); li.textContent = clean.replace(/^[-•*]\s+/, ''); ul.appendChild(li); }
        else { ul = null; const p = document.createElement('p'); p.textContent = clean; el.appendChild(p); }
      }
    });
  }
  private checklist(): string {
    const comp = this.a.competitors || 'your competitors', city = this.a.city || 'your area', goal = this.a.goal.toLowerCase();
    const wins = goal.includes('lead') ? ['Run click-to-WhatsApp ads with one clear offer and reply within 5 minutes', 'Add a "Book / Enquire" button to your Instagram profile and Google listing', 'Post one reel this week answering the question customers ask most']
      : goal.includes('sale') ? ['Post your top 3 products or services with prices in a pinned reel', 'Ask your last 10 happy customers for a Google review with photos', 'Run a 7-day local offer to people within 5 km of your shop']
      : goal.includes('follow') ? ['Post 3 reels a week with a hook in the first second', 'Collaborate with one local creator or a complementary brand', 'Reply to every comment within the first hour of posting']
      : ['Fix your Instagram bio, highlights and profile photo so they look consistent', 'Show the people and process behind your work in one reel', 'Match your Google Business Profile photos and details to your brand'];
    return [`## What we'll compare: you vs ${comp}`, `- Content: posting rhythm, which reels get views, and the hooks they use in ${city}`, '- Ads: what they run in Meta Ad Library and Google, their offers and creatives', `- Google: who ranks on Maps for your category in ${city}, plus reviews and ratings`, '- Profile: bio, highlights, link, WhatsApp and response speed', '## Quick wins this week', ...wins.map((w) => `- ${w}`)].join('\n');
  }
}

export function initChat(): () => void {
  const bots = new Map<HTMLElement, Bot>();
  const get = (el: HTMLElement) => { let b = bots.get(el); if (!b) { b = new Bot(el, el.dataset.chat === 'drawer'); bots.set(el, b); } return b; };

  // inline bot (homepage) greets when it comes into view, without stealing focus or scroll
  const inline = document.querySelector<HTMLElement>('[data-chat="inline"]');
  const io = new IntersectionObserver(([e]) => { if (e.isIntersecting && inline) { get(inline).start(); io.disconnect(); } }, { threshold: 0.3 });
  if (inline) io.observe(inline);

  const drawer = document.querySelector<HTMLElement>('[data-chat="drawer"]');
  const html = document.documentElement;
  let lastFocus: HTMLElement | null = null;
  const small = () => matchMedia('(max-width: 700px)').matches;
  const open = (topic?: string) => {
    if (!drawer) return;
    lastFocus = document.activeElement as HTMLElement; drawer.hidden = false;
    requestAnimationFrame(() => drawer.classList.add('is-open'));
    if (small()) { html.classList.add('chat-open'); smooth()?.stop(); }
    const b = get(drawer); b.start();
    if (topic) { b.engaged = true; void b.submit(topic); }
    track('chat_open');
  };
  const close = () => {
    if (!drawer) return;
    drawer.classList.remove('is-open'); html.classList.remove('chat-open'); smooth()?.start();
    setTimeout(() => { drawer.hidden = true; }, 250); lastFocus?.focus({ preventScroll: true });
  };
  const onClick = (e: Event) => {
    const t = (e.target as HTMLElement).closest<HTMLElement>('[data-chat-open], [data-chat-close]');
    if (!t) return;
    if (t.matches('[data-chat-open]')) { e.preventDefault(); open(t.dataset.chatOpen || undefined); } else close();
  };
  const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape' && drawer && !drawer.hidden) close(); };
  document.addEventListener('click', onClick); document.addEventListener('keydown', onKey);
  return () => { io.disconnect(); close(); document.removeEventListener('click', onClick); document.removeEventListener('keydown', onKey); };
}
