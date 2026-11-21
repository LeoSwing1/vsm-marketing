/** GA4 events. No-ops if PUBLIC_GA4_ID isn't set. Mark lead events as key events in GA4. */
type Gtag = (cmd: 'event' | 'config', name: string, params?: Record<string, unknown>) => void;
const g = () => (window as unknown as { gtag?: Gtag }).gtag;

export function track(name: string, params: Record<string, unknown> = {}): void {
  g()?.('event', name, params);
}

export function pageView(): void {
  track('page_view', { page_location: location.href, page_path: location.pathname, page_title: document.title });
}

let bound = false;
/** One delegated listener for every [data-track] link/button, plus tel:/mailto:/wa.me clicks. */
export function bindTracking(): void {
  if (bound) return; bound = true;
  document.addEventListener('click', (e) => {
    const a = (e.target as HTMLElement).closest<HTMLElement>('a,button');
    if (!a) return;
    const href = a.getAttribute('href') ?? '';
    const name = a.dataset.track ?? (href.startsWith('tel:') ? 'call' : href.startsWith('mailto:') ? 'email' : href.includes('wa.me') ? 'whatsapp' : '');
    if (name) track(name, { link_text: a.textContent?.trim().slice(0, 80), plan: a.dataset.plan, page_path: location.pathname });
  });
}
