import * as THREE from "three";

// Definitions
interface Textures {
  color?: THREE.Texture;
  displacement?: THREE.Texture;
  normal?: THREE.Texture;
  ambientOcclusion?: THREE.Texture;
  metalness?: THREE.Texture;
  roughness?: THREE.Texture;
  emission?: THREE.Texture;
}

interface LoadTextureFlags{
  color?: boolean;
  displacement?: boolean;
  normal?: boolean;
  ambientOcclusion?: boolean;
  metalness?: boolean;
  roughness?: boolean;
  emission?: boolean;

}


const loadTextures = (folderPath:string) : Textures=> {
  const textureLoader = new THREE.TextureLoader();
  const color =  textureLoader.load(folderPath + "/color.jpg");
  color.colorSpace = THREE.SRGBColorSpace;
  const displacement = textureLoader.load(folderPath + "/displacement.jpg");
  const normal = textureLoader.load(folderPath + "/normalGL.jpg");
  const ambientOcclusion = textureLoader.load(folderPath + "/ambientOcclusion.jpg");
  const metalness = textureLoader.load(folderPath + "/metalness.jpg",);
  const roughness = textureLoader.load(folderPath + "/roughness.jpg");
  const emission = textureLoader.load(folderPath + "/emission.jpg");
  console.log(folderPath,emission)
  return {
    color,
    displacement,
    normal,
    ambientOcclusion,
    metalness,
    roughness,
    emission
  }
}
const makeSimpleTexturedSphere = (
  position: THREE.Vector3 = new THREE.Vector3(0, 0, 0),
  size: number = 1,
  textures: Textures,
  displacementScale: number = 0.1,
  flags:LoadTextureFlags,
  color?: string,
) => {
  const geometry = new THREE.SphereGeometry(size, 32, 32);
  const material = new THREE.MeshStandardMaterial({
    map: textures.color,
    displacementMap: textures.displacement,
    displacementScale,
    normalMap: textures.normal,
  });
  material.displacementScale = displacementScale;
  if (color) {
    material.color = new THREE.Color(color);
  }
  if(flags.ambientOcclusion){
    material.aoMap = textures.ambientOcclusion || null
  }
  if(flags.metalness){
    material.metalnessMap = textures.metalness || null
  }
  if(flags.roughness){
    material.roughnessMap = textures.roughness || null
  }
  if(flags.emission){
    material.emissiveMap = textures.emission || null
  }

  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.copy(position);
  scene.add(mesh);
  return mesh;
};

// Canvas
const canvas = document.querySelector("canvas.webgl") as HTMLCanvasElement;

// Scene
const scene = new THREE.Scene();

//Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);
const pointLight = new THREE.PointLight(0xffffff, 9);
pointLight.position.set(0,0,0);
scene.add(pointLight);

//Load Texture
const rock051Textures = loadTextures("/textures/rock051");
const rock051Flags = {color:true,displacement:true,normal:true,ambientOcclusion:true,metalness:true,roughness:true,emission:false}
const lava004Textures = loadTextures("/textures/lava004");
const lava004Flags = {color:true,displacement:true,normal:true,ambientOcclusion:false,metalness:false,roughness:true,emission:true}

//Instantiate objects
const sun = makeSimpleTexturedSphere(
  new THREE.Vector3(0, 0, 0),
  2,
  lava004Textures,
  0.3,
  lava004Flags,
  "orange"
);
const planet = makeSimpleTexturedSphere(
  new THREE.Vector3(1, 0, 0),
  0.3,
  rock051Textures,
  0.5,
rock051Flags);
const moon = makeSimpleTexturedSphere(
  new THREE.Vector3(1, 0, 0),
  0.05,
  rock051Textures,
  undefined,
rock051Flags
);

// Sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.z = 10;
scene.add(camera);

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
})

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
