import { initMotion } from './motion';
import { initInteractions } from './interactions';
import { initMedia } from './media';
import { initReviews } from './reviews';
import { initLeadForm } from './form';
import { bindTracking, pageView } from './analytics';
import type { Hero3D } from './hero3d';
import { runSplash } from './splash';
import { initSmooth } from './smooth';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

ScrollTrigger.config({ ignoreMobileResize: true });

const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
let cleanups: (() => void)[] = [];

const webgl = () => { try { return !!document.createElement('canvas').getContext('webgl2'); } catch { return false; } };

async function mountHero(hold: boolean): Promise<Hero3D | null> {
  const host = document.getElementById('hero-canvas');
  if (!host || !webgl()) { host?.classList.add('nogl'); return null; }
  try {
    const { createHero3D } = await import('./hero3d'); // Three.js only loads on the homepage
    const h = await createHero3D(host, reduce, { hold });
    cleanups.push(() => h.dispose());
    return h;
  } catch (e) { console.warn('[hero]', e); return null; }
}

let first = true;
async function init() {
  // While the splash plays, the particle scene loads underneath with particles spread out;
  // when the splash finishes they collect into "VSM".
  const splashing = first && document.documentElement.classList.contains('splash');
  const heroP = mountHero(splashing);
  const lenis = initSmooth();
  if (first) { first = false; lenis?.stop(); await runSplash(); lenis?.start(); }
  bindTracking(); pageView();
  initMedia(); initLeadForm();
  cleanups.push(initInteractions());
  initReviews().then((off) => cleanups.push(off));
  const hero = await heroP;
  if (splashing) hero?.gather();
  cleanups.push(initMotion({ onHeroScroll: (p) => hero?.setScroll(p) }));
}

document.addEventListener('astro:page-load', () => { void init(); });
document.addEventListener('astro:before-swap', () => { cleanups.forEach((f) => f()); cleanups = []; });
