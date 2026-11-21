import {
  WebGLRenderer, Scene, PerspectiveCamera, ShaderMaterial, Group, Vector2, Vector3, Color,
  BufferGeometry, Float32BufferAttribute, Points, AdditiveBlending, SRGBColorSpace, MathUtils,
} from 'three';
import { gsap } from 'gsap';

export interface Hero3D { gather(): void; setScroll(p: number): void; dispose(): void }

/**
 * Full-hero particle field. Thousands of points spell "VSM", drift like dust, get pushed away by the cursor,
 * burst and re-form on click, and every few seconds fold into a globe and back. A wide star field fills the
 * whole hero, so nothing sits inside a visible box.
 */
const VERT = /* glsl */ `
attribute vec3 aText; attribute vec3 aSphere; attribute float aSeed;
uniform float uTime; uniform float uMorph; uniform float uBurst; uniform float uScatter; uniform float uPx;
uniform vec3 uMouse; uniform float uMouseOn; uniform vec3 uOffset; uniform vec3 uLime; uniform vec3 uOrange; uniform vec3 uPaper;
varying vec3 vCol; varying float vA;
void main(){
  float m = smoothstep(0., 1., clamp(uMorph * 1.25 - aSeed * .25, 0., 1.));
  vec3 p = mix(aText, aSphere, m);
  p += .05 * vec3(sin(uTime * .7 + aSeed * 40.), cos(uTime * .6 + aSeed * 31.), sin(uTime * .5 + aSeed * 17.));
  vec3 dir = normalize(vec3(sin(aSeed * 91.7), cos(aSeed * 57.3), sin(aSeed * 23.1)) + 1e-4);
  p += dir * (uScatter * 7. * (.3 + aSeed) + uBurst * 3.2 * (.4 + aSeed));
  p += uOffset;
  vec2 d = p.xy - uMouse.xy; float r = length(d);
  float push = smoothstep(1.5, 0., r) * uMouseOn;
  p.xy += normalize(d + 1e-4) * push * 1.1;
  p.z += push * .8;
  vec4 mv = modelViewMatrix * vec4(p, 1.);
  gl_PointSize = uPx * (1.4 + aSeed * 2.6) * (9. / -mv.z) * (1. + min(uScatter, 1.) * 1.3);
  gl_Position = projectionMatrix * mv;
  float t = smoothstep(-3., 3., aText.x + sin(uTime * .35 + aText.y) * 1.6);
  vCol = mix(uLime, uOrange, t);
  vCol = mix(vCol, uPaper, push * .7 + step(.93, aSeed) * .5);
  vA = (.6 + .4 * aSeed) * (1. - min(uScatter, 1.) * .3);
}`;
const FRAG = /* glsl */ `
varying vec3 vCol; varying float vA;
void main(){ float d = length(gl_PointCoord - .5); if (d > .5) discard; gl_FragColor = vec4(vCol, vA * smoothstep(.5, .05, d)); }`;

const SVERT = /* glsl */ `
attribute float aSeed; uniform float uTime; uniform float uPx; varying float vA;
void main(){
  vec4 mv = modelViewMatrix * vec4(position, 1.);
  gl_PointSize = uPx * (.8 + aSeed * 1.8) * (10. / -mv.z);
  vA = .25 + .55 * (.5 + .5 * sin(uTime * (.6 + aSeed * 1.8) + aSeed * 60.));
  gl_Position = projectionMatrix * mv;
}`;
const SFRAG = /* glsl */ `
varying float vA; void main(){ float d = length(gl_PointCoord - .5); if (d > .5) discard; gl_FragColor = vec4(vec3(.93, .92, .88), vA * smoothstep(.5, 0., d)); }`;

/** Sample points from the word drawn on a 2D canvas. */
async function textPoints(word: string, n: number, width: number): Promise<Float32Array> {
  try { await document.fonts?.load('800 200px Manrope'); } catch { /* fallback font */ }
  const cv = document.createElement('canvas'); cv.width = 1200; cv.height = 420;
  const g = cv.getContext('2d', { willReadFrequently: true })!;
  g.fillStyle = '#fff'; g.textAlign = 'center'; g.textBaseline = 'middle';
  g.font = '800 330px Manrope, "Arial Black", Arial, sans-serif';
  g.fillText(word, cv.width / 2, cv.height / 2 + 10);
  const data = g.getImageData(0, 0, cv.width, cv.height).data, hits: number[] = [];
  for (let y = 0; y < cv.height; y += 3) for (let x = 0; x < cv.width; x += 3) if (data[(y * cv.width + x) * 4 + 3] > 128) hits.push(x, y);
  const out = new Float32Array(n * 3), s = width / cv.width, count = hits.length / 2;
  for (let i = 0; i < n; i++) {
    const k = Math.floor(Math.random() * count);
    out[i * 3] = (hits[k * 2] - cv.width / 2 + Math.random() * 3) * s;
    out[i * 3 + 1] = -(hits[k * 2 + 1] - cv.height / 2 + Math.random() * 3) * s;
    out[i * 3 + 2] = (Math.random() - 0.5) * 0.5;
  }
  return out;
}

export async function createHero3D(host: HTMLElement, reduce: boolean, opts: { hold?: boolean } = {}): Promise<Hero3D> {
  const small = matchMedia('(max-width: 800px)').matches;
  const renderer = new WebGLRenderer({ antialias: false, alpha: true, powerPreference: 'high-performance' });
  let dpr = Math.min(devicePixelRatio, 2);
  renderer.setPixelRatio(dpr);
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.domElement.setAttribute('aria-hidden', 'true');
  host.appendChild(renderer.domElement);

  const scene = new Scene();
  const camera = new PerspectiveCamera(35, 1, 0.1, 100);
  camera.position.set(0, 0, 10);
  const rig = new Group(); scene.add(rig);

  // --- word + globe particles ---
  const N = small ? 4200 : 9000;
  const text = await textPoints('VSM', N, small ? 5.2 : 6.6);
  const sphere = new Float32Array(N * 3), seed = new Float32Array(N);
  for (let i = 0; i < N; i++) {
    const t = Math.random() * Math.PI * 2, ph = Math.acos(2 * Math.random() - 1), r = (small ? 1.9 : 2.4) * (0.96 + Math.random() * 0.08);
    sphere.set([r * Math.sin(ph) * Math.cos(t), r * Math.cos(ph), r * Math.sin(ph) * Math.sin(t)], i * 3);
    seed[i] = Math.random();
  }
  const geo = new BufferGeometry();
  geo.setAttribute('position', new Float32BufferAttribute(text, 3));
  geo.setAttribute('aText', new Float32BufferAttribute(text, 3));
  geo.setAttribute('aSphere', new Float32BufferAttribute(sphere, 3));
  geo.setAttribute('aSeed', new Float32BufferAttribute(seed, 1));
  const u = {
    uTime: { value: 0 }, uMorph: { value: 0 }, uBurst: { value: 0 }, uScatter: { value: 0 }, uPx: { value: renderer.getPixelRatio() },
    uMouse: { value: new Vector3(99, 99, 0) }, uMouseOn: { value: 0 }, uOffset: { value: new Vector3() },
    uLime: { value: new Color('#a6c77c') }, uOrange: { value: new Color('#f06b3b') }, uPaper: { value: new Color('#f2f0eb') },
  };
  const mat = new ShaderMaterial({ vertexShader: VERT, fragmentShader: FRAG, uniforms: u, transparent: true, depthWrite: false, blending: AdditiveBlending });
  const word = new Points(geo, mat);
  word.frustumCulled = false;
  rig.add(word);

  // --- star field across the whole hero ---
  const S = small ? 900 : 2200;
  const sp = new Float32Array(S * 3), ss = new Float32Array(S);
  for (let i = 0; i < S; i++) { sp.set([(Math.random() - 0.5) * 30, (Math.random() - 0.5) * 18, -8 + Math.random() * 9], i * 3); ss[i] = Math.random(); }
  const sGeo = new BufferGeometry();
  sGeo.setAttribute('position', new Float32BufferAttribute(sp, 3));
  sGeo.setAttribute('aSeed', new Float32BufferAttribute(ss, 1));
  const sU = { uTime: u.uTime, uPx: u.uPx };
  const sMat = new ShaderMaterial({ vertexShader: SVERT, fragmentShader: SFRAG, uniforms: sU, transparent: true, depthWrite: false, blending: AdditiveBlending });
  const stars = new Points(sGeo, sMat); stars.frustumCulled = false;
  scene.add(stars);

  // place the word in the right half on desktop, lower half on phones
  const visible = new Vector2();
  const resize = () => {
    const w = host.clientWidth, h = host.clientHeight;
    if (!w || !h) return;
    camera.aspect = w / h; camera.updateProjectionMatrix();
    renderer.setSize(w, h, false);
    visible.y = 2 * Math.tan(MathUtils.degToRad(camera.fov / 2)) * camera.position.z;
    visible.x = visible.y * camera.aspect;
    u.uOffset.value.set(0, 0, 0);
    if (camera.aspect > 1.1) { word.position.set(visible.x * 0.22, 0.15, 0); word.scale.setScalar(1); }
    else {
      // phones: centre the word on the empty visual block below the copy, sized to the screen width
      const box = host.closest('.hero')?.querySelector<HTMLElement>('.hero-visual');
      const hr = host.getBoundingClientRect(), br = box?.getBoundingClientRect();
      const cy = br ? (br.top + br.height / 2 - hr.top) / hr.height : 0.8;
      word.position.set(0, (0.5 - cy) * visible.y, 0);
      word.scale.setScalar((visible.x * 0.86) / (small ? 5.2 : 6.6));
    }
  };
  const ro = new ResizeObserver(resize); ro.observe(host); resize();

  // --- input: cursor pushes particles, click bursts them ---
  const ndc = new Vector2(), look = new Vector2(), ZERO = new Vector2();
  let inside = false;
  const onMove = (e: PointerEvent) => {
    const r = host.getBoundingClientRect();
    inside = e.clientY >= r.top && e.clientY <= r.bottom;
    ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    u.uMouse.value.set((ndc.x * visible.x / 2 - word.position.x) / word.scale.x, (ndc.y * visible.y / 2 - word.position.y) / word.scale.y, 0);
  };
  const burst = (e: PointerEvent) => {
    if ((e.target as HTMLElement).closest('a,button,input,select,textarea,label') || reduce) return;
    gsap.timeline().to(u.uBurst, { value: 1, duration: 0.35, ease: 'expo.out' }).to(u.uBurst, { value: 0, duration: 1.6, ease: 'elastic.out(1, .45)' });
  };
  addEventListener('pointermove', onMove, { passive: true });
  const hero = host.closest('.hero') ?? host;
  hero.addEventListener('pointerdown', burst as EventListener);

  // particles start spread across the whole hero and collect into "VSM" when gather() runs
  let intro = !reduce;
  u.uScatter.value = reduce ? 0 : 0.75;
  let gathered = false;
  const gather = () => {
    if (gathered) return; gathered = true;
    if (reduce) { u.uScatter.value = 0; intro = false; return; }
    gsap.to(u.uScatter, { value: 0, duration: 2.6, ease: 'power3.inOut', onComplete: () => { intro = false; } });
    gsap.fromTo(word.rotation, { y: -1.2 }, { y: 0, duration: 3.2, ease: 'expo.out' });
  };
  if (!opts.hold) gather();

  let visibleOnScreen = true;
  const io = new IntersectionObserver(([e]) => { visibleOnScreen = e.isIntersecting; }); io.observe(host);
  let last = performance.now();

  // adaptive quality: if the first ~2s run slow, lower resolution and particle count once
  let frames = 0, slowTime = 0, tuned = false;
  const tune = () => {
    tuned = true;
    dpr = Math.max(1, dpr * 0.65); renderer.setPixelRatio(dpr); u.uPx.value = dpr; resize();
    geo.setDrawRange(0, Math.floor(N * 0.6)); sGeo.setDrawRange(0, Math.floor(S * 0.5));
  };

  renderer.setAnimationLoop((now: number) => {
    if (!visibleOnScreen || document.hidden) { last = now; return; }
    const raw = now - last;
    const dt = Math.min(0.05, raw / 1000); last = now;
    if (!tuned && frames < 120) { frames++; if (frames > 20) slowTime += raw; if (frames === 120 && slowTime / 100 > 24) tune(); }
    if (!reduce) u.uTime.value += dt;
    u.uMouseOn.value += ((inside && !reduce ? 1 : 0) - u.uMouseOn.value) * Math.min(1, dt * 4);
    look.lerp(inside ? ndc : ZERO, Math.min(1, dt * 1.5));
    if (!reduce) {
      if (!intro) word.rotation.y = Math.sin(u.uTime.value * 0.25) * 0.2 + look.x * 0.25;
      word.rotation.x = -look.y * 0.15;
      stars.rotation.y = look.x * 0.04 + u.uTime.value * 0.004; stars.rotation.x = -look.y * 0.03;
    }
    renderer.render(scene, camera);
  });

  return {
    gather,
    setScroll(p) {
      // on tall phone heroes the word sits low, so only scatter once it's actually leaving
      const q = camera.aspect > 1.1 ? p : Math.max(0, (p - 0.55) / 0.45);
      if (!intro && !reduce) u.uScatter.value = Math.min(1.6, q * 1.6);
      rig.position.y = q * 1.5;
    },
    dispose() {
      renderer.setAnimationLoop(null); ro.disconnect(); io.disconnect(); gsap.killTweensOf(u.uScatter);
      removeEventListener('pointermove', onMove); hero.removeEventListener('pointerdown', burst as EventListener);
      geo.dispose(); mat.dispose(); sGeo.dispose(); sMat.dispose(); renderer.dispose(); renderer.domElement.remove();
    },
  };
}
