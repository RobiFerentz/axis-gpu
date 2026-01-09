import {
  GPUContext,
  Renderer,
  Scene,
  Camera3D,
  Mesh,
  SphereGeometry,
  BasicMaterial,
  TexturedMaterial,
  ProceduralTextures,
  Vec4,
  SceneNode,
} from '../dist/index.js';

// Empty scene node for grouping
class Group extends SceneNode {
  render() {
    // Groups don't render anything themselves
  }
}

async function main() {
  const canvas = document.getElementById('canvas') as HTMLCanvasElement;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const context = await GPUContext.create(canvas);
  const renderer = new Renderer(context);
  renderer.setClearColor(0.05, 0.05, 0.1, 1.0);

  const scene = new Scene();

  // Create sun (parent)
  const sun = new Mesh(
    new SphereGeometry(1.5, 32, 16),
    new BasicMaterial({ color: new Vec4(1, 0.8, 0.2, 1) })
  );
  scene.add(sun);

  // Create Earth orbit group
  const earthOrbit = new Group();
  sun.add(earthOrbit);

  // Create Earth with texture
  const earthTexture = ProceduralTextures.createEarthTexture(context, 512);
  const earth = new Mesh(
    new SphereGeometry(0.8, 32, 16),
    new TexturedMaterial({ texture: earthTexture })
  );
  earth.position.set(5, 0, 0);
  earthOrbit.add(earth);

  // Create Moon orbit group
  const moonOrbit = new Group();
  earth.add(moonOrbit);

  // Create Moon
  const moon = new Mesh(
    new SphereGeometry(0.3, 32, 16),
    new BasicMaterial({ color: new Vec4(0.7, 0.7, 0.7, 1) })
  );
  moon.position.set(2, 0, 0);
  moonOrbit.add(moon);

  // Create Mars orbit group
  const marsOrbit = new Group();
  sun.add(marsOrbit);

  // Create Mars
  const mars = new Mesh(
    new SphereGeometry(0.6, 32, 16),
    new BasicMaterial({ color: new Vec4(0.9, 0.3, 0.2, 1) })
  );
  mars.position.set(8, 0, 0);
  marsOrbit.add(mars);

  // Create camera
  const camera = new Camera3D(Math.PI / 4, canvas.width / canvas.height, 0.1, 1000);
  camera.position.set(0, 15, 15);
  camera.lookAt({ x: 0, y: 0, z: 0 } as any);

  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    camera.setAspect(canvas.width, canvas.height);
    renderer.resize(canvas.width, canvas.height);
  });

  let lastTime = performance.now();
  function animate() {
    const currentTime = performance.now();
    const deltaTime = (currentTime - lastTime) / 1000;
    lastTime = currentTime;

    // Rotate sun
    sun.transform.rotateY(deltaTime * 0.5);

    // Orbit Earth around Sun
    earthOrbit.transform.rotateY(deltaTime * 0.3);
    
    // Rotate Earth
    earth.transform.rotateY(deltaTime * 1.0);

    // Orbit Moon around Earth
    moonOrbit.transform.rotateY(deltaTime * 1.5);

    // Orbit Mars around Sun
    marsOrbit.transform.rotateY(deltaTime * 0.2);
    
    // Rotate Mars
    mars.transform.rotateY(deltaTime * 0.8);

    scene.update(deltaTime);
    renderer.render(scene, camera);

    requestAnimationFrame(animate);
  }

  animate();
}

main().catch(console.error);
