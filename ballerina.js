/* Spinnable music-box ballerina for the portal sign-in card.
   Usage: const dispose = await mount(containerEl) — appends a transparent
   WebGL canvas, drag to spin (with inertia), gentle auto-rotate. */
import * as THREE from 'https://unpkg.com/three@0.184.0/build/three.module.js';

function tube(curvePts, r, mat, name, segs = 48) {
  const curve = new THREE.CatmullRomCurve3(curvePts.map(p => new THREE.Vector3(...p)));
  const m = new THREE.Mesh(new THREE.TubeGeometry(curve, segs, r, 12, false), mat);
  m.name = name;
  return m;
}

function buildDancer() {
  const porcelain = new THREE.MeshStandardMaterial({ name: 'porcelain', color: 0xF4E9DE, roughness: 0.45, metalness: 0.02 });
  const blush = new THREE.MeshStandardMaterial({ name: 'blush', color: 0xD9B8B0, roughness: 0.7, metalness: 0.0, side: THREE.DoubleSide });
  const hair = new THREE.MeshStandardMaterial({ name: 'hair', color: 0x4A3A31, roughness: 0.5, metalness: 0.05 });
  const navy = new THREE.MeshStandardMaterial({ name: 'navy', color: 0x1D2647, roughness: 0.45, metalness: 0.15 });
  const gold = new THREE.MeshStandardMaterial({ name: 'gold', color: 0xC9A96A, roughness: 0.35, metalness: 0.7 });

  const g = new THREE.Group();
  g.name = 'ballerina';

  const base = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.58, 0.1, 48), navy);
  base.name = 'base'; base.position.y = 0.05; g.add(base);
  const rim = new THREE.Mesh(new THREE.TorusGeometry(0.54, 0.016, 12, 64), gold);
  rim.name = 'rim'; rim.rotation.x = Math.PI / 2; rim.position.y = 0.1; g.add(rim);

  // standing leg — en pointe
  g.add(tube([[0.02, 0.1, 0], [0.015, 0.45, 0.01], [0, 0.75, 0.02], [0, 0.98, 0]], 0.038, porcelain, 'legStanding'));
  const pointe = new THREE.Mesh(new THREE.ConeGeometry(0.045, 0.12, 16), blush);
  pointe.name = 'pointeShoe'; pointe.rotation.x = Math.PI; pointe.position.set(0.02, 0.13, 0); g.add(pointe);

  // arabesque leg — raised behind
  g.add(tube([[0.02, 0.98, -0.02], [0.06, 1.02, -0.28], [0.08, 1.08, -0.55], [0.08, 1.16, -0.78]], 0.035, porcelain, 'legArabesque'));
  const pointe2 = new THREE.Mesh(new THREE.ConeGeometry(0.04, 0.12, 16), blush);
  pointe2.name = 'pointeShoe2'; pointe2.rotation.x = -Math.PI / 2.3; pointe2.position.set(0.08, 1.18, -0.83); g.add(pointe2);

  // tutu — flared lathe disc
  const tutuPts = [];
  for (let i = 0; i <= 10; i++) {
    const t = i / 10;
    tutuPts.push(new THREE.Vector2(0.07 + t * 0.44, 1.06 - t * 0.1 + Math.sin(t * Math.PI) * 0.035));
  }
  const tutu = new THREE.Mesh(new THREE.LatheGeometry(tutuPts, 64), blush);
  tutu.name = 'tutu'; tutu.rotation.z = 0.05; tutu.rotation.x = -0.04; g.add(tutu);
  // second, shorter tulle layer above
  const tutu2Pts = [];
  for (let i = 0; i <= 8; i++) {
    const t = i / 8;
    tutu2Pts.push(new THREE.Vector2(0.07 + t * 0.3, 1.09 - t * 0.06 + Math.sin(t * Math.PI) * 0.03));
  }
  const tutu2 = new THREE.Mesh(new THREE.LatheGeometry(tutu2Pts, 64), blush);
  tutu2.name = 'tutuTop'; tutu2.rotation.z = -0.04; g.add(tutu2);
  const waistband = new THREE.Mesh(new THREE.TorusGeometry(0.092, 0.012, 10, 40), gold);
  waistband.name = 'waistband'; waistband.rotation.x = Math.PI / 2; waistband.position.y = 1.1; g.add(waistband);

  // torso / bodice
  const torsoPts = [
    new THREE.Vector2(0.085, 1.02), new THREE.Vector2(0.095, 1.1),
    new THREE.Vector2(0.115, 1.2), new THREE.Vector2(0.13, 1.3),
    new THREE.Vector2(0.115, 1.38), new THREE.Vector2(0.06, 1.44)
  ];
  const torso = new THREE.Mesh(new THREE.LatheGeometry(torsoPts, 32), blush);
  torso.name = 'bodice'; g.add(torso);

  // arms — fifth position en haut (crown overhead)
  g.add(tube([[0.12, 1.38, 0], [0.26, 1.48, 0.05], [0.22, 1.66, 0.08], [0.06, 1.74, 0.08]], 0.022, porcelain, 'armR'));
  g.add(tube([[-0.12, 1.38, 0], [-0.26, 1.48, 0.05], [-0.22, 1.66, 0.08], [-0.06, 1.74, 0.08]], 0.022, porcelain, 'armL'));
  const handR = new THREE.Mesh(new THREE.SphereGeometry(0.026, 16, 12), porcelain);
  handR.name = 'handR'; handR.position.set(0.055, 1.745, 0.08); g.add(handR);
  const handL = new THREE.Mesh(new THREE.SphereGeometry(0.026, 16, 12), porcelain);
  handL.name = 'handL'; handL.position.set(-0.055, 1.745, 0.08); g.add(handL);

  // neck + head + bun
  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.032, 0.04, 0.1, 16), porcelain);
  neck.name = 'neck'; neck.position.y = 1.47; g.add(neck);
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.085, 32, 24), porcelain);
  head.name = 'head'; head.position.y = 1.58; g.add(head);
  const cap = new THREE.Mesh(new THREE.SphereGeometry(0.088, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2.1), hair);
  cap.name = 'hairCap'; cap.position.y = 1.585; cap.rotation.x = -0.35; g.add(cap);
  const bun = new THREE.Mesh(new THREE.SphereGeometry(0.042, 20, 16), hair);
  bun.name = 'bun'; bun.position.set(0, 1.66, -0.055); g.add(bun);
  const tiara = new THREE.Mesh(new THREE.TorusGeometry(0.062, 0.008, 8, 40), gold);
  tiara.name = 'tiara'; tiara.rotation.x = Math.PI / 2 - 0.5; tiara.position.set(0, 1.645, 0.015); g.add(tiara);

  return g;
}

export function mount(el) {
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
  } catch (e) { return null; }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  const canvas = renderer.domElement;
  canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;display:block;cursor:grab;touch-action:pan-y';
  el.appendChild(canvas);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 20);
  camera.position.set(0, 1.15, 3.4);
  camera.lookAt(0, 0.9, 0);

  scene.add(new THREE.AmbientLight(0xfff6ec, 0.9));
  const key = new THREE.DirectionalLight(0xffffff, 1.6);
  key.position.set(2, 4, 3); scene.add(key);
  const fill = new THREE.DirectionalLight(0xd9b8b0, 0.5);
  fill.position.set(-3, 1.5, -2); scene.add(fill);

  const dancer = buildDancer();
  scene.add(dancer);

  let vel = 0.008, dragging = false, lastX = 0, raf = 0;
  const onDown = e => { dragging = true; lastX = e.clientX; canvas.style.cursor = 'grabbing'; canvas.setPointerCapture(e.pointerId); };
  const onMove = e => { if (!dragging) return; const dx = e.clientX - lastX; lastX = e.clientX; dancer.rotation.y += dx * 0.012; vel = dx * 0.012; };
  const onUp = e => { dragging = false; canvas.style.cursor = 'grab'; try { canvas.releasePointerCapture(e.pointerId); } catch (err) {} };
  canvas.addEventListener('pointerdown', onDown);
  canvas.addEventListener('pointermove', onMove);
  canvas.addEventListener('pointerup', onUp);
  canvas.addEventListener('pointercancel', onUp);

  const size = () => {
    const r = el.getBoundingClientRect();
    if (!r.width || !r.height) return;
    renderer.setSize(r.width, r.height, false);
    camera.aspect = r.width / r.height;
    camera.updateProjectionMatrix();
  };
  const ro = new ResizeObserver(size); ro.observe(el); size();

  const loop = () => {
    raf = requestAnimationFrame(loop);
    if (!dragging) {
      dancer.rotation.y += vel;
      vel += (0.008 - vel) * 0.02; // ease back to gentle auto-spin
    }
    renderer.render(scene, camera);
  };
  loop();

  return () => {
    cancelAnimationFrame(raf); ro.disconnect();
    canvas.remove(); renderer.dispose();
  };
}
