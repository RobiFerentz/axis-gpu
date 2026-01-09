# Axis GPU

A TypeScript library for 2D and 3D animation in the browser using WebGPU.

## Features

- **WebGPU Rendering**: Modern GPU-accelerated graphics
- **2D & 3D Support**: Primitives, meshes, and transforms
- **Animation System**: Keyframes, easing, and tweening with 20+ easing functions
- **Scene Graph**: Hierarchical parent-child transforms
- **Material System**: Multiple material types (basic, textured, gradient, vertex color, wireframe)
- **Shader System**: Built-in WGSL shaders and custom shader support
- **Texture System**: Image loading and procedural texture generation
- **Camera System**: 2D orthographic and 3D perspective cameras
- **Wireframe Rendering**: Line-based rendering for geometric visualization
- **Zero Dependencies**: Pure TypeScript implementation

## Requirements

- A browser with WebGPU support (Chrome 113+, Edge 113+, or Safari 18+)
- Bun package manager

## Installation

```bash
bun install axis-gpu
```

## Quick Start

```typescript
import { GPUContext, Renderer, Scene, Camera3D, Cube } from 'axis-gpu';

// Initialize WebGPU context
const canvas = document.querySelector('canvas')!;
const context = await GPUContext.create(canvas);
const renderer = new Renderer(context);

// Create scene
const scene = new Scene();
const cube = new Cube();
scene.add(cube);

// Create camera
const camera = new Camera3D();
camera.position.z = 5;

// Render loop
function animate() {
  cube.rotation.y += 0.01;
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}
animate();
```

## Development

```bash
# Install dependencies
bun install

# Build the library
bun run build

# Watch mode for development
bun run dev

# Clean build artifacts
bun run clean

# Generate documentation
bun run docs

# Watch and regenerate docs on changes
bun run docs:watch

# Serve examples locally
bun run examples
```

## Documentation

API documentation is generated from JSDoc comments using TypeDoc. The generated markdown files can be found in the `docs/` directory after running:

```bash
bun run docs
```

Browse the documentation starting from `docs/README.md` or explore individual class documentation in `docs/classes/`.

## Examples

View live examples by running:

```bash
bun run examples
```

This will build the library and start a dev server. Then open your browser to `http://localhost:3000/examples/` and explore:
- **01-basic-setup.html** - Textured dice with numbered faces and edge highlighting
- **02-primitives.html** - Multi-colored cube, gradient sphere (bouncing), and wireframe dodecahedron
- **03-animation.html** - Five wireframe dodecahedrons demonstrating different easing functions (Linear, EaseInOut, Bounce, Elastic, Back)
- **04-scene-graph.html** - Solar system with procedurally textured Earth, hierarchical transforms

For development with auto-rebuild:

```bash
# Terminal 1: Watch and rebuild library on changes
bun run dev

# Terminal 2: Serve examples
bun run dev-server.ts
```

## Project Structure

```
axis-gpu/
├── src/
│   ├── core/          # WebGPU context, renderer, scene graph
│   ├── math/          # Vectors, matrices, quaternions, transforms
│   ├── primitives/    # 2D/3D shapes and geometry
│   ├── shaders/       # Shader management and built-in shaders
│   ├── materials/     # Material system
│   ├── textures/      # Texture loading and management
│   ├── animation/     # Keyframe, easing, tweening system
│   ├── camera/        # 2D/3D camera systems
│   └── index.ts       # Main exports
└── examples/          # Usage demonstrations
```

## License

MIT
