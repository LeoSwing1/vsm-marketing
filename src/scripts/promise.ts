import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

/**
 * VSM promise circle: the ring draws, the ten points pop in one by one around it, then the centre steps through
 * them in turn (progress arc follows). Click or focus a point to jump to it; it resumes after a pause.
 */
export function initPromise(): () => void {
  const root = document.querySelector<HTMLElement>('[data-promise]');
  if (!root) return () => {};
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const nodes = [...root.querySelectorAll<HTMLButtonElement>('.promise-node button')];
  const texts = nodes.map((b) => b.getAttribute('aria-label') ?? '');
  const textEl = root.querySelector<HTMLElement>('.promise-text')!, countEl = root.querySelector<HTMLElement>('.promise-count b')!;
  const progress = root.querySelector<SVGCircleElement>('.ring-progress')!, check = root.querySelector<HTMLElement>('.promise-check')!;
  const n = nodes.length;
  let i = 0, timer = 0, started = false;

  const show = (k: number, animate = true) => {
    i = (k + n) % n;
    nodes.forEach((b, j) => { b.classList.toggle('is-active', j === i); b.classList.toggle('is-done', j < i); });
    gsap.to(progress, { attr: { 'stroke-dashoffset': 1 - i / n }, duration: animate ? 0.9 : 0, ease: 'power3.inOut' });
    if (!animate || reduce) { textEl.textContent = texts[i]; countEl.textContent = String(i + 1).padStart(2, '0'); return; }
    gsap.timeline()
      .to([textEl, check], { opacity: 0, y: -14, duration: 0.25, ease: 'power2.in' })
      .add(() => { textEl.textContent = texts[i]; countEl.textContent = String(i + 1).padStart(2, '0'); })
      .fromTo(check, { scale: 0.4, rotate: -30 }, { opacity: 1, y: 0, scale: 1, rotate: 0, duration: 0.6, ease: 'back.out(2.2)' })
      .fromTo(textEl, { y: 18 }, { opacity: 1, y: 0, duration: 0.55, ease: 'expo.out' }, '<0.05');
  };
  const loop = (delay = 2800) => { clearTimeout(timer); timer = window.setTimeout(() => { show(i + 1); loop(); }, delay); };

  const onPick = (e: Event) => {
    const b = (e.target as HTMLElement).closest<HTMLButtonElement>('button[data-i]');
    if (!b) return;
    show(+b.dataset.i!); loop(6000);
  };
  root.addEventListener('click', onPick);
  root.addEventListener('focusin', onPick);

  if (reduce) { show(0, false); return () => clearTimeout(timer); }

  const ring = root.querySelector<SVGCircleElement>('.ring-draw')!;
  gsap.set(ring, { attr: { 'stroke-dashoffset': 1 } });
  gsap.set(nodes, { scale: 0, opacity: 0 });
  gsap.set([textEl, check], { opacity: 0 });
  const st = ScrollTrigger.create({
    trigger: root, start: 'top 65%', once: true,
    onEnter: () => {
      if (started) return; started = true;
      gsap.timeline()
        .to(ring, { attr: { 'stroke-dashoffset': 0 }, duration: 1.4, ease: 'power2.inOut' })
        .to(nodes, { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(2.4)', stagger: 0.14 }, 0.15)
        .add(() => { show(0); loop(); }, '-=0.2');
    },
  });
  // pause the cycle while the section is off screen
  const io = new IntersectionObserver(([e]) => { if (!started) return; if (e.isIntersecting) loop(1200); else clearTimeout(timer); });
  io.observe(root);
  return () => { clearTimeout(timer); st.kill(); io.disconnect(); root.removeEventListener('click', onPick); root.removeEventListener('focusin', onPick); };
}
