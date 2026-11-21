import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

/** Wrap words in masks (keeps <br> and <em>) so headings can rise line by line. */
function split(el: HTMLElement): HTMLElement[] {
  if (!el.dataset.split) {
    el.dataset.split = '1';
    el.setAttribute('aria-label', el.textContent?.replace(/\s+/g, ' ').trim() ?? '');
    const walk = (node: Node) => {
      [...node.childNodes].forEach((n) => {
        if (n.nodeType === 3) {
          const parts = (n.textContent ?? '').split(/(\s+)/);
          const frag = document.createDocumentFragment();
          parts.forEach((p) => {
            if (!p) return;
            if (/^\s+$/.test(p)) { frag.append(' '); return; }
            const w = document.createElement('span'); w.className = 'w'; w.setAttribute('aria-hidden', 'true');
            const i = document.createElement('span'); i.textContent = p; w.append(i); frag.append(w);
          });
          n.replaceWith(frag);
        } else if (n.nodeType === 1 && (n as Element).tagName !== 'BR') walk(n);
      });
    };
    walk(el);
  }
  return [...el.querySelectorAll<HTMLElement>('.w > span')];
}

/** "1.8M" "5.2×" "₹2.8L" "200+" "4.9★" "₹2Cr+": count the last number, keep the rest. */
function countUp(el: HTMLElement): gsap.core.Tween | null {
  const text = el.textContent ?? '';
  const ms = [...text.matchAll(/\d+(?:\.\d+)?/g)];
  if (!ms.length) return null;
  const m = ms[ms.length - 1], end = parseFloat(m[0]), dec = (m[0].split('.')[1] ?? '').length;
  const pre = text.slice(0, m.index), post = text.slice(m.index! + m[0].length), o = { v: 0 };
  return gsap.to(o, { v: end, duration: 1.6, ease: 'power3.out', paused: true, onUpdate: () => { el.textContent = pre + o.v.toFixed(dec) + post; }, onComplete: () => { el.textContent = text; } });
}

/**
 * Hero entrance as a paused timeline. Building it applies the hidden "from" state immediately, so after a splash
 * the hero can sit primed behind it and play at the exact moment of the reveal (no full-then-hidden flash).
 */
export function heroIntro(): gsap.core.Timeline {
  const tl = gsap.timeline({ paused: true });
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return tl;
  const hero = document.querySelector<HTMLElement>('.hero');
  const ht = document.querySelector<HTMLElement>('[data-hero-title]');
  if (ht) tl.from(split(ht), { yPercent: 115, rotate: 4, duration: 1.3, ease: 'expo.out', stagger: 0.07, immediateRender: true }, 0.1);
  if (hero) {
    const rest = hero.querySelectorAll('.eyebrow, .hero-bottom > *, .hero-foot');
    if (rest.length) tl.from(rest, { y: 24, opacity: 0, duration: 1, ease: 'power3.out', stagger: 0.08, immediateRender: true }, 0.5);
    const vis = hero.querySelector('.hero-visual');
    if (vis) tl.from(vis, { scale: 0.85, opacity: 0, duration: 1.8, ease: 'expo.out', immediateRender: true }, 0.2);
  }
  return tl;
}

export function initMotion(opts: { onHeroScroll?: (p: number) => void; skipHeroIntro?: boolean } = {}): () => void {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const ctx = gsap.context(() => {
    const hero = document.querySelector<HTMLElement>('.hero');
    if (hero) ScrollTrigger.create({ trigger: hero, start: 'top top', end: 'bottom top', scrub: true, onUpdate: (s) => opts.onHeroScroll?.(s.progress) });
    if (reduce) return;

    // hero title on load (after a splash, heroIntro() already ran it at the reveal)
    if (!opts.skipHeroIntro) heroIntro().play();

    // headings
    gsap.utils.toArray<HTMLElement>('.split:not([data-hero-title])').forEach((h) => {
      gsap.from(split(h), { yPercent: 115, duration: 1.1, ease: 'expo.out', stagger: 0.05, scrollTrigger: { trigger: h, start: 'top 88%', once: true } });
    });

    // counters
    gsap.utils.toArray<HTMLElement>('[data-count]').forEach((el) => {
      const tw = countUp(el);
      if (tw) ScrollTrigger.create({ trigger: el, start: 'top 92%', once: true, onEnter: () => tw.play() });
    });

    // blocks drift up as they enter (transform only, so text is never hidden)
    const drift = '.project-card, .service-row, .industry-grid a, .steps article, .price-card, .faq details, .detail-row, .related a, .built-list li, .office, [data-fade], .diff-card, .member, .t-card, .ideal li, .svc-cols li';
    const below = gsap.utils.toArray<HTMLElement>(drift).filter((el) => el.getBoundingClientRect().top > innerHeight);
    if (below.length) gsap.set(below, { y: 50 });
    if (below.length) ScrollTrigger.batch(below, {
      start: 'top 96%', once: true,
      onEnter: (els) => gsap.to(els, { y: 0, duration: 1, ease: 'expo.out', stagger: 0.06, clearProps: 'transform' }),
    });

    // steps progress line
    const steps = document.querySelector<HTMLElement>('[data-steps]');
    const sl = steps?.querySelector('.steps-line');
    if (steps && sl) gsap.to(sl, { scaleX: 1, ease: 'none', scrollTrigger: { trigger: steps, start: 'top 85%', end: 'bottom 55%', scrub: true } });

    // pillars rise in
    gsap.from('.pillar h2', { yPercent: 60, opacity: 0, duration: 1.2, ease: 'expo.out', stagger: 0.12, scrollTrigger: { trigger: '.pillars', start: 'top 90%', once: true } });

    // badges fly in from depth
    const badges = gsap.utils.toArray<HTMLElement>('.badge');
    if (badges.length) gsap.from(badges, { z: -400, rotationX: 40, opacity: 0, transformPerspective: 900, duration: 1.2, ease: 'expo.out', stagger: 0.08, scrollTrigger: { trigger: '.badge-grid', start: 'top 85%', once: true }, clearProps: 'transform,opacity' });

    // brand names cascade
    const names = gsap.utils.toArray<HTMLElement>('.brand-wall li');
    if (names.length) gsap.from(names, { y: 30, opacity: 0, filter: 'blur(6px)', duration: 0.8, ease: 'power3.out', stagger: { each: 0.035, from: 'center' }, scrollTrigger: { trigger: '.brand-wall', start: 'top 85%', once: true }, clearProps: 'filter' });

    // team avatars pop
    const avs = gsap.utils.toArray<HTMLElement>('.avatar');
    if (avs.length) gsap.from(avs, { scale: 0, rotate: -90, duration: 1, ease: 'back.out(1.8)', stagger: 0.1, scrollTrigger: { trigger: '.team-grid', start: 'top 85%', once: true } });

    // service timeline: line fills, steps light up as you pass them
    const tlBox = document.querySelector<HTMLElement>('[data-timeline] .timeline');
    if (tlBox) {
      gsap.to(tlBox.querySelector('.timeline-line i'), { scaleY: 1, ease: 'none', scrollTrigger: { trigger: tlBox, start: 'top 60%', end: 'bottom 60%', scrub: true } });
      tlBox.querySelectorAll('li').forEach((li) => ScrollTrigger.create({ trigger: li, start: 'top 60%', onEnter: () => li.classList.add('lit'), onLeaveBack: () => li.classList.remove('lit') }));
    }

    // project art parallax
    gsap.utils.toArray<HTMLElement>('.project-art .art-shape').forEach((s) => {
      gsap.fromTo(s, { yPercent: 18 }, { yPercent: -18, ease: 'none', scrollTrigger: { trigger: s.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } });
    });

    // big footer line and contact band headline scale in
    gsap.utils.toArray<HTMLElement>('.contact-band h2, .footer-top h2').forEach((h) => {
      gsap.fromTo(h, { scale: 0.92, transformOrigin: 'left bottom' }, { scale: 1, ease: 'none', scrollTrigger: { trigger: h, start: 'top bottom', end: 'top 40%', scrub: true } });
    });
  });
  const t = setTimeout(() => ScrollTrigger.refresh(), 400);
  return () => { clearTimeout(t); ctx.revert(); };
}
