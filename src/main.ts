import "./style.css";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { TextPlugin } from "gsap/TextPlugin";
import * as dat from "dat.gui";
import * as THREE from "three";

gsap.registerPlugin(ScrollTrigger);
gsap.registerPlugin(TextPlugin);

function initThreeJS() {
  /**
   * Dubugging
   */
  const gui = new dat.GUI();
  gui.hide();

  /**
   * Dubugging
   */
  const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
  };

  const canvas = document.querySelector("canvas.webgl");
  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(
    75,
    sizes.width / sizes.height,
    0.1,
    100
  );
  camera.position.z = 2;
  scene.add(camera);

  const renderer = new THREE.WebGLRenderer({
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

document.addEventListener("DOMContentLoaded", () => {
  initThreeJS();
});
