// Nool Khadi Try-On: a procedural 3D fitting room built with Three.js.
// Every body and garment is generated in code, so there are no model files to host.

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

/* ------------------------------------------------------------------ */
/* Data                                                                */
/* ------------------------------------------------------------------ */

const PALETTE = [
  { id: 'offwhite', name: 'Kerala off-white', hex: '#efe6d2' },
  { id: 'kasavu',   name: 'Kasavu gold',      hex: '#c9a44c' },
  { id: 'indigo',   name: 'Indigo',           hex: '#2e3f6e' },
  { id: 'turmeric', name: 'Turmeric',         hex: '#d9a21b' },
  { id: 'madder',   name: 'Madder red',       hex: '#a23b2c' },
  { id: 'jackfruit',name: 'Jackfruit wood',   hex: '#b9772b' },
  { id: 'charcoal', name: 'Charcoal',         hex: '#3a3a3a' },
  { id: 'leaf',     name: 'Banana leaf',      hex: '#5c7a3a' },
  { id: 'rust',     name: 'Laterite rust',    hex: '#b25a2e' },
  { id: 'sky',      name: 'Monsoon sky',      hex: '#8fb3cf' },
];

const SKINS = ['#f1c9a5', '#d9a27a', '#b07850', '#7a4e33'];

// Each outfit: id, name, sub (short description), price, accent label, default colours.
const OUTFITS = {
  male: [
    { id: 'kurta',   name: 'Kurta & pyjama',     sub: 'Classic, knee length',    price: 1799, accentLabel: 'Pyjama',   main: 'offwhite', accent: 'indigo' },
    { id: 'nehru',   name: 'Nehru jacket set',   sub: 'Kurta + bandhgala vest', price: 3499, accentLabel: 'Jacket',   main: 'offwhite', accent: 'madder' },
    { id: 'shirt',   name: 'Short kurta-shirt',  sub: 'Campus everyday',        price: 1299, accentLabel: 'Trousers', main: 'sky',      accent: 'charcoal' },
    { id: 'tee',     name: 'Oversized tee co-ord', sub: 'Jersey-weave khadi',   price: 1599, accentLabel: 'Joggers',  main: 'leaf',     accent: 'leaf' },
    { id: 'mundu',   name: 'Mundu & shirt',      sub: 'Kasavu border',          price: 1999, accentLabel: 'Mundu',    main: 'turmeric', accent: 'offwhite' },
    { id: 'kasavuK', name: 'Kasavu kurta',       sub: 'Onam & college day',     price: 2499, accentLabel: 'Pyjama',   main: 'offwhite', accent: 'offwhite' },
  ],
  female: [
    { id: 'palazzo', name: 'Kurta & palazzo',    sub: 'With dupatta',           price: 2299, accentLabel: 'Palazzo & dupatta', main: 'madder', accent: 'offwhite' },
    { id: 'kasavuSet', name: 'Kasavu crop set',  sub: 'Top + long skirt',       price: 2999, accentLabel: 'Skirt',    main: 'offwhite', accent: 'offwhite' },
    { id: 'saree',   name: 'Pre-draped saree',   sub: 'Kasavu-edged pallu',     price: 4499, accentLabel: 'Blouse',   main: 'offwhite', accent: 'madder' },
    { id: 'coord',   name: 'Co-ord set',         sub: 'Boxy shirt + trousers',  price: 1899, accentLabel: 'Trousers', main: 'indigo',   accent: 'indigo' },
    { id: 'dress',   name: 'A-line dress',       sub: 'Knee length, flutter sleeve', price: 1699, accentLabel: 'Belt', main: 'turmeric', accent: 'jackfruit' },
    { id: 'layer',   name: 'Jacket over kurti',  sub: 'Open-front long jacket', price: 3299, accentLabel: 'Jacket',   main: 'sky',      accent: 'rust' },
  ],
};

const WEAVERS = [
  'Sindhu & Latha, Balaramapuram',
  'Ramani, Payyannur khadi unit',
  'Shobha & Geetha, Kunnukara',
  'Mini, Nemom handloom society',
  'Ambika & Usha, Kottayam unit',
  'Valsala, Kanjirampara',
];

/* ------------------------------------------------------------------ */
/* Body measurements                                                   */
/* ------------------------------------------------------------------ */

const BODY = {
  male: {
    torso: [[0, 0.84], [0.12, 0.85], [0.165, 0.9], [0.17, 0.98], [0.152, 1.08], [0.165, 1.18], [0.185, 1.28], [0.195, 1.37], [0.175, 1.43], [0.1, 1.48], [0, 1.5]],
    sz: 0.62,                 // depth squash: torso is wider than it is deep
    waistY: 1.02,
    shoulder: { x: 0.205, y: 1.41 },
    arm: { len: 0.6, r: 0.043, angle: 0.17 },
    leg: { x: 0.088, top: 0.93, bottom: 0.07, rTop: 0.08, rBottom: 0.048 },
    neck: { r: 0.048, y0: 1.46, y1: 1.58 },
    head: { y: 1.68, r: 0.105 },
    hairColor: '#1f1a17',
  },
  female: {
    torso: [[0, 0.82], [0.13, 0.83], [0.185, 0.88], [0.19, 0.95], [0.15, 1.05], [0.135, 1.1], [0.158, 1.19], [0.17, 1.24], [0.158, 1.3], [0.163, 1.35], [0.14, 1.39], [0.075, 1.43], [0, 1.44]],
    sz: 0.66,
    waistY: 1.07,
    shoulder: { x: 0.175, y: 1.355 },
    arm: { len: 0.55, r: 0.036, angle: 0.15 },
    leg: { x: 0.085, top: 0.9, bottom: 0.07, rTop: 0.078, rBottom: 0.044 },
    neck: { r: 0.04, y0: 1.41, y1: 1.51 },
    head: { y: 1.6, r: 0.098 },
    hairColor: '#1c1512',
  },
};

// Linear interpolation of a [r, y] profile at height y.
function rAt(profile, y) {
  if (y <= profile[0][1]) return profile[0][0];
  for (let i = 1; i < profile.length; i++) {
    const [r1, y1] = profile[i];
    const [r0, y0] = profile[i - 1];
    if (y <= y1) return r0 + (r1 - r0) * ((y - y0) / (y1 - y0));
  }
  return profile[profile.length - 1][0];
}
function hipRadius(b) {
  return Math.max(...b.torso.filter(p => p[1] < 1.0).map(p => p[0]));
}

/* ------------------------------------------------------------------ */
/* Khadi fabric texture (procedural, handspun slub look)              */
/* ------------------------------------------------------------------ */

function makeKhadiTexture() {
  const size = 512;
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const g = c.getContext('2d');
  g.fillStyle = '#e9e9e9';
  g.fillRect(0, 0, size, size);
  let seed = 7;
  const rand = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
  // warp (vertical) and weft (horizontal) threads with uneven thickness = slubs
  for (let pass = 0; pass < 2; pass++) {
    for (let i = 0; i < size; i += 2) {
      const shade = 200 + Math.floor(rand() * 55);
      g.strokeStyle = `rgba(${shade},${shade},${shade},${0.35 + rand() * 0.4})`;
      g.lineWidth = 0.6 + rand() * 1.2;
      g.beginPath();
      if (pass === 0) { g.moveTo(i + rand(), 0); g.lineTo(i + rand(), size); }
      else { g.moveTo(0, i + rand()); g.lineTo(size, i + rand()); }
      g.stroke();
    }
  }
  // slubs: short thick bumps typical of hand-spun yarn
  for (let i = 0; i < 260; i++) {
    const x = rand() * size, y = rand() * size, len = 6 + rand() * 22;
    const shade = 225 + Math.floor(rand() * 30);
    g.strokeStyle = `rgba(${shade},${shade},${shade},0.8)`;
    g.lineWidth = 1.5 + rand() * 2;
    g.beginPath();
    if (rand() > 0.5) { g.moveTo(x, y); g.lineTo(x + len, y + rand()); }
    else { g.moveTo(x, y); g.lineTo(x + rand(), y + len); }
    g.stroke();
  }
  // a few darker neps
  for (let i = 0; i < 120; i++) {
    g.fillStyle = `rgba(150,140,130,${0.15 + rand() * 0.25})`;
    g.fillRect(rand() * size, rand() * size, 1.5, 1.5);
  }
  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(9, 7);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

/* ------------------------------------------------------------------ */
/* Scene setup                                                         */
/* ------------------------------------------------------------------ */

const container = document.getElementById('viewport');
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.05;
container.appendChild(renderer.domElement);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 50);
const HOME = { pos: new THREE.Vector3(0.4, 1.25, 4.1), target: new THREE.Vector3(0, 0.92, 0) };
camera.position.copy(HOME.pos);

const controls = new OrbitControls(camera, renderer.domElement);
controls.target.copy(HOME.target);
controls.enableDamping = true;
controls.dampingFactor = 0.08;
controls.minDistance = 1.4;
controls.maxDistance = 6;
controls.minPolarAngle = 0.35;
controls.maxPolarAngle = 1.75;
controls.enablePan = false;
controls.autoRotate = true;
controls.autoRotateSpeed = 1.2;

scene.add(new THREE.HemisphereLight(0xfff4e2, 0x8a7356, 1.1));
const key = new THREE.DirectionalLight(0xfff0dc, 2.2);
key.position.set(2.2, 4, 3);
key.castShadow = true;
key.shadow.mapSize.set(1024, 1024);
key.shadow.camera.left = -1.2; key.shadow.camera.right = 1.2;
key.shadow.camera.top = 2.2; key.shadow.camera.bottom = -0.3;
key.shadow.bias = -0.0008;
key.shadow.radius = 4;
scene.add(key);
const rim = new THREE.DirectionalLight(0xffe2b8, 0.9);
rim.position.set(-3, 2.5, -2.5);
scene.add(rim);

// Floor: a soft circular plinth that only catches shadow
const plinth = new THREE.Mesh(
  new THREE.CircleGeometry(0.85, 64),
  new THREE.MeshStandardMaterial({ color: 0xe6d8bc, roughness: 1 })
);
plinth.rotation.x = -Math.PI / 2;
plinth.receiveShadow = true;
scene.add(plinth);
const ring = new THREE.Mesh(
  new THREE.RingGeometry(0.85, 0.88, 64),
  new THREE.MeshStandardMaterial({ color: 0xb88a2e, roughness: 0.5, metalness: 0.4 })
);
ring.rotation.x = -Math.PI / 2;
ring.position.y = 0.001;
scene.add(ring);

const khadiTex = makeKhadiTexture();

/* ------------------------------------------------------------------ */
/* Materials                                                           */
/* ------------------------------------------------------------------ */

function fabric(hex) {
  return new THREE.MeshStandardMaterial({
    color: new THREE.Color(hex),
    map: khadiTex,
    bumpMap: khadiTex,
    bumpScale: 0.9,
    roughness: 0.93,
    metalness: 0,
    side: THREE.DoubleSide,
  });
}
const goldMat = () => new THREE.MeshStandardMaterial({ color: 0xd4a73a, metalness: 0.75, roughness: 0.32, side: THREE.DoubleSide });
const buttonMat = () => new THREE.MeshStandardMaterial({ color: 0x5a3b22, roughness: 0.5 });

/* ------------------------------------------------------------------ */
/* Geometry helpers                                                    */
/* ------------------------------------------------------------------ */

function shadowed(mesh) { mesh.castShadow = true; mesh.receiveShadow = true; return mesh; }

// Revolve a [r, y] profile into a squashed tube (garments and torso).
function lathe(profile, sz, mat, opts = {}) {
  const pts = profile.map(([r, y]) => new THREE.Vector2(Math.max(r, 0.0001), y));
  const geo = new THREE.LatheGeometry(pts, 64, opts.phiStart ?? 0, opts.phiLength ?? Math.PI * 2);
  const m = shadowed(new THREE.Mesh(geo, mat));
  m.scale.z = sz;
  return m;
}

// Garment profile that follows the body with ease, flaring below the hips.
function garmentProfile(b, bottomY, topY, ease, flare = 0, closeAtNeck = true) {
  const tMin = b.torso[0][1] + 0.02;
  const hipR = hipRadius(b);
  const pts = [];
  const steps = 26;
  for (let i = 0; i <= steps; i++) {
    const y = bottomY + (topY - bottomY) * (i / steps);
    let r;
    if (y < 0.95) {
      // below the hip line: cover both legs, then flare out towards the hem
      const base = Math.max(y > tMin ? rAt(b.torso, y) : 0, hipR);
      r = base + ease + flare * Math.max(0, 0.95 - y);
    } else {
      r = rAt(b.torso, y) + ease;
    }
    pts.push([r, y]);
  }
  if (closeAtNeck) pts.push([b.neck.r + ease * 0.6, b.neck.y0 + 0.025]);
  return pts;
}

// A horizontal band (kasavu border, belt) wrapped round a profile at height y.
function band(profile, y, h, sz, mat, extra = 0.004) {
  const r = rAt(profile, y) + extra;
  const geo = new THREE.CylinderGeometry(r, r, h, 64, 1, true);
  const m = shadowed(new THREE.Mesh(geo, mat));
  m.position.y = y;
  m.scale.z = sz;
  return m;
}

// Arm pivot frame: origin at shoulder, arm hangs down local -y.
function armFrame(b, side) {
  const g = new THREE.Group();
  g.position.set(side * b.shoulder.x, b.shoulder.y, 0);
  g.rotation.z = side * b.arm.angle;
  return g;
}

function sleeve(b, side, frac, mat, widen = 1.55, flare = 1.1, cuffMat = null) {
  const g = armFrame(b, side);
  const len = b.arm.len * frac;
  const rTop = b.arm.r * widen;
  const tube = shadowed(new THREE.Mesh(new THREE.CylinderGeometry(rTop, rTop * flare, len, 32, 1, true), mat));
  tube.position.y = -len / 2 + 0.01;
  g.add(tube);
  const cap = shadowed(new THREE.Mesh(new THREE.SphereGeometry(rTop * 1.02, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2), mat));
  cap.position.y = -0.008;
  cap.scale.y = 0.7;
  g.add(cap);
  if (cuffMat) {
    const cuff = shadowed(new THREE.Mesh(new THREE.CylinderGeometry(rTop * flare * 1.03, rTop * flare * 1.03, 0.025, 32, 1, true), cuffMat));
    cuff.position.y = -len + 0.022;
    g.add(cuff);
  }
  return g;
}

function trousers(b, mat, { bottomR = 0.07, topY = null, cuffMat = null } = {}) {
  const g = new THREE.Group();
  const L = b.leg;
  const top = topY ?? b.waistY;
  // seat / waist section
  g.add(lathe(garmentProfile(b, L.top - 0.06, top, 0.012, 0, false), b.sz, mat));
  for (const side of [-1, 1]) {
    const h = L.top - L.bottom + 0.01;
    const leg = shadowed(new THREE.Mesh(new THREE.CylinderGeometry(L.rTop + 0.016, bottomR, h, 32, 1, true), mat));
    leg.position.set(side * L.x, L.bottom + h / 2 - 0.005, 0);
    g.add(leg);
    if (cuffMat) {
      const c = shadowed(new THREE.Mesh(new THREE.CylinderGeometry(bottomR + 0.003, bottomR + 0.003, 0.03, 32, 1, true), cuffMat));
      c.position.set(side * L.x, L.bottom + 0.012, 0);
      g.add(c);
    }
  }
  return g;
}

function collar(b, mat, h = 0.045) {
  const r = b.neck.r + 0.014;
  const m = shadowed(new THREE.Mesh(new THREE.CylinderGeometry(r, r + 0.004, h, 32, 1, true), mat));
  m.position.y = b.neck.y0 + 0.03 + h / 2;
  return m;
}

function buttons(profile, sz, y0, y1, n, mat = buttonMat()) {
  const g = new THREE.Group();
  for (let i = 0; i < n; i++) {
    const y = y0 + (y1 - y0) * (i / Math.max(1, n - 1));
    const r = rAt(profile, y);
    const s = new THREE.Mesh(new THREE.SphereGeometry(0.0075, 12, 8), mat);
    s.position.set(0, y, r * sz + 0.005);
    s.scale.z = 0.5;
    g.add(s);
  }
  return g;
}

// A flat strip of cloth that follows a 3D path (pallu, dupatta).
function ribbon(points, width, mat, offset = 0) {
  const curve = new THREE.CatmullRomCurve3(points, false, 'centripetal');
  const N = 120;
  const pos = [], uv = [], idx = [];
  const up = new THREE.Vector3(0, 1, 0);
  for (let i = 0; i <= N; i++) {
    const t = i / N;
    const p = curve.getPointAt(t);
    const T = curve.getTangentAt(t);
    const radial = new THREE.Vector3(p.x, 0, p.z);
    if (radial.lengthSq() < 1e-6) radial.set(0, 0, 1);
    radial.normalize();
    const lift = THREE.MathUtils.clamp((p.y - 1.33) / 0.06, 0, 1) * 2.5;
    const n = radial.clone().addScaledVector(up, lift).normalize();
    const side = new THREE.Vector3().crossVectors(T, n).normalize();
    const c = p.clone().addScaledVector(n, offset);
    const a = c.clone().addScaledVector(side, width / 2);
    const d = c.clone().addScaledVector(side, -width / 2);
    pos.push(a.x, a.y, a.z, d.x, d.y, d.z);
    uv.push(0, t * 6, 1, t * 6);
    if (i < N) {
      const k = i * 2;
      idx.push(k, k + 1, k + 2, k + 1, k + 3, k + 2);
    }
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  geo.setIndex(idx);
  geo.computeVertexNormals();
  return shadowed(new THREE.Mesh(geo, mat));
}

// Point on (or just outside) the garment surface, using lathe angle convention: front = +z.
function surf(b, phi, y, ease) {
  const r = (y < 0.95 ? Math.max(rAt(b.torso, y), hipRadius(b)) : rAt(b.torso, y)) + ease;
  return new THREE.Vector3(r * Math.sin(phi), y, r * Math.cos(phi) * b.sz);
}

/* ------------------------------------------------------------------ */
/* Avatar                                                              */
/* ------------------------------------------------------------------ */

function buildAvatar(gender, skinHex) {
  const b = BODY[gender];
  const g = new THREE.Group();
  const skin = new THREE.MeshStandardMaterial({ color: skinHex, roughness: 0.6 });
  const hair = new THREE.MeshStandardMaterial({ color: b.hairColor, roughness: 0.75 });

  g.add(lathe(b.torso, b.sz, skin));

  const neck = shadowed(new THREE.Mesh(new THREE.CylinderGeometry(b.neck.r * 0.95, b.neck.r, b.neck.y1 - b.neck.y0, 24), skin));
  neck.position.y = (b.neck.y0 + b.neck.y1) / 2;
  g.add(neck);

  const head = shadowed(new THREE.Mesh(new THREE.SphereGeometry(b.head.r, 40, 32), skin));
  head.position.y = b.head.y;
  head.scale.set(0.9, 1.12, 1.0);
  g.add(head);

  // simple face hints: nose and ears so the front reads at a glance
  const nose = new THREE.Mesh(new THREE.SphereGeometry(0.014, 12, 10), skin);
  nose.position.set(0, b.head.y - 0.01, b.head.r * 0.98);
  nose.scale.set(0.8, 1.2, 1);
  g.add(nose);
  for (const s of [-1, 1]) {
    const ear = new THREE.Mesh(new THREE.SphereGeometry(0.02, 12, 10), skin);
    ear.position.set(s * b.head.r * 0.88, b.head.y, 0);
    ear.scale.set(0.5, 1, 0.8);
    g.add(ear);
  }

  if (gender === 'male') {
    const cap = shadowed(new THREE.Mesh(new THREE.SphereGeometry(b.head.r * 1.04, 40, 24, 0, Math.PI * 2, 0, Math.PI * 0.42), hair));
    cap.position.set(0, b.head.y + 0.012, -0.006);
    cap.scale.set(0.92, 1.12, 1.03);
    cap.rotation.x = -0.25;
    g.add(cap);
  } else {
    const cap = shadowed(new THREE.Mesh(new THREE.SphereGeometry(b.head.r * 1.05, 40, 24, 0, Math.PI * 2, 0, Math.PI * 0.5), hair));
    cap.position.set(0, b.head.y + 0.006, -0.01);
    cap.scale.set(0.94, 1.14, 1.04);
    cap.rotation.x = -0.35;
    g.add(cap);
    // long braid-style hair down the back
    const back = shadowed(new THREE.Mesh(new THREE.CapsuleGeometry(0.075, 0.2, 8, 16), hair));
    back.position.set(0, b.head.y - 0.15, -0.075);
    back.scale.set(1.05, 1, 0.45);
    g.add(back);
    const bun = shadowed(new THREE.Mesh(new THREE.SphereGeometry(0.045, 20, 16), hair));
    bun.position.set(0, b.head.y + 0.02, -b.head.r * 1.0);
    g.add(bun);
  }

  for (const side of [-1, 1]) {
    const f = armFrame(b, side);
    const arm = shadowed(new THREE.Mesh(new THREE.CapsuleGeometry(b.arm.r, b.arm.len - b.arm.r * 2, 8, 20), skin));
    arm.position.y = -b.arm.len / 2;
    f.add(arm);
    const hand = shadowed(new THREE.Mesh(new THREE.SphereGeometry(b.arm.r * 1.15, 20, 16), skin));
    hand.position.y = -b.arm.len - 0.03;
    hand.scale.set(0.75, 1.5, 0.9);
    f.add(hand);
    g.add(f);

    const L = b.leg;
    const h = L.top - L.bottom;
    const leg = shadowed(new THREE.Mesh(new THREE.CylinderGeometry(L.rTop, L.rBottom, h, 24), skin));
    leg.position.set(side * L.x, L.bottom + h / 2, 0);
    g.add(leg);
    const foot = shadowed(new THREE.Mesh(new THREE.SphereGeometry(1, 20, 14), skin));
    foot.position.set(side * (L.x + 0.005), 0.035, 0.035);
    foot.scale.set(0.045, 0.035, 0.11);
    g.add(foot);
  }
  return g;
}

/* ------------------------------------------------------------------ */
/* Outfits                                                             */
/* ------------------------------------------------------------------ */

function buildOutfit(gender, id, mainHex, accentHex) {
  const b = BODY[gender];
  const g = new THREE.Group();
  const M = fabric(mainHex);
  const A = fabric(accentHex);
  const gold = goldMat();

  const top = (bottomY, ease, flare, mat = M) => {
    const prof = garmentProfile(b, bottomY, b.shoulder.y + 0.02, ease, flare, true);
    g.add(lathe(prof, b.sz, mat));
    return prof;
  };

  if (gender === 'male') {
    switch (id) {
      case 'kurta': {
        const p = top(0.5, 0.022, 0.09);
        g.add(sleeve(b, -1, 0.93, M), sleeve(b, 1, 0.93, M));
        g.add(collar(b, M), buttons(p, b.sz, 1.24, 1.4, 4));
        g.add(trousers(b, A, { bottomR: 0.062, topY: 0.98 }));
        break;
      }
      case 'nehru': {
        top(0.55, 0.02, 0.08);
        g.add(sleeve(b, -1, 0.93, M), sleeve(b, 1, 0.93, M));
        const jp = garmentProfile(b, 0.84, b.shoulder.y + 0.02, 0.04, 0.05, true);
        g.add(lathe(jp, b.sz, A));
        g.add(collar(b, A, 0.055), buttons(jp, b.sz, 0.9, 1.38, 6, goldMat()));
        g.add(trousers(b, M, { bottomR: 0.05, topY: 0.98 }));
        break;
      }
      case 'shirt': {
        const p = top(0.8, 0.026, 0.02);
        g.add(sleeve(b, -1, 0.38, M, 1.75, 1.05), sleeve(b, 1, 0.38, M, 1.75, 1.05));
        g.add(collar(b, M, 0.035), buttons(p, b.sz, 0.86, 1.4, 6));
        g.add(trousers(b, A, { bottomR: 0.058 }));
        break;
      }
      case 'tee': {
        top(0.83, 0.045, 0.0);
        g.add(sleeve(b, -1, 0.42, M, 2.05, 1.08), sleeve(b, 1, 0.42, M, 2.05, 1.08));
        g.add(collar(b, M, 0.018));
        g.add(trousers(b, A, { bottomR: 0.052, cuffMat: A }));
        break;
      }
      case 'mundu': {
        const p = top(0.88, 0.024, 0.0);
        g.add(sleeve(b, -1, 0.36, M, 1.75, 1.05), sleeve(b, 1, 0.36, M, 1.75, 1.05));
        g.add(collar(b, M, 0.035), buttons(p, b.sz, 0.92, 1.4, 6));
        const mp = garmentProfile(b, 0.06, b.waistY, 0.03, 0.035, false);
        g.add(lathe(mp, b.sz, A));
        g.add(band(mp, 0.1, 0.06, b.sz, gold));
        // the folded front overlap with its gold edge
        const edge = shadowed(new THREE.Mesh(new THREE.PlaneGeometry(0.03, b.waistY - 0.07), gold));
        edge.position.set(0.05, (b.waistY + 0.07) / 2, rAt(mp, 0.6) * b.sz + 0.012);
        edge.rotation.y = 0.25;
        g.add(edge);
        break;
      }
      case 'kasavuK': {
        const p = top(0.6, 0.022, 0.08);
        g.add(band(p, 0.64, 0.05, b.sz, gold));
        g.add(sleeve(b, -1, 0.93, M, 1.55, 1.1, gold), sleeve(b, 1, 0.93, M, 1.55, 1.1, gold));
        g.add(collar(b, gold, 0.04), buttons(p, b.sz, 1.24, 1.4, 4, goldMat()));
        g.add(trousers(b, A, { bottomR: 0.062, topY: 0.98 }));
        break;
      }
    }
  } else {
    switch (id) {
      case 'palazzo': {
        top(0.58, 0.022, 0.12);
        g.add(sleeve(b, -1, 0.72, M), sleeve(b, 1, 0.72, M));
        g.add(collar(b, M, 0.02));
        g.add(trousers(b, A, { bottomR: 0.15, topY: 1.0 }));
        // dupatta draped round the neck, both ends falling in front
        const pts = [
          surf(b, 0.95, 0.72, 0.06), surf(b, 0.75, 1.05, 0.045), surf(b, 0.7, 1.28, 0.05),
          new THREE.Vector3(0.11, 1.405, 0.02), new THREE.Vector3(0.065, 1.435, -0.055),
          new THREE.Vector3(-0.065, 1.435, -0.055), new THREE.Vector3(-0.11, 1.405, 0.02),
          surf(b, -0.7, 1.28, 0.05), surf(b, -0.75, 1.05, 0.045), surf(b, -0.95, 0.72, 0.06),
        ];
        g.add(ribbon(pts, 0.14, A, 0.004));
        break;
      }
      case 'kasavuSet': {
        const blouse = garmentProfile(b, 1.12, b.shoulder.y + 0.02, 0.02, 0, true);
        g.add(lathe(blouse, b.sz, M));
        g.add(band(blouse, 1.13, 0.03, b.sz, gold));
        g.add(sleeve(b, -1, 0.28, M, 1.7, 1.0, gold), sleeve(b, 1, 0.28, M, 1.7, 1.0, gold));
        const sk = garmentProfile(b, 0.04, b.waistY, 0.025, 0.07, false);
        g.add(lathe(sk, b.sz, A));
        g.add(band(sk, 0.1, 0.09, b.sz, gold));
        g.add(band(sk, b.waistY - 0.02, 0.035, b.sz, gold));
        break;
      }
      case 'saree': {
        const blouse = garmentProfile(b, 1.13, b.shoulder.y + 0.02, 0.018, 0, true);
        g.add(lathe(blouse, b.sz, A));
        g.add(sleeve(b, -1, 0.3, A, 1.6, 1.0), sleeve(b, 1, 0.3, A, 1.6, 1.0));
        const sk = garmentProfile(b, 0.03, b.waistY, 0.028, 0.06, false);
        g.add(lathe(sk, b.sz, M));
        g.add(band(sk, 0.08, 0.07, b.sz, gold));
        // pallu: from the right hip, across the chest, over the left shoulder, down the back
        const pts = [
          surf(b, -0.55, 0.98, 0.045), surf(b, -0.2, 1.1, 0.05), surf(b, 0.2, 1.22, 0.055),
          surf(b, 0.65, 1.32, 0.05), new THREE.Vector3(0.13, 1.405, 0.035),
          new THREE.Vector3(0.14, 1.41, -0.04), surf(b, 2.3, 1.3, 0.05),
          surf(b, 2.6, 1.05, 0.06), surf(b, 2.8, 0.75, 0.08), surf(b, 2.9, 0.52, 0.1),
        ];
        g.add(ribbon(pts, 0.25, gold, 0.002));
        g.add(ribbon(pts, 0.205, M, 0.006));
        break;
      }
      case 'coord': {
        const p = top(0.86, 0.04, 0.0);
        g.add(sleeve(b, -1, 0.42, M, 2.0, 1.05), sleeve(b, 1, 0.42, M, 2.0, 1.05));
        g.add(collar(b, M, 0.03), buttons(p, b.sz, 0.92, 1.33, 5));
        g.add(trousers(b, A, { bottomR: 0.075 }));
        break;
      }
      case 'dress': {
        const p = top(0.5, 0.02, 0.32);
        g.add(sleeve(b, -1, 0.26, M, 2.0, 1.35), sleeve(b, 1, 0.26, M, 2.0, 1.35));
        g.add(collar(b, M, 0.015));
        g.add(band(p, b.waistY + 0.01, 0.035, b.sz, A, 0.003));
        break;
      }
      case 'layer': {
        top(0.55, 0.018, 0.08);
        g.add(sleeve(b, -1, 0.93, M), sleeve(b, 1, 0.93, M));
        g.add(collar(b, M, 0.02));
        // open-front long jacket: leave a gap at the front (phi = 0 faces the viewer)
        const jp = garmentProfile(b, 0.42, b.shoulder.y + 0.02, 0.038, 0.11, false);
        g.add(lathe(jp, b.sz, A, { phiStart: 0.42, phiLength: Math.PI * 2 - 0.84 }));
        g.add(sleeve(b, -1, 0.5, A, 1.95, 1.05), sleeve(b, 1, 0.5, A, 1.95, 1.05));
        g.add(trousers(b, M, { bottomR: 0.052 }));
        break;
      }
    }
  }
  return g;
}

/* ------------------------------------------------------------------ */
/* State + UI                                                          */
/* ------------------------------------------------------------------ */

const state = {
  gender: 'male',
  outfit: OUTFITS.male[0].id,
  main: OUTFITS.male[0].main,
  accent: OUTFITS.male[0].accent,
  skin: SKINS[1],
};

let figure = null;
function disposeTree(obj) {
  obj.traverse(o => {
    if (o.geometry) o.geometry.dispose();
    if (o.material) (Array.isArray(o.material) ? o.material : [o.material]).forEach(m => m.dispose());
  });
}
const colorHex = id => PALETTE.find(p => p.id === id).hex;
const outfitMeta = () => OUTFITS[state.gender].find(o => o.id === state.outfit);

function rebuild() {
  if (figure) { scene.remove(figure); disposeTree(figure); }
  figure = new THREE.Group();
  figure.add(buildAvatar(state.gender, state.skin));
  figure.add(buildOutfit(state.gender, state.outfit, colorHex(state.main), colorHex(state.accent)));
  scene.add(figure);
  syncUI();
}

const $ = id => document.getElementById(id);

function renderControls() {
  // gender
  document.querySelectorAll('#genderSeg button').forEach(btn => {
    btn.onclick = () => {
      if (state.gender === btn.dataset.gender) return;
      state.gender = btn.dataset.gender;
      const o = OUTFITS[state.gender][0];
      Object.assign(state, { outfit: o.id, main: o.main, accent: o.accent });
      renderOutfits();
      rebuild();
    };
  });
  // skin
  $('skinRow').innerHTML = '';
  SKINS.forEach((hex, i) => {
    const s = document.createElement('button');
    s.className = 'skin';
    s.style.background = hex;
    s.setAttribute('aria-label', `Skin tone ${i + 1}`);
    s.onclick = () => { state.skin = hex; rebuild(); };
    $('skinRow').appendChild(s);
  });
  // swatches
  for (const which of ['main', 'accent']) {
    const box = $(which + 'Swatches');
    box.innerHTML = '';
    PALETTE.forEach(p => {
      const s = document.createElement('button');
      s.className = 'sw';
      s.style.backgroundColor = p.hex;
      s.title = p.name;
      s.setAttribute('aria-label', p.name);
      s.dataset.id = p.id;
      s.onclick = () => { state[which] = p.id; rebuild(); };
      box.appendChild(s);
    });
  }
  renderOutfits();
}

function renderOutfits() {
  const grid = $('outfitGrid');
  grid.innerHTML = '';
  OUTFITS[state.gender].forEach(o => {
    const b = document.createElement('button');
    b.className = 'outfit';
    b.innerHTML = `<b>${o.name}</b><span>${o.sub}</span>`;
    b.dataset.id = o.id;
    b.onclick = () => {
      Object.assign(state, { outfit: o.id, main: o.main, accent: o.accent });
      rebuild();
    };
    grid.appendChild(b);
  });
}

const inr = n => '₹' + n.toLocaleString('en-IN');

function syncUI() {
  document.querySelectorAll('#genderSeg button').forEach(b => b.setAttribute('aria-selected', String(b.dataset.gender === state.gender)));
  document.querySelectorAll('.skin').forEach((s, i) => s.setAttribute('aria-pressed', String(SKINS[i] === state.skin)));
  document.querySelectorAll('.outfit').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.id === state.outfit)));
  for (const which of ['main', 'accent']) {
    document.querySelectorAll(`#${which}Swatches .sw`).forEach(s => s.setAttribute('aria-pressed', String(s.dataset.id === state[which])));
    $(which + 'Name').textContent = PALETTE.find(p => p.id === state[which]).name;
  }
  const o = outfitMeta();
  $('accentLabel').textContent = o.accentLabel;
  $('mainLabel').textContent = 'Main colour';

  // weaver card: weaver ~30%, spinner ~12%, the rest dye, tailoring, retail
  const idx = OUTFITS[state.gender].indexOf(o);
  const weaver = Math.round(o.price * 0.3 / 10) * 10;
  const spin = Math.round(o.price * 0.12 / 10) * 10;
  const rest = o.price - weaver - spin;
  $('wTitle').textContent = o.name;
  $('wDesc').textContent = `${o.sub} · ${PALETTE.find(p => p.id === state.main).name}`;
  $('wPrice').textContent = inr(o.price);
  $('wWeaver').textContent = inr(weaver);
  $('wSpin').textContent = inr(spin);
  $('wRest').textContent = inr(rest);
  $('wBarWeaver').style.width = (weaver / o.price * 100) + '%';
  $('wBarSpin').style.width = (spin / o.price * 100) + '%';
  $('wBarRest').style.width = (rest / o.price * 100) + '%';
  $('wMade').textContent = `Handspun and handwoven by ${WEAVERS[(idx + (state.gender === 'female' ? 3 : 0)) % WEAVERS.length]}.`;
}

// Tools
const rotateBtn = $('rotateBtn');
rotateBtn.onclick = () => {
  controls.autoRotate = !controls.autoRotate;
  rotateBtn.setAttribute('aria-pressed', String(controls.autoRotate));
  rotateBtn.textContent = controls.autoRotate ? 'Auto-rotate on' : 'Auto-rotate off';
};
$('resetBtn').onclick = () => {
  camera.position.copy(HOME.pos);
  controls.target.copy(HOME.target);
  controls.update();
};
$('snapBtn').onclick = () => {
  renderer.render(scene, camera);
  const a = document.createElement('a');
  a.href = renderer.domElement.toDataURL('image/png');
  a.download = `nool-${state.gender}-${state.outfit}-${state.main}.png`;
  a.click();
};

/* ------------------------------------------------------------------ */
/* Loop                                                                */
/* ------------------------------------------------------------------ */

function resize() {
  const w = container.clientWidth, h = container.clientHeight;
  renderer.setSize(w, h, false);
  camera.aspect = w / h;
  // pull back on tall, narrow screens so the whole figure fits
  camera.zoom = Math.min(1, camera.aspect / 1.1);
  camera.updateProjectionMatrix();
}
new ResizeObserver(resize).observe(container);
resize();

renderControls();
rebuild();
$('loading').classList.add('done');

renderer.setAnimationLoop(() => {
  controls.update();
  renderer.render(scene, camera);
});

// expose for debugging and screenshots
window.nool = { state, rebuild, controls, camera };
