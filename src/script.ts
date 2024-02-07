import * as THREE from "three";
// Canvas
const canvas = document.querySelector("canvas.webgl") as HTMLCanvasElement;

// Scene
const scene = new THREE.Scene();

//Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);
const pointLight = new THREE.PointLight(0xffffff, 30);
pointLight.position.set(0, 0, 0);
scene.add(pointLight);

// // Image
const textureLoader = new THREE.TextureLoader();
const colorTexture = textureLoader.load("/textures/rock051/color.jpg");
colorTexture.colorSpace = THREE.SRGBColorSpace;

const displacementTexture = textureLoader.load(
  "/textures/rock051/displacement.jpg"
);

const normalTexture = textureLoader.load("/textures/rock051/normalGL.jpg");
const ambientOcclusionTexture = textureLoader.load(
  "/textures/rock051/ambientOcclusion.jpg"
);
const metalnessTexture = textureLoader.load("/textures/rock051/metalness.jpg");
const roughnessTexture = textureLoader.load("/textures/rock051/roughness.jpg");

//Objects

const makeSimpleTexturedSphere = (
  position: THREE.Vector3 = new THREE.Vector3(0, 0, 0),
  size: number = 1,
  colorTexture: THREE.Texture,
  ambientOcclusionTexture: THREE.Texture,
  normalTexture: THREE.Texture,
  roughnessTexture: THREE.Texture,
  metalnessTexture: THREE.Texture,
  displacementTexture: THREE.Texture,
  displacementScale: number = 0.1
) => {
  // const geometry = new THREE.BoxGeometry(size, size, size);
  const geometry = new THREE.SphereGeometry(size, 32, 32);
  const material = new THREE.MeshStandardMaterial({
    map: colorTexture,
    aoMap: ambientOcclusionTexture,
    normalMap: normalTexture,
    displacementMap: displacementTexture,
    metalnessMap: metalnessTexture,
    // roughnessMap: roughnessTexture,
  });
  material.displacementScale = displacementScale;

  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.copy(position);
  scene.add(mesh);
  return mesh;
};

// const sun = makeColorTexturedCube(new THREE.Vector3(0, 0, 0), 1, colorTexture);
const sun = makeSimpleTexturedSphere(
  new THREE.Vector3(0, 0, 0),
  2,
  colorTexture,
  ambientOcclusionTexture,
  normalTexture,
  metalnessTexture,
  roughnessTexture,
  displacementTexture,
  0.8
);
const planet = makeSimpleTexturedSphere(
  new THREE.Vector3(1, 0, 0),
  0.3,
  colorTexture,
  ambientOcclusionTexture,
  normalTexture,
  metalnessTexture,
  roughnessTexture,
  displacementTexture,
  0.5
);
const moon = makeSimpleTexturedSphere(
  new THREE.Vector3(1, 0, 0),
  0.05,
  colorTexture,
  ambientOcclusionTexture,
  normalTexture,
  metalnessTexture,
  roughnessTexture,
  displacementTexture
);

// const moon = makeSimpleCube(new THREE.Vector3(1, 0, 0), 0.25, 0x0000ff);

// Sizes
const sizes = {
  width: 800,
  height: 600,
};

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.z = 10;
scene.add(camera);

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});

renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Animation

const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  //Update sun
  sun.rotation.y = elapsedTime * 0.1;
  // sun.rotation.x = elapsedTime * 0.1;

  //Update planet
  planet.position.x = Math.cos(elapsedTime) * 5 + sun.position.x;
  planet.position.y = Math.sin(elapsedTime) * 5 + sun.position.y;
  // planet.position.z = Math.sin(elapsedTime) * 5 + sun.position.z;
  planet.rotation.y = elapsedTime * 2;

  //Update moon
  moon.position.x = Math.cos(elapsedTime * 2) + planet.position.x;
  moon.position.y = Math.sin(elapsedTime * 2) + planet.position.y;
  moon.position.z = Math.sin(elapsedTime * 2) + planet.position.z;
  moon.rotation.y = elapsedTime * 10;

  //Render
  renderer.render(scene, camera);
  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
