import * as THREE from "three";

// Canvas
const canvas = document.querySelector("canvas.webgl") as HTMLCanvasElement;

// Scene
const scene = new THREE.Scene();

//Objects

const makeSimpleCube = (
  position: THREE.Vector3 = new THREE.Vector3(0, 0, 0),
  size: number = 1,
  color: number = 0xff0000
) => {
  const geometry = new THREE.BoxGeometry(size, size, size);
  const material = new THREE.MeshBasicMaterial({ color });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.copy(position);
  scene.add(mesh);
  return mesh;
};

const sun = makeSimpleCube();
const planet = makeSimpleCube(new THREE.Vector3(2, 0, 0), 0.5, 0x00ff00);
const moon = makeSimpleCube(new THREE.Vector3(1, 0, 0), 0.2, 0x0000ff);

// Sizes
const sizes = {
  width: 800,
  height: 600,
};

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.z = 5;
scene.add(camera);

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});

renderer.setSize(sizes.width, sizes.height);

// Animation

const clock = new THREE.Clock();

const tick = () => {
  //Update planet
  const elapsedTime = clock.getElapsedTime();

  planet.position.x = Math.cos(elapsedTime) * Math.PI + sun.position.x;
  planet.position.y = Math.sin(elapsedTime) * Math.PI + sun.position.y;

  //Update moon
  moon.position.x = Math.cos(elapsedTime * 2) + planet.position.x;
  moon.position.y = Math.sin(elapsedTime * 2) + planet.position.y;

  //Render
  renderer.render(scene, camera);
  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
