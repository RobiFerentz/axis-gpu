import {
  GPUContext,
  Renderer,
  Scene,
  Camera3D,
  Mesh,
  DiceCubeGeometry,
  TexturedMaterial,
  ProceduralTextures,
} from '../dist/index.js';

async function main() {
  // Get canvas
  const canvas = document.getElementById('canvas') as HTMLCanvasElement;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  // Initialize WebGPU context
  const context = await GPUContext.create(canvas);
  const renderer = new Renderer(context);
  renderer.setClearColor(0.1, 0.1, 0.15, 1.0);

  // Create scene
  const scene = new Scene();

  // Create dice cube with texture
  const diceTexture = ProceduralTextures.createDiceTexture(context, 256);
  const diceGeometry = new DiceCubeGeometry(2);
  const diceMaterial = new TexturedMaterial({ texture: diceTexture });
  const dice = new Mesh(diceGeometry, diceMaterial);
  scene.add(dice);

  // Create camera
  const camera = new Camera3D(Math.PI / 4, canvas.width / canvas.height, 0.1, 1000);
  camera.position.set(0, 0, 5);

  // Handle window resize
  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    camera.setAspect(canvas.width, canvas.height);
    renderer.resize(canvas.width, canvas.height);
  });

  // Animation loop
  let lastTime = performance.now();
  function animate() {
    const currentTime = performance.now();
    const deltaTime = (currentTime - lastTime) / 1000; // Convert to seconds
    lastTime = currentTime;

    // Rotate dice
    dice.transform.rotateY(deltaTime * 0.5);
    dice.transform.rotateX(deltaTime * 0.3);

    // Update and render scene
    scene.update(deltaTime);
    renderer.render(scene, camera);

    requestAnimationFrame(animate);
  }

  animate();
}

main().catch(console.error);
