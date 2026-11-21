/**
 * Media slots. Drop files into /public/media with the names set in src/content/site.ts:
 *   <figure class="media" data-src="media/pushpdeep-1.mp4">  -> muted looping video
 *   <figure class="media" data-src="media/team.jpg">         -> image
 *   <li data-logo="media/logos/taruvan.svg">Taruvan</li>     -> logo replaces the name once it loads
 * A missing file keeps the designed poster / text, so the layout never breaks.
 */
export function initMedia(): void {
  const load = (el: HTMLElement) => {
    const src = el.dataset.src!, alt = el.dataset.alt ?? '';
    const isVideo = /\.(mp4|webm|mov)$/i.test(src);
    const node = isVideo ? document.createElement('video') : new Image();
    node.className = 'media-el';
    const ok = () => el.classList.add('has-media');
    const fail = () => { node.remove(); el.classList.remove('has-media'); };
    if (node instanceof HTMLVideoElement) {
      Object.assign(node, { muted: true, loop: true, playsInline: true, autoplay: true, preload: 'metadata' });
      node.setAttribute('aria-label', alt);
      node.addEventListener('loadeddata', ok, { once: true });
      node.addEventListener('error', fail, { once: true });
      node.src = src;
    } else {
      node.alt = alt; node.decoding = 'async';
      node.addEventListener('load', ok, { once: true });
      node.addEventListener('error', fail, { once: true });
      node.src = src;
    }
    el.appendChild(node);
  };
  const slots = [...document.querySelectorAll<HTMLElement>('.media[data-src]')].filter((el) => el.dataset.src);
  const io = new IntersectionObserver((entries) => entries.forEach((e) => {
    if (!e.isIntersecting) return;
    io.unobserve(e.target); load(e.target as HTMLElement);
  }), { rootMargin: '300px' });
  // gallery items stay hidden until their photo exists, so they can't be observed: load those directly
  slots.forEach((s) => (s.classList.contains('gallery-item') ? load(s) : io.observe(s)));

  document.querySelectorAll<HTMLElement>('[data-logo]').forEach((li) => {
    const img = new Image();
    img.alt = li.textContent ?? '';
    img.onload = () => li.replaceChildren(img);
    img.src = li.dataset.logo!;
  });
}
