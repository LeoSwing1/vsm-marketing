import { track } from './analytics';

/**
 * Enquiry form -> POST /api/lead (Cloudflare Pages Function -> Zoho CRM).
 * The visitor always gets a pre-written WhatsApp message too, so no lead is lost.
 * Query params pre-fill it: ?service=seo  ?plan=Growth  ?industry=Real%20Estate
 */
export function initLeadForm(): void {
  const form = document.getElementById('lead') as HTMLFormElement | null;
  if (!form || form.dataset.bound) return;
  form.dataset.bound = '1';
  const done = document.getElementById('done')!, msgEl = document.getElementById('donemsg')!;
  const wa = document.getElementById('walink') as HTMLAnchorElement, err = document.getElementById('ferr')!;
  const f = form.elements as HTMLFormControlsCollection & Record<string, HTMLInputElement & HTMLTextAreaElement>;
  const val = (n: string) => ((form.elements.namedItem(n) as HTMLInputElement | null)?.value ?? '').trim();
  const radio = (n: string) => form.querySelector<HTMLInputElement>(`input[name="${n}"]:checked`);

  const q = new URLSearchParams(location.search);
  const svc = q.get('service'), plan = q.get('plan'), industry = q.get('industry');
  if (svc) { const r = form.querySelector<HTMLInputElement>(`input[name="svc"][value="${CSS.escape(svc)}"]`); if (r) r.checked = true; }
  if (plan) { const r = form.querySelector<HTMLInputElement>('input[name="svc"][value="plan"]'); if (r) r.checked = true; f.msg.value = `I'd like to know more about the ${plan} plan.`; }
  if (industry) { f.industry.value = industry; if (!f.msg.value) f.msg.value = `We're in ${industry}.`; }

  let started = false;
  form.addEventListener('input', () => { if (!started) { started = true; track('form_start', { form: 'lead' }); } });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = val('name'), phone = val('phone').replace(/\D/g, '').slice(-10), email = val('email');
    if (!name) { err.textContent = 'Add your name.'; f.name.focus(); return; }
    if (!/^[6-9]\d{9}$/.test(phone)) { err.textContent = 'Enter a 10-digit mobile number.'; f.phone.focus(); return; }
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { err.textContent = 'That email looks off.'; f.email.focus(); return; }
    err.textContent = '';
    const service = radio('svc')?.dataset.label ?? 'Not sure yet', budget = radio('budget')?.value ?? '';
    const data = {
      name, phone, email, business: val('biz'), website: val('website'), city: val('city'), service, budget, industry: val('industry'),
      message: val('msg'), page: location.pathname, utm: Object.fromEntries(q), hp: val('company_site'),
    };
    const text = [`Hi VSM, I'm ${name}${data.business ? ` from ${data.business}` : ''}, ${data.city || '-'}.`, `I need: ${service}`, budget && `Budget: ${budget}`, data.website && `Link: ${data.website}`, data.message, `My number: ${phone}`].filter(Boolean).join('\n');
    wa.href = `https://wa.me/${form.dataset.wa}?text=${encodeURIComponent(text)}`;

    form.classList.add('sending');
    let saved = false;
    try { saved = (await fetch('/api/lead', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(data) })).ok; } catch { saved = false; }
    form.classList.remove('sending');

    track('generate_lead', { service, budget, saved_to_crm: saved, value: 1, currency: 'INR' });
    msgEl.textContent = saved
      ? `Thanks, ${name.split(' ')[0]}. Your enquiry is with the founders; expect a call within business hours.`
      : 'Your message is ready. Tap below and WhatsApp opens with it written; just press send.';
    wa.firstChild!.textContent = saved ? 'Also message us on WhatsApp ' : 'Open WhatsApp ';
    form.hidden = true; done.hidden = false; wa.focus();
  });
}
