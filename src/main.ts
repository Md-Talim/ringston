import * as dat from "dat.gui";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { TextPlugin } from "gsap/TextPlugin";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

gsap.registerPlugin(ScrollTrigger);
gsap.registerPlugin(TextPlugin);

const loader = new GLTFLoader();
let ring: THREE.Group<THREE.Object3DEventMap> | null = null;
let contactRotation = false;
let renderer: THREE.WebGLRenderer,
  scene: THREE.Scene,
  camera: THREE.PerspectiveCamera;

function initThreeJS() {
  /**
   * Dubugging
   */
  const gui = new dat.GUI();
  gui.hide();

  /**
   * Sizes
   */
  const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
  };

  const canvas = document.querySelector("canvas.webgl");
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(
    75,
    sizes.width / sizes.height,
    0.1,
    100
  );
  camera.position.z = 2;
  scene.add(camera);

  const directionalLight = new THREE.DirectionalLight("lightblue", 10);
  directionalLight.position.z = 8;
  scene.add(directionalLight);

  loader.load("ring.glb", (gltf) => {
    ring = gltf.scene;
    ring.position.set(0, 0, 0);
    ring.scale.set(0.5, 0.5, 0.5);
    scene.add(ring);
  });

  renderer = new THREE.WebGLRenderer({
    canvas: canvas!!,
    alpha: true,
    antialias: true,
  });
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  window.addEventListener("resize", () => {
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  });
}

function initRenderLoop() {
  const clock = new THREE.Clock();

  const tick = () => {
    const elapsedTime = clock.getElapsedTime();

    if (ring) {
      if (!contactRotation) {
        ring.rotation.y = 0.5 * elapsedTime;
        ring.rotation.x = 0;
        ring.rotation.z = 0;
      } else {
        ring.rotation.y = 0;
        ring.rotation.x = 0.2 * elapsedTime;
        ring.rotation.z = 0.2 * elapsedTime;
      }
    }

    renderer.render(scene, camera);
    window.requestAnimationFrame(tick);
  };

  tick();
}

document.addEventListener("DOMContentLoaded", () => {
  initThreeJS();
  initRenderLoop();
});
