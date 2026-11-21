import { gsap } from 'gsap';

/**
 * First-visit splash: logo fades in and breathes, then an extreme zoom flies through it and the site appears.
 * Shown once per browser session (decided by the inline script in <head>), skippable, with a CSS failsafe.
 */
export function runSplash(): Promise<void> {
  const root = document.documentElement;
  const ui = document.querySelector<HTMLElement>('[data-splash]');
  if (!root.classList.contains('splash') || !ui) return Promise.resolve();
  ui.style.animation = 'none'; // JS is running; the CSS failsafe isn't needed
  const logo = ui.querySelector<SVGElement>('.splash-logo')!, count = ui.querySelector<HTMLElement>('.splash-count')!;
  const line = ui.querySelector<HTMLElement>('.splash-line i')!, meta = ui.querySelector<HTMLElement>('.splash-meta')!, skip = ui.querySelector<HTMLButtonElement>('.splash-skip')!;
  const main = document.getElementById('main'), header = document.getElementById('top');
  const o = { v: 0 };

  return new Promise((resolve) => {
    const finish = () => {
      root.classList.remove('splash');
      gsap.set([main, header], { clearProps: 'all' });
      ui.remove();
      document.dispatchEvent(new CustomEvent('vsm:splash-done'));
      resolve();
    };
    const tl = gsap.timeline({ onComplete: finish });
    tl.set([main, header], { opacity: 0 })
      .fromTo(logo, { scale: 0.6, opacity: 0, y: 20 }, { scale: 1, opacity: 1, y: 0, duration: 1, ease: 'expo.out' })
      .to(o, { v: 100, duration: 1.7, ease: 'power2.inOut', onUpdate: () => { count.textContent = String(Math.round(o.v)).padStart(3, '0'); } }, 0)
      .to(line, { scaleX: 1, duration: 1.7, ease: 'power2.inOut' }, 0)
      .to(logo, { scale: 1.22, duration: 0.6, ease: 'power1.inOut' }, 1.15)
      .to(meta, { opacity: 0, y: 10, duration: 0.3 }, 1.7)
      .to(skip, { opacity: 0, duration: 0.2 }, 1.7)
      // extreme zoom through the logo
      .to(logo, { scale: 60, duration: 1.05, ease: 'expo.in', force3D: false }, 1.75)
      .to(ui, { backgroundColor: 'rgba(17,17,16,0)', duration: 0.45, ease: 'power2.out' }, 2.45)
      .to(logo, { opacity: 0, duration: 0.25 }, 2.6)
      .fromTo([main, header], { opacity: 0, scale: 1.08 }, { opacity: 1, scale: 1, duration: 1, ease: 'expo.out', transformOrigin: '50% 30%' }, 2.45);
    skip.addEventListener('click', () => tl.progress(1), { once: true });
  });
}
