# Axis GPU Examples

This directory contains example projects demonstrating various features of the Axis GPU library.

## Running Examples

To run the examples, use the built-in dev server command:

```bash
# From the project root, run:
bun run examples
```

This will:
1. Build the library to the `dist/` folder
2. Start a development server at `http://localhost:3000`
3. Serve the examples which import from the built library

Then open your browser and navigate to:

- Main examples page: `http://localhost:3000/examples/`
- Or directly to any example:
  - `http://localhost:3000/examples/01-basic-setup.html`
  - `http://localhost:3000/examples/02-primitives.html`
  - `http://localhost:3000/examples/03-animation.html`
  - `http://localhost:3000/examples/04-scene-graph.html`

### How It Works

Examples import from the built library in `dist/index.js`. When you run the examples:

1. The library is built first (TypeScript → JavaScript in `dist/`)
2. The dev server serves the example HTML and TypeScript files
3. The dev server transpiles example `.ts` files on-the-fly
4. Examples import the pre-built library code

### Development Workflow

If you're making changes to the library source code:

```bash
# Option 1: Build once and run examples
bun run build
bun run dev-server.ts

# Option 2: Watch mode (in separate terminals)
bun run dev       # Terminal 1 - watches and rebuilds library
bun run dev-server.ts  # Terminal 2 - serves examples
```

## Examples List

### 01 - Basic Setup
**File:** `01-basic-setup.html`

A minimal example showing:
- WebGPU context initialization
- Creating a simple cube
- Basic rendering loop
- Camera setup

### 02 - Primitives
**File:** `02-primitives.html`

Demonstrates the built-in primitive geometries:
- Cube
- Sphere
- Cylinder
- Plane
- Multiple objects in a scene

### 03 - Animation
**File:** `03-animation.html`

Shows the animation system:
- Keyframe animation
- Animation clips and tracks
- Easing functions
- Animation mixer
- Property animation (position, rotation, scale)

### 04 - Scene Graph
**File:** `04-scene-graph.html`

Demonstrates hierarchical transforms:
- Parent-child relationships
- Solar system example
- Nested transformations
- Transform inheritance

## Browser Requirements

These examples require a browser with WebGPU support:
- Chrome/Edge 113+
- Safari 18+
- Firefox (behind flag)

Check WebGPU availability at: https://caniuse.com/webgpu

## Notes

- All examples use TypeScript and ES modules
- Examples assume the library is built in `../src`
- For production use, build the library first: `bun run build`
