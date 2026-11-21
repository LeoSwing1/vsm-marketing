import { gsap } from 'gsap';

/**
 * First-visit splash: logo fades in and breathes, then an extreme zoom flies through it and the site appears.
 * Shown once per browser session (decided by the inline script in <head>), skippable, with a CSS failsafe.
 */
/**
 * The SVG bevel filter is cheap at 1× but the browser re-runs it over the whole enlarged area every frame of a 60× zoom,
 * which is what made the zoom hitch. We draw the filtered logo once into a high-res canvas and zoom that on the GPU.
 */
let swapToBitmap: (svg: SVGElement) => HTMLCanvasElement | null = () => null;

function rasterize(svg: SVGElement): Promise<HTMLCanvasElement | null> {
  const box = svg.getBoundingClientRect();
  if (!box.width) return Promise.resolve(null);
  const res = Math.min(4096, Math.round(box.width * Math.min(devicePixelRatio || 1, 2) * 3)); // stays crisp to ~3× zoom
  // Web fonts don't load inside an <img>-rendered SVG, so the wordmark text is drawn on the canvas with the page's Manrope.
  const clone = svg.cloneNode(true) as SVGElement;
  const text = clone.querySelector('text'); text?.remove();
  const src = new XMLSerializer().serializeToString(clone).replace('<svg', `<svg width="${res}" height="${Math.round(res * box.height / box.width)}"`);
  const vb = (svg as SVGSVGElement).viewBox?.baseVal;
  const url = URL.createObjectURL(new Blob([src], { type: 'image/svg+xml' }));
  return document.fonts.ready.then(() => new Promise<HTMLCanvasElement | null>((done) => {
    const img = new Image();
    img.onload = () => {
      const c = document.createElement('canvas');
      c.width = res; c.height = Math.round(res * box.height / box.width);
      const ctx = c.getContext('2d')!;
      ctx.drawImage(img, 0, 0, c.width, c.height);
      if (text && vb?.width) {
        const k = c.width / vb.width, size = +(text.getAttribute('font-size') ?? 8.6) * k, gap = +(text.getAttribute('letter-spacing') ?? 0) * k;
        ctx.font = `${text.getAttribute('font-weight') ?? 700} ${size}px Manrope, Arial, sans-serif`;
        ctx.fillStyle = text.getAttribute('fill') ?? '#d6dccb'; ctx.textBaseline = 'alphabetic';
        const chars = [...(text.textContent ?? '')], widths = chars.map((ch) => ctx.measureText(ch).width);
        let x = (+(text.getAttribute('x') ?? 0) - vb.x) * k - (widths.reduce((a, b) => a + b, 0) + gap * chars.length) / 2; // SVG counts trailing spacing
        const y = (+(text.getAttribute('y') ?? 0) - vb.y) * k;
        chars.forEach((ch, i) => { ctx.fillText(ch, x, y); x += widths[i] + gap; });
      }
      c.className = 'splash-logo splash-bitmap';
      c.setAttribute('aria-hidden', 'true');
      URL.revokeObjectURL(url); done(c);
    };
    img.onerror = () => { URL.revokeObjectURL(url); done(null); };
    img.src = url;
  }));
}

export async function runSplash(prepare?: Promise<unknown>, onReveal?: () => void): Promise<void> {
  const root = document.documentElement;
  const ui = document.querySelector<HTMLElement>('[data-splash]');
  if (!root.classList.contains('splash') || !ui) return;
  ui.style.animation = 'none'; // JS is running; the CSS failsafe isn't needed
  const logo = ui.querySelector<SVGElement>('.splash-logo')!, count = ui.querySelector<HTMLElement>('.splash-count')!;
  const line = ui.querySelector<HTMLElement>('.splash-line i')!, meta = ui.querySelector<HTMLElement>('.splash-meta')!, skip = ui.querySelector<HTMLButtonElement>('.splash-skip')!;
  const main = document.getElementById('main'), header = document.getElementById('top');
  const o = { v: 0 };
  const bitmap = rasterize(logo); // drawn while the logo fades in, ready before the zoom

  // Let heavy one-off work (the 3D hero building and compiling its shaders) finish on the dark screen first,
  // so nothing blocks the main thread once the logo is moving. Capped so a slow network never delays the splash much.
  if (prepare) await Promise.race([prepare.catch(() => null), new Promise((r) => setTimeout(r, 900))]);
  await Promise.race([bitmap, new Promise((r) => setTimeout(r, 300))]);

  let ready: HTMLCanvasElement | null = null;
  // in the DOM (invisible) as soon as it exists, so its texture is uploaded before the zoom needs it
  void bitmap.then((c) => { ready = c; if (c) { gsap.set(c, { opacity: 0, scale: 0.6, force3D: true }); logo.after(c); } });
  swapToBitmap = (svg) => {
    if (!ready) return null;
    const cur = gsap.getProperty(svg, 'scale') as number;
    gsap.set(ready, { scale: cur, opacity: gsap.getProperty(svg, 'opacity') as number, y: gsap.getProperty(svg, 'y') as number, force3D: true });
    if (!ready.isConnected) svg.after(ready);
    svg.style.visibility = 'hidden';
    return ready;
  };

  return new Promise((resolve) => {
    const finish = () => {
      root.classList.remove('splash');
      gsap.set([main, header], { clearProps: 'all' });
      ui.remove();
      document.dispatchEvent(new CustomEvent('vsm:splash-done'));
      resolve();
    };
    // One continuous zoom (1 → 60×) instead of "breathe, stop, zoom": log-scale grows from a slow creep into a rush,
    // with no point where the speed drops to zero. g(u) = a·u + (1−a)·u³ keeps velocity > 0 from the first frame.
    const MAX = 60, A = 0.07, z = { u: 0 };
    let target: Element = logo;
    const scaleAt = (u: number) => Math.exp(Math.log(MAX) * (A * u + (1 - A) * u * u * u));
    const tl = gsap.timeline({ onComplete: finish });
    // 0.001 rather than 0: the browser paints the page (and keeps it on its own layer) behind the splash early,
    // so the reveal is only an opacity/scale change on the compositor, not a full first paint mid-zoom.
    tl.set([main, header], { opacity: 0.001, scale: 1.08, transformOrigin: '50% 30%', willChange: 'transform, opacity', force3D: true })
      .fromTo(logo, { scale: 0.6, opacity: 0, y: 20 }, { scale: 1, opacity: 1, y: 0, duration: 1, ease: 'expo.out' })
      .to(o, { v: 100, duration: 1.7, ease: 'power2.inOut', onUpdate: () => { count.textContent = String(Math.round(o.v)).padStart(3, '0'); } }, 0)
      .to(line, { scaleX: 1, duration: 1.7, ease: 'power2.inOut' }, 0)
      .add(() => { target = swapToBitmap(logo) ?? logo; }, 1)
      .to(z, { u: 1, duration: 2.05, ease: 'none', onUpdate: () => gsap.set(target, { scale: scaleAt(z.u), opacity: z.u < 0.84 ? 1 : Math.max(0, 1 - (z.u - 0.84) / 0.16), force3D: true }) }, 1)
      .to(meta, { opacity: 0, y: 10, duration: 0.3 }, 1.7)
      .to(skip, { opacity: 0, duration: 0.2 }, 1.7)
      .to(ui, { backgroundColor: 'rgba(17,17,16,0)', duration: 0.5, ease: 'power2.out' }, 2.6)
      .add(() => onReveal?.(), 2.6)
      .to([main, header], { opacity: 1, scale: 1, duration: 1, ease: 'expo.out' }, 2.6);
    skip.addEventListener('click', () => tl.progress(1), { once: true });
  });
}
