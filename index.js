import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
const w = window.innerWidth;
const h = window.innerHeight;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
camera.position.z = 6.5;
const renderer = new THREE.WebGPURenderer({ antialias: true });
renderer.setSize(w, h);
renderer.setClearColor(0x000, 1);
document.body.appendChild(renderer.domElement);

const ctrls = new OrbitControls(camera, renderer.domElement);
ctrls.enableDamping = true;

const stuffGroup = new THREE.Group();
scene.add(stuffGroup);

const imgGroup = new THREE.Group();
scene.add(imgGroup);
// const palette = [0x787257, 0x555867, 0x7dcade, 0xb2ae8b, 0xcadd4f, 0xefac41, 0xec3b75, 0x99d0d5, 0xddebeb];
// const palette = ["#00202e", "#003f5c", "#2c4875", "#8a508f", "#bc5090", "#ff6361", "#ff8531", "#ffa600", "#ffd380"];
// const palette = ["#f72585", "#b5179e", "#7209b7", "#560bad", "#480ca8", "#3a0ca3", "#3f37c9", "#4361ee", "#4895ef", "#4cc9f0"];
const palette = ["#7d0000","#570000","#101010","#401854","#4f007c"];
function init(strokes) {

  function getSprite(imgs = strokes, size = 1) {
    const randomIndex = Math.floor(Math.random() * imgs.length);
    const map = imgs[randomIndex];
    const colorIndex = Math.floor(Math.random() * palette.length);
    const color = new THREE.Color(palette[colorIndex])
    const material = new THREE.SpriteMaterial({ map, color });
    const sprite = new THREE.Sprite(material);
    const rotation = Math.random() * Math.PI * 2;
    material.rotation = rotation;
    sprite.scale.set(size, size, size);
    return sprite;
  }

  const tetra = new THREE.TetrahedronGeometry(1, 0);
  const ball = new THREE.IcosahedronGeometry(1, 6);
  const box = new THREE.BoxGeometry(1, 1, 1);
  const octa = new THREE.OctahedronGeometry(1, 0);
  const dodeca = new THREE.DodecahedronGeometry(1, 0);
  const donut = new THREE.TorusGeometry(1, 0.3, 12, 24);
  const geos = [tetra, ball, box, octa, dodeca, donut];
  function getMesh() {
    const geo = geos[Math.floor(Math.random() * geos.length)];
    const colorIndex = Math.floor(Math.random() * palette.length);
    const color = new THREE.Color(palette[colorIndex]);
    // xTODO: MeshToonMaterial ?
    const mat = new THREE.MeshBasicMaterial({ color });
    const mesh = new THREE.Mesh(geo, mat);
    const size = 0.5 + Math.random() * 0.5 - 0.25;
    mesh.scale.setScalar(size);
    mesh.rotation.set(Math.random() * Math.PI * 2, Math.random() * Math.PI * 2, Math.random() * Math.PI * 2);
    return mesh;
  }

  function bunchaSprites({ numSprites = 75, imgs = images, z = 0.5, size }) {
    for (let i = 0; i < numSprites; i++) {
      const sprite = getSprite(imgs, size);
      const r = 1.5 + Math.random() * 1.0;
      const theta = Math.random() * Math.PI * 1.5;
      let x = r * Math.cos(theta);
      let y = r * Math.sin(theta);
      z += Math.random() * 0.5 - 0.25;
      sprite.position.set(x, y, z);
      imgGroup.add(sprite);
    }
  }
  function bunchaMeshes({ z = 0 }) {
    const numThings = 50;
    for (let i = 0; i < numThings; i++) {
      const thing = getMesh();
      const r = 1.5 + Math.random() * 1.0;
      const theta = Math.random() * Math.PI * 1.5;
      let x = r * Math.cos(theta);
      let y = r * Math.sin(theta);
      z += Math.random() * 1 - 0.5;
      thing.position.set(x, y, z);
      stuffGroup.add(thing);
    }
  }
  bunchaMeshes({ z: 0.0 });
  bunchaSprites({ numSprites: 10, imgs: strokes, z: -2.0, size: 7 });

  function animate(t = 0) {
    renderer.render(scene, camera);
    ctrls.update();
  }
  renderer.setAnimationLoop(animate);
}

// load textures
const imgs = [];
const manager = new THREE.LoadingManager();
manager.onLoad = () => init(imgs);
const loader = new THREE.TextureLoader(manager);

const strokes = ['s1', 's2', 's3', 's4'];
strokes.forEach((name) => {
  let path = `./strokes/${name}.png`;
  loader.load(path, (img) => {
    img.name = name;
    imgs.push(img);
  });
});

function handleWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener('resize', handleWindowResize, false);