import * as THREE from "three";

export function mountHeroScene(host: HTMLElement) {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.7));
  renderer.setSize(host.clientWidth, host.clientHeight);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  host.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(36, host.clientWidth / host.clientHeight, 0.1, 100);
  camera.position.set(0, 0, 8);

  const group = new THREE.Group();
  scene.add(group);

  const geometry = new THREE.TorusKnotGeometry(1.25, 0.36, 220, 32, 2, 5);
  const material = new THREE.ShaderMaterial({
    uniforms: { uTime: { value: 0 }, uPointer: { value: new THREE.Vector2(0, 0) } },
    vertexShader: `
      uniform float uTime;
      uniform vec2 uPointer;
      varying vec3 vNormal;
      varying vec3 vPosition;
      void main() {
        vNormal = normalize(normalMatrix * normal);
        vec3 p = position;
        p += normal * (0.035 * sin(position.y * 3.0 + uTime * 0.55));
        p += normal * (0.018 * uPointer.x);
        vPosition = p;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
      }
    `,
    fragmentShader: `
      uniform float uTime;
      varying vec3 vNormal;
      varying vec3 vPosition;
      void main() {
        vec3 n = normalize(vNormal);
        float fresnel = pow(1.0 - abs(dot(n, vec3(0.0, 0.0, 1.0))), 2.0);
        float bands = 0.5 + 0.5 * sin(vPosition.y * 5.0 + uTime * 0.35);
        vec3 base = mix(vec3(0.17, 0.18, 0.17), vec3(0.72, 0.73, 0.68), bands * 0.55);
        vec3 color = base + fresnel * vec3(0.65, 0.32, 0.12);
        gl_FragColor = vec4(color, 0.92);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }
    `
  });

  const knot = new THREE.Mesh(geometry, material);
  group.add(knot);

  const ringGeometry = new THREE.TorusGeometry(2.05, 0.008, 8, 180);
  const ringMaterial = new THREE.MeshBasicMaterial({ color: 0x77766f, transparent: true, opacity: 0.35 });
  const ring = new THREE.Mesh(ringGeometry, ringMaterial);
  ring.rotation.x = 0.75;
  group.add(ring);

  const ambient = new THREE.AmbientLight(0xffffff, 1.2);
  scene.add(ambient);
  const point = new THREE.PointLight(0xff8b50, 34, 18);
  point.position.set(3, 2, 4);
  scene.add(point);

  const pointer = new THREE.Vector2(0, 0);
  const onPointer = (event: PointerEvent) => {
    const rect = host.getBoundingClientRect();
    pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -(((event.clientY - rect.top) / rect.height) * 2 - 1);
  };
  host.addEventListener("pointermove", onPointer);

  let frame = 0;
  const clock = new THREE.Clock();
  const render = () => {
    frame = requestAnimationFrame(render);
    const t = clock.getElapsedTime();
    material.uniforms.uTime.value = t;
    material.uniforms.uPointer.value.lerp(pointer, 0.025);
    if (!reduced) {
      group.rotation.y = Math.sin(t * 0.18) * 0.2 + pointer.x * 0.12;
      group.rotation.x = Math.cos(t * 0.16) * 0.12 + pointer.y * 0.08;
      knot.rotation.z = t * 0.055;
    }
    renderer.render(scene, camera);
  };
  render();

  const resize = () => {
    const w = host.clientWidth;
    const h = host.clientHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  };
  const observer = new ResizeObserver(resize);
  observer.observe(host);

  return () => {
    cancelAnimationFrame(frame);
    observer.disconnect();
    host.removeEventListener("pointermove", onPointer);
    geometry.dispose();
    material.dispose();
    ringGeometry.dispose();
    ringMaterial.dispose();
    renderer.dispose();
    renderer.domElement.remove();
  };
}
