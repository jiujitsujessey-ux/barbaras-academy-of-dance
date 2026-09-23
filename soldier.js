/* Spinnable music-box nutcracker soldier — companion to ballerina.js.
   Usage: const dispose = await mount(containerEl) — appends a transparent
   WebGL canvas, drag to spin (with inertia), gentle auto-rotate. */
import * as THREE from 'https://unpkg.com/three@0.184.0/build/three.module.js';

function buildSoldier() {
  const porcelain = new THREE.MeshStandardMaterial({ name: 'porcelain', color: 0xF4E9DE, roughness: 0.45, metalness: 0.02 });
  const navy = new THREE.MeshStandardMaterial({ name: 'navy', color: 0x1D2647, roughness: 0.45, metalness: 0.15 });
  const crimson = new THREE.MeshStandardMaterial({ name: 'crimson', color: 0x8E2F2C, roughness: 0.5, metalness: 0.05 });
  const gold = new THREE.MeshStandardMaterial({ name: 'gold', color: 0xC9A96A, roughness: 0.35, metalness: 0.7 });
  const white = new THREE.MeshStandardMaterial({ name: 'white', color: 0xF7F4EC, roughness: 0.6, metalness: 0.0 });
  const black = new THREE.MeshStandardMaterial({ name: 'black', color: 0x23201C, roughness: 0.4, metalness: 0.1 });

  const g = new THREE.Group();
  g.name = 'nutcracker';

  const base = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.58, 0.1, 48), crimson);
  base.name = 'base'; base.position.y = 0.05; g.add(base);
  const rim = new THREE.Mesh(new THREE.TorusGeometry(0.54, 0.016, 12, 64), gold);
  rim.name = 'rim'; rim.rotation.x = Math.PI / 2; rim.position.y = 0.1; g.add(rim);

  // boots + trousers
  for (const s of [-1, 1]) {
    const sd = s < 0 ? 'L' : 'R';
    const boot = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.1, 0.2, 20), black);
    boot.name = 'boot' + sd; boot.position.set(s * 0.15, 0.2, 0); g.add(boot);
    const toe = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.07, 0.14), black);
    toe.name = 'toe' + sd; toe.position.set(s * 0.15, 0.135, 0.055); g.add(toe);
    const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.095, 0.09, 0.32, 20), crimson);
    leg.name = 'leg' + sd; leg.position.set(s * 0.15, 0.46, 0); g.add(leg);
  }

  // jacket — slightly flared, with tails
  const jacket = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.27, 0.52, 28), navy);
  jacket.name = 'jacket'; jacket.position.y = 0.88; g.add(jacket);
  const belt = new THREE.Mesh(new THREE.CylinderGeometry(0.275, 0.278, 0.07, 28), black);
  belt.name = 'belt'; belt.position.y = 0.66; g.add(belt);
  const buckle = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.055, 0.02), gold);
  buckle.name = 'buckle'; buckle.position.set(0, 0.66, 0.272); g.add(buckle);
  // chest panel + double button rows + braid
  const panel = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.42, 0.025), crimson);
  panel.name = 'chestPanel'; panel.position.set(0, 0.92, 0.235); g.add(panel);
  for (let i = 0; i < 3; i++) {
    for (const s of [-1, 1]) {
      const btn = new THREE.Mesh(new THREE.SphereGeometry(0.02, 12, 10), gold);
      btn.name = 'button' + i + (s < 0 ? 'L' : 'R');
      btn.position.set(s * 0.055, 0.78 + i * 0.13, 0.25); g.add(btn);
    }
    const braid = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.1, 8), gold);
    braid.name = 'braid' + i; braid.rotation.z = Math.PI / 2; braid.position.set(0, 0.78 + i * 0.13, 0.249); g.add(braid);
  }

  // arms with epaulettes, cuffs, mitten hands
  for (const s of [-1, 1]) {
    const sd = s < 0 ? 'L' : 'R';
    const ep = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.075, 0.04, 18), gold);
    ep.name = 'epaulette' + sd; ep.position.set(s * 0.235, 1.13, 0); g.add(ep);
    const fringe = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.06, 0.05, 18, 1, true), gold);
    fringe.name = 'fringe' + sd; fringe.position.set(s * 0.235, 1.09, 0); g.add(fringe);
    const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.055, 0.4, 16), navy);
    arm.name = 'arm' + sd; arm.position.set(s * 0.27, 0.92, 0); arm.rotation.z = s * 0.1; g.add(arm);
    const cuff = new THREE.Mesh(new THREE.CylinderGeometry(0.058, 0.062, 0.06, 16), crimson);
    cuff.name = 'cuff' + sd; cuff.position.set(s * 0.29, 0.72, 0); cuff.rotation.z = s * 0.1; g.add(cuff);
    const hand = new THREE.Mesh(new THREE.SphereGeometry(0.05, 14, 12), white);
    hand.name = 'hand' + sd; hand.position.set(s * 0.297, 0.66, 0); g.add(hand);
  }

  // head — classic cylinder
  const head = new THREE.Mesh(new THREE.CylinderGeometry(0.135, 0.135, 0.34, 28), porcelain);
  head.name = 'head'; head.position.y = 1.32; g.add(head);
  // jaw — the nut-cracking chin block
  const jaw = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.14, 0.06), porcelain);
  jaw.name = 'jaw'; jaw.position.set(0, 1.2, 0.115); g.add(jaw);
  const mouth = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.018, 0.012), black);
  mouth.name = 'mouth'; mouth.position.set(0, 1.265, 0.146); g.add(mouth);
  // teeth
  const teeth = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.03, 0.01), white);
  teeth.name = 'teeth'; teeth.position.set(0, 1.243, 0.146); g.add(teeth);
  // eyes
  for (const s of [-1, 1]) {
    const eye = new THREE.Mesh(new THREE.SphereGeometry(0.02, 12, 10), black);
    eye.name = 'eye' + (s < 0 ? 'L' : 'R'); eye.position.set(s * 0.055, 1.4, 0.125); g.add(eye);
    const brow = new THREE.Mesh(new THREE.BoxGeometry(0.055, 0.014, 0.012), black);
    brow.name = 'brow' + (s < 0 ? 'L' : 'R'); brow.position.set(s * 0.055, 1.44, 0.128); g.add(brow);
    const cheek = new THREE.Mesh(new THREE.SphereGeometry(0.028, 12, 10), crimson);
    cheek.name = 'cheek' + (s < 0 ? 'L' : 'R'); cheek.position.set(s * 0.085, 1.33, 0.105); g.add(cheek);
    // white hair — clustered small curls tucked behind the head sides
    const curls = [
      [0.125, 1.40, -0.05, 0.038],
      [0.145, 1.34, -0.075, 0.042],
      [0.135, 1.27, -0.09, 0.038],
      [0.115, 1.21, -0.095, 0.034],
      [0.15, 1.31, -0.02, 0.03]
    ];
    curls.forEach(([x, y, z, r], i) => {
      const curl = new THREE.Mesh(new THREE.SphereGeometry(r, 12, 10), white);
      curl.name = 'hairCurl' + i + (s < 0 ? 'L' : 'R');
      curl.position.set(s * x, y, z); curl.scale.set(1, 0.85, 1); g.add(curl);
    });
  }
  // nose
  const nose = new THREE.Mesh(new THREE.SphereGeometry(0.028, 12, 10), crimson);
  nose.name = 'nose'; nose.position.set(0, 1.35, 0.14); g.add(nose);
  // moustache
  const stache = new THREE.Mesh(new THREE.TorusGeometry(0.055, 0.016, 10, 24, Math.PI), white);
  stache.name = 'moustache'; stache.rotation.z = Math.PI; stache.position.set(0, 1.3, 0.14); g.add(stache);
  // beard under jaw
  const beard = new THREE.Mesh(new THREE.SphereGeometry(0.08, 16, 12, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2.6), white);
  beard.name = 'beard'; beard.position.set(0, 1.17, 0.06); g.add(beard);

  // tall crown hat
  const hat = new THREE.Mesh(new THREE.CylinderGeometry(0.125, 0.14, 0.36, 26), black);
  hat.name = 'hat'; hat.position.y = 1.67; g.add(hat);
  const hatBand = new THREE.Mesh(new THREE.CylinderGeometry(0.142, 0.145, 0.055, 26), gold);
  hatBand.name = 'hatBand'; hatBand.position.y = 1.52; g.add(hatBand);
  const hatTop = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.125, 0.03, 26), gold);
  hatTop.name = 'hatTop'; hatTop.position.y = 1.86; g.add(hatTop);
  const badge = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.012, 16), gold);
  badge.name = 'hatBadge'; badge.rotation.x = Math.PI / 2; badge.position.set(0, 1.68, 0.135); g.add(badge);
  const plumeBase = new THREE.Mesh(new THREE.SphereGeometry(0.024, 12, 10), gold);
  plumeBase.name = 'plumeBase'; plumeBase.position.set(0, 1.87, 0.1); g.add(plumeBase);
  const plume = new THREE.Mesh(new THREE.ConeGeometry(0.04, 0.22, 12), crimson);
  plume.name = 'plume'; plume.position.set(0, 1.97, 0.115); plume.rotation.x = 0.18; g.add(plume);

  // sword at his side
  const scabbard = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.008, 0.4, 10), gold);
  scabbard.name = 'scabbard'; scabbard.position.set(0.31, 0.45, 0.05); scabbard.rotation.z = -0.12; g.add(scabbard);
  const hilt = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.014, 0.014), gold);
  hilt.name = 'hilt'; hilt.position.set(0.285, 0.64, 0.05); g.add(hilt);

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
  camera.position.set(0, 1.15, 4.1);
  camera.lookAt(0, 0.98, 0);

  scene.add(new THREE.AmbientLight(0xfff6ec, 0.9));
  const key = new THREE.DirectionalLight(0xffffff, 1.6);
  key.position.set(2, 4, 3); scene.add(key);
  const fill = new THREE.DirectionalLight(0xd9b8b0, 0.5);
  fill.position.set(-3, 1.5, -2); scene.add(fill);

  const soldier = buildSoldier();
  scene.add(soldier);

  let vel = 0.008, dragging = false, lastX = 0, raf = 0;
  const onDown = e => { dragging = true; lastX = e.clientX; canvas.style.cursor = 'grabbing'; canvas.setPointerCapture(e.pointerId); };
  const onMove = e => { if (!dragging) return; const dx = e.clientX - lastX; lastX = e.clientX; soldier.rotation.y += dx * 0.012; vel = dx * 0.012; };
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
      soldier.rotation.y += vel;
      vel += (0.008 - vel) * 0.02;
    }
    renderer.render(scene, camera);
  };
  loop();

  return () => {
    cancelAnimationFrame(raf); ro.disconnect();
    canvas.remove(); renderer.dispose();
  };
}
