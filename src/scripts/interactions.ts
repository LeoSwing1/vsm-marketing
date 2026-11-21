import { gsap } from 'gsap';
import { Flip } from 'gsap/Flip';
gsap.registerPlugin(Flip);

const fine = () => matchMedia('(hover: hover) and (pointer: fine)').matches;
const reduce = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
type Off = () => void;
const on = <K extends keyof HTMLElementEventMap>(el: EventTarget, ev: K | string, fn: (e: any) => void, opt?: AddEventListenerOptions): Off => {
  el.addEventListener(ev, fn, opt); return () => el.removeEventListener(ev, fn, opt);
};

/** Custom cursor: dot that grows over links and becomes a labelled disc over [data-cursor]. Desktop only. */
let cursorEl: HTMLDivElement | null = null;
function cursor(): Off {
  if (!fine() || reduce()) return () => {};
  if (!cursorEl) {
    cursorEl = document.createElement('div'); cursorEl.className = 'cursor'; cursorEl.setAttribute('aria-hidden', 'true');
    cursorEl.innerHTML = '<b></b>'; document.body.appendChild(cursorEl);
  }
  document.documentElement.classList.add('has-cursor');
  const c = cursorEl, label = c.querySelector('b')!;
  const xTo = gsap.quickTo(c, 'x', { duration: 0.35, ease: 'power3' }), yTo = gsap.quickTo(c, 'y', { duration: 0.35, ease: 'power3' });
  const offs = [
    on(window, 'pointermove', (e: PointerEvent) => { xTo(e.clientX); yTo(e.clientY); }),
    on(document, 'pointerover', (e: PointerEvent) => {
      const t = e.target as HTMLElement;
      const v = t.closest<HTMLElement>('[data-cursor]');
      c.classList.toggle('view', !!v); label.textContent = v?.dataset.cursor ?? '';
      c.classList.toggle('link', !v && !!t.closest('a,button,summary,label'));
    }),
  ];
  return () => offs.forEach((f) => f());
}

/** Magnetic pull on buttons. */
function magnetic(): Off {
  if (!fine() || reduce()) return () => {};
  const offs: Off[] = [];
  document.querySelectorAll<HTMLElement>('.magnetic').forEach((el) => {
    const xTo = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'elastic.out(1, .4)' }), yTo = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'elastic.out(1, .4)' });
    offs.push(on(el, 'pointermove', (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      xTo((e.clientX - r.left - r.width / 2) * 0.35); yTo((e.clientY - r.top - r.height / 2) * 0.35);
    }), on(el, 'pointerleave', () => { xTo(0); yTo(0); }));
  });
  return () => offs.forEach((f) => f());
}

/** Project art: 3D tilt, shape follows the cursor, hover plays the first reel if the file exists. */
function projectArt(): Off {
  const offs: Off[] = [];
  document.querySelectorAll<HTMLElement>('[data-tilt]').forEach((art) => {
    if (fine() && !reduce()) {
      offs.push(on(art, 'pointermove', (e: PointerEvent) => {
        const r = art.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
        art.style.transform = `perspective(900px) rotateY(${x * 7}deg) rotateX(${-y * 7}deg)`;
        art.style.setProperty('--mx', `${x * 40}px`); art.style.setProperty('--my', `${y * 40}px`);
      }), on(art, 'pointerleave', () => { art.style.transform = ''; art.style.setProperty('--mx', '0px'); art.style.setProperty('--my', '0px'); }));
    }
    const src = art.dataset.video;
    if (!src) return;
    let v: HTMLVideoElement | null = null;
    const play = () => {
      if (!v) {
        v = document.createElement('video');
        Object.assign(v, { muted: true, loop: true, playsInline: true, preload: 'none', src });
        v.addEventListener('loadeddata', () => art.classList.add('has-media'), { once: true });
        v.addEventListener('error', () => { v?.remove(); v = null; art.dataset.video = ''; }, { once: true });
        art.prepend(v);
      }
      v.play().catch(() => {});
    };
    const pause = () => { v?.pause(); };
    if (fine()) offs.push(on(art.closest('a') ?? art, 'pointerenter', play), on(art.closest('a') ?? art, 'pointerleave', pause));
  });
  return () => offs.forEach((f) => f());
}

/** Work filters with a FLIP layout animation. */
function filters(): Off {
  const offs: Off[] = [];
  document.querySelectorAll<HTMLElement>('.work-filters').forEach((bar) => {
    const grid = bar.nextElementSibling as HTMLElement | null;
    if (!grid) return;
    offs.push(on(bar, 'click', (e: MouseEvent) => {
      const btn = (e.target as HTMLElement).closest<HTMLButtonElement>('.filter-chip');
      if (!btn) return;
      bar.querySelectorAll('.filter-chip').forEach((b) => { b.classList.toggle('is-active', b === btn); b.setAttribute('aria-pressed', String(b === btn)); });
      const f = btn.dataset.filter!;
      const cards = [...grid.querySelectorAll<HTMLElement>('.project-card')];
      const state = Flip.getState(cards);
      cards.forEach((c) => { c.hidden = f !== 'all' && c.dataset.category !== f; });
      Flip.from(state, { duration: reduce() ? 0 : 0.7, ease: 'expo.inOut', absolute: true, scale: true,
        onEnter: (els) => gsap.fromTo(els, { opacity: 0, scale: 0.92 }, { opacity: 1, scale: 1, duration: 0.5 }),
        onLeave: (els) => gsap.to(els, { opacity: 0, scale: 0.92, duration: 0.35 }) });
    }));
  });
  return () => offs.forEach((f) => f());
}

/** Floating orange tag card that follows the cursor over the service list. */
function servicePreview(): Off {
  const list = document.querySelector<HTMLElement>('[data-svc-list]'), card = document.querySelector<HTMLElement>('.svc-preview');
  if (!list || !card || !fine() || reduce()) return () => {};
  const xTo = gsap.quickTo(card, 'x', { duration: 0.45, ease: 'power3' }), yTo = gsap.quickTo(card, 'y', { duration: 0.45, ease: 'power3' });
  const offs = [
    on(list, 'pointermove', (e: PointerEvent) => {
      const row = (e.target as HTMLElement).closest<HTMLElement>('.service-row');
      xTo(e.clientX + 190); yTo(e.clientY);
      if (!row) return;
      if (card.dataset.for !== row.dataset.name) {
        card.dataset.for = row.dataset.name;
        card.innerHTML = `<b>${row.dataset.name}</b>${(row.dataset.tags ?? '').split('|').map((t) => `<span>${t}</span>`).join('')}`;
      }
      card.classList.add('on');
    }),
    on(list, 'pointerleave', () => card.classList.remove('on')),
  ];
  return () => offs.forEach((f) => f());
}

/** Infinite client marquee that speeds up and skews with scroll velocity. */
function marquee(): Off {
  const tracks = [...document.querySelectorAll<HTMLElement>('[data-marquee]')];
  if (!tracks.length || reduce()) return () => {};
  const tweens = tracks.map((t) => gsap.to(t, { xPercent: -50, ease: 'none', duration: 40, repeat: -1 }));
  let lastY = scrollY, boost = 0;
  const tick = () => {
    const v = scrollY - lastY; lastY = scrollY;
    boost += (Math.min(Math.abs(v), 60) / 10 - boost) * 0.1;
    tweens.forEach((tw) => tw.timeScale(1 + boost));
  };
  gsap.ticker.add(tick);
  return () => { gsap.ticker.remove(tick); tweens.forEach((t) => t.kill()); };
}

/** Pricing cards: orange spotlight follows the cursor. */
function spotlight(): Off {
  const offs: Off[] = [];
  document.querySelectorAll<HTMLElement>('[data-spot]').forEach((c) => offs.push(on(c, 'pointermove', (e: PointerEvent) => {
    const r = c.getBoundingClientRect();
    c.style.setProperty('--x', `${e.clientX - r.left}px`); c.style.setProperty('--y', `${e.clientY - r.top}px`);
  })));
  return () => offs.forEach((f) => f());
}

/** Mobile menu + header that hides on scroll down + reading progress bar. */
function chrome(): Off {
  const header = document.getElementById('top'), toggle = document.querySelector<HTMLButtonElement>('.menu-toggle'), bar = document.querySelector<HTMLElement>('.progress');
  const offs: Off[] = [];
  const setMenu = (open: boolean) => { document.body.classList.toggle('menu-open', open); toggle?.setAttribute('aria-expanded', String(open)); toggle?.setAttribute('aria-label', open ? 'Close menu' : 'Open menu'); };
  if (toggle) offs.push(on(toggle, 'click', () => setMenu(!document.body.classList.contains('menu-open'))));
  document.querySelectorAll('.mobile-menu a').forEach((a) => offs.push(on(a, 'click', () => setMenu(false))));
  offs.push(on(document, 'keydown', (e: KeyboardEvent) => { if (e.key === 'Escape') setMenu(false); }));
  let lastY = scrollY;
  offs.push(on(window, 'scroll', () => {
    const y = scrollY;
    header?.classList.toggle('hide', y > 300 && y > lastY && !document.body.classList.contains('menu-open'));
    lastY = y;
    if (bar) bar.style.transform = `scaleX(${y / Math.max(1, document.documentElement.scrollHeight - innerHeight)})`;
  }, { passive: true }));
  return () => { offs.forEach((f) => f()); setMenu(false); };
}

/** Soft 3D tilt on glass cards (badges, team, why-VSM). */
function tiltCards(): Off {
  if (!fine() || reduce()) return () => {};
  const offs: Off[] = [];
  document.querySelectorAll<HTMLElement>('[data-tilt-card]').forEach((c) => {
    const rx = gsap.quickTo(c, 'rotationX', { duration: 0.6, ease: 'power3' }), ry = gsap.quickTo(c, 'rotationY', { duration: 0.6, ease: 'power3' });
    gsap.set(c, { transformPerspective: 900 });
    offs.push(on(c, 'pointermove', (e: PointerEvent) => {
      const r = c.getBoundingClientRect();
      ry(((e.clientX - r.left) / r.width - 0.5) * 12); rx(-((e.clientY - r.top) / r.height - 0.5) * 12);
    }), on(c, 'pointerleave', () => { rx(0); ry(0); }));
  });
  return () => offs.forEach((f) => f());
}

/** Brand wall: a coloured glow follows the cursor. */
function brandGlow(): Off {
  const wall = document.querySelector<HTMLElement>('[data-spot-wall]');
  if (!wall) return () => {};
  return on(wall, 'pointermove', (e: PointerEvent) => {
    const r = wall.getBoundingClientRect();
    wall.style.setProperty('--x', `${e.clientX - r.left}px`); wall.style.setProperty('--y', `${e.clientY - r.top}px`);
  });
}

/** Testimonial slider: drag, arrows, dots, autoplay (pauses on hover). */
function slider(): Off {
  const box = document.querySelector<HTMLElement>('[data-slider]'), track = box?.querySelector<HTMLElement>('.t-track');
  if (!box || !track) return () => {};
  const dots = box.querySelector<HTMLElement>('.t-dots')!;
  let i = 0, timer = 0, startX = 0, dx = 0, down = false;
  const cards = () => [...track.children] as HTMLElement[];
  const go = (n: number) => {
    const cs = cards(); i = (n + cs.length) % cs.length;
    gsap.to(track, { x: -cs[i].offsetLeft, duration: reduce() ? 0 : 0.8, ease: 'expo.out' });
    dots.innerHTML = cs.map((_, k) => `<i class="${k === i ? 'on' : ''}"></i>`).join('');
  };
  const play = () => { clearInterval(timer); if (!reduce()) timer = window.setInterval(() => go(i + 1), 6000); };
  (box as HTMLElement & { _go?: (n: number) => void })._go = go;
  const offs = [
    on(box, 'click', (e: MouseEvent) => { const b = (e.target as HTMLElement).closest<HTMLButtonElement>('[data-d]'); if (b) { go(i + Number(b.dataset.d)); play(); } }),
    on(track, 'pointerdown', (e: PointerEvent) => { down = true; startX = e.clientX; dx = 0; }),
    on(window, 'pointermove', (e: PointerEvent) => { if (!down) return; dx = e.clientX - startX; gsap.set(track, { x: -cards()[i].offsetLeft + dx }); }),
    on(window, 'pointerup', () => { if (!down) return; down = false; if (Math.abs(dx) > 60) go(i + (dx < 0 ? 1 : -1)); else go(i); play(); }),
    on(box, 'pointerenter', () => clearInterval(timer)), on(box, 'pointerleave', play),
  ];
  go(0); play();
  return () => { clearInterval(timer); offs.forEach((f) => f()); };
}

export function initInteractions(): Off {
  const offs = [cursor(), magnetic(), projectArt(), filters(), servicePreview(), marquee(), spotlight(), chrome(), tiltCards(), brandGlow(), slider()];
  return () => offs.forEach((f) => f());
}
