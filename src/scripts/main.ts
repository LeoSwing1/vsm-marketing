import { initMotion, heroIntro } from './motion';
import { initPromise } from './promise';
import { initChat } from './chatbot';
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
  // After a splash, the hero entrance and the particle gather start on the reveal itself, not after the splash UI is gone.
  const intro = splashing ? heroIntro() : null;
  if (first) {
    first = false; lenis?.stop();
    // particles wake once the zoom has passed through, so the last frames of the zoom don't share the GPU
    await runSplash(heroP, () => { intro?.play(); setTimeout(() => void heroP.then((h) => h?.gather()), 380); });
    lenis?.start();
  }
  bindTracking(); pageView();
  initMedia(); initLeadForm();
  cleanups.push(initInteractions());
  cleanups.push(initPromise());
  cleanups.push(initChat());
  initReviews().then((off) => cleanups.push(off));
  const hero = await heroP;
  if (splashing) hero?.gather();
  cleanups.push(initMotion({ onHeroScroll: (p) => hero?.setScroll(p), skipHeroIntro: !!intro }));
}

document.addEventListener('astro:page-load', () => { void init(); });
document.addEventListener('astro:before-swap', () => { cleanups.forEach((f) => f()); cleanups = []; });
