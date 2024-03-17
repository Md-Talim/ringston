import * as dat from "dat.gui";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { TextPlugin } from "gsap/TextPlugin";
import SplitType from "split-type";
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
   * Window's size object
   * @defaultValue `width` - `window.innerWidth`
   * @defaultValue `height` - `window.innerHeight`
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

    const animate = gsap.timeline({
      scrollTrigger: {
        trigger: "section.details",
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
      defaults: {
        ease: "power3.inOut",
        duration: 3,
      },
    });

    animate
      .to(ring.position, {
        z: 2.5,
        y: -0.34,
      })
      .to(
        ring.rotation,
        {
          z: 1,
        },
        "<"
      );
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

function animateWords() {
  const words = ["Relationships", "Romance", "Rings"];
  let index = 0;
  const textElement = document.querySelector(".primary-h1 span");
  let split: SplitType;

  function animateChar(chars: HTMLElement[]) {
    gsap.from(chars, {
      yPercent: 100,
      stagger: 0.03,
      duration: 1.5,
      ease: "power4.out",
      onComplete: () => {
        if (split) {
          split.revert();
        }
      },
    });
  }

  function updateText() {
    textElement!!.textContent = words[index];
    split = new SplitType(".primary-h1 span", { types: "chars" });
    animateChar(split.chars!!);
    index = (index + 1) % words.length;
  }

  setInterval(updateText, 3000);
}

function animateInspectionSection() {
  const animate = gsap.timeline({
    scrollTrigger: {
      trigger: ".inspection",
      start: "top bottom",
      end: "bottom top",
      markers: true,
      scrub: true,
    },
  });

  animate
    .to(".inspection h2", {
      y: -100,
    })
    .to(
      ".ring-bg",
      {
        y: -50,
        height: 300,
      },
      "<"
    );

  gsap.to(".marquee p", {
    scrollTrigger: {
      trigger: ".marquee p",
      start: "top 80%",
      end: "bottom top",
      scrub: true,
    },
    x: 200,
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

  animateWords();
  animateInspectionSection();
});
