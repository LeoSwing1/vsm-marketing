import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

/**
 * Lenis smooth scrolling, driven by GSAP's ticker so ScrollTrigger, the particle scene and the scroll
 * all update in the same frame (removes the stutter of mixed native-scroll + rAF updates).
 * Off for reduced motion and on touch devices (native momentum is already smooth there).
 */
let lenis: Lenis | null = null;

export function initSmooth(): Lenis | null {
  if (lenis) return lenis;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return null;
  lenis = new Lenis({ duration: 1.1, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smoothWheel: true, anchors: { offset: -80 } });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis!.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
  document.addEventListener('astro:after-swap', () => { lenis!.scrollTo(0, { immediate: true }); lenis!.resize(); });
  return lenis;
}

export const smooth = () => lenis;
