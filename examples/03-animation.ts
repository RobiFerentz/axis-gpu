import {
  GPUContext,
  Renderer,
  Scene,
  Camera3D,
  Mesh,
  WireframeMesh,
  PlaneGeometry,
  DodecahedronWireframeGeometry,
  BasicMaterial,
  WireframeMaterial,
  Vec4,
  Tween,
  Easing,
} from '../dist/index.js';

async function main() {
  const canvas = document.getElementById('canvas') as HTMLCanvasElement;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const context = await GPUContext.create(canvas);
  const renderer = new Renderer(context);
  renderer.setClearColor(0.1, 0.1, 0.15, 1.0);

  const scene = new Scene();

  // Create multiple wireframe dodecahedrons to demonstrate different easing functions
  const dodecahedrons: { mesh: WireframeMesh; tween: Tween; name: string }[] = [];
  
  const easingFunctions = [
    { name: 'Linear', fn: Easing.linear, color: [1, 0.3, 0.3] as [number, number, number] },
    { name: 'EaseInOut', fn: Easing.easeInOutQuad, color: [0.3, 1, 0.3] as [number, number, number] },
    { name: 'Bounce', fn: Easing.easeOutBounce, color: [0.3, 0.3, 1] as [number, number, number] },
    { name: 'Elastic', fn: Easing.easeOutElastic, color: [1, 1, 0.3] as [number, number, number] },
    { name: 'Back', fn: Easing.easeOutBack, color: [1, 0.3, 1] as [number, number, number] },
  ];

  easingFunctions.forEach((easingInfo, i) => {
    const dodecahedron = new WireframeMesh(
      new DodecahedronWireframeGeometry(0.7, easingInfo.color),
      new WireframeMaterial()
    );
    
    const xPos = (i - 2) * 2.5;
    dodecahedron.position.set(xPos, -2, 0);
    scene.add(dodecahedron);

    // Create tween for bouncing animation
    const tween = new Tween({
      from: -2,
      to: 3,
      duration: 2,
      easing: easingInfo.fn,
      onUpdate: (value) => {
        dodecahedron.position.y = value;
      },
    });
    tween.play();

    dodecahedrons.push({ mesh: dodecahedron, tween, name: easingInfo.name });
  });

  // Create ground plane
  const plane = new Mesh(
    new PlaneGeometry(30, 10),
    new BasicMaterial({ color: new Vec4(0.3, 0.3, 0.3, 1) })
  );
  plane.transform.rotateX(-Math.PI / 2);
  plane.position.set(0, -2, 0);
  scene.add(plane);

  // Create camera
  const camera = new Camera3D(Math.PI / 4, canvas.width / canvas.height, 0.1, 1000);
  camera.position.set(0, 2, 15);
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

    // Update all tweens
    dodecahedrons.forEach(({ mesh, tween }) => {
      tween.update(deltaTime);
      
      // Restart tween when finished
      if (tween.isFinished()) {
        tween.restart();
      }
      
      // Add rotation for better visibility
      mesh.transform.rotateY(deltaTime * 1.5);
      mesh.transform.rotateX(deltaTime * 0.5);
    });

    scene.update(deltaTime);
    renderer.render(scene, camera);

    requestAnimationFrame(animate);
  }

  animate();
}

main().catch(console.error);
