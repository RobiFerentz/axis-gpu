import {
  GPUContext,
  Renderer,
  Scene,
  Camera3D,
  Mesh,
  MeshWithColors,
  SphereGeometry,
  PlaneGeometry,
  BasicMaterial,
  GradientMaterial,
  VertexColorMaterial,
  MultiColorCubeGeometry,
  DodecahedronGeometry,
  Vec4,
} from '../dist/index.js';

async function main() {
  const canvas = document.getElementById('canvas') as HTMLCanvasElement;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const context = await GPUContext.create(canvas);
  const renderer = new Renderer(context);
  renderer.setClearColor(0.1, 0.1, 0.15, 1.0);

  const scene = new Scene();

  // Create multi-colored cube (each face different color)
  const cube = new MeshWithColors(
    new MultiColorCubeGeometry(1.5),
    new VertexColorMaterial()
  );
  cube.position.set(-4, 2, 0);
  scene.add(cube);

  // Create sphere with gradient material
  const sphere = new Mesh(
    new SphereGeometry(1, 32, 16),
    new GradientMaterial({ intensity: 1.0 })
  );
  sphere.position.set(0, 2, 0);
  scene.add(sphere);

  // Create multi-colored dodecahedron (12 faces, each different color)
  const dodecahedron = new MeshWithColors(
    new DodecahedronGeometry(1.2),
    new VertexColorMaterial()
  );
  dodecahedron.position.set(4, 2, 0);
  scene.add(dodecahedron);

  // Create plane (ground)
  const plane = new Mesh(
    new PlaneGeometry(20, 20),
    new BasicMaterial({ color: new Vec4(0.4, 0.4, 0.4, 1) })
  );
  plane.transform.rotateX(-Math.PI / 2);
  plane.position.set(0, -1, 0);
  scene.add(plane);

  // Create camera
  const camera = new Camera3D(Math.PI / 4, canvas.width / canvas.height, 0.1, 1000);
  camera.position.set(0, 3, 12);
  camera.lookAt({ x: 0, y: 1, z: 0 } as any);

  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    camera.setAspect(canvas.width, canvas.height);
    renderer.resize(canvas.width, canvas.height);
  });

  let lastTime = performance.now();
  let elapsedTime = 0;
  
  function animate() {
    const currentTime = performance.now();
    const deltaTime = (currentTime - lastTime) / 1000;
    lastTime = currentTime;
    elapsedTime += deltaTime;

    // Rotate shapes
    cube.transform.rotateY(deltaTime * 0.5);
    cube.transform.rotateX(deltaTime * 0.3);
    
    // Sphere: rotate and bounce up and down
    sphere.transform.rotateY(deltaTime * 0.4);
    sphere.transform.rotateX(deltaTime * 0.3);
    // Bounce motion using sine wave (oscillates between 1 and 3)
    sphere.position.y = 2 + Math.sin(elapsedTime * 2) * 1.5;
    
    // Rotate dodecahedron on two axes
    dodecahedron.transform.rotateY(deltaTime * 0.6);
    dodecahedron.transform.rotateX(deltaTime * 0.4);

    scene.update(deltaTime);
    renderer.render(scene, camera);

    requestAnimationFrame(animate);
  }

  animate();
}

main().catch(console.error);
