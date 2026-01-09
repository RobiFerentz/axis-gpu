import { GPUContext } from './GPUContext';
import { Scene } from './Scene';
import { Camera } from '../camera/Camera';

/**
 * Options for configuring the renderer.
 */
export interface RendererOptions {
  /** The clear color as [r, g, b, a] (default: [0.1, 0.1, 0.1, 1.0]) */
  clearColor?: [number, number, number, number];
  /** Whether to enable depth testing (default: true) */
  depthTest?: boolean;
  /** Face culling mode (default: 'back') */
  cullMode?: GPUCullMode;
}

/**
 * Main renderer class that handles WebGPU rendering operations.
 * 
 * @example
 * ```typescript
 * const context = await GPUContext.create(canvas);
 * const renderer = new Renderer(context, {
 *   clearColor: [0.1, 0.1, 0.15, 1.0],
 *   depthTest: true
 * });
 * 
 * renderer.render(scene, camera);
 * ```
 */
export class Renderer {
  /** The WebGPU context */
  public context: GPUContext;
  
  /** The clear color used when clearing the screen */
  public clearColor: [number, number, number, number];
  
  /** Whether depth testing is enabled */
  public depthTest: boolean;
  
  /** The face culling mode */
  public cullMode: GPUCullMode;
  
  private depthTexture?: GPUTexture;
  private depthTextureView?: GPUTextureView;

  /**
   * Creates a new renderer.
   * @param context - The WebGPU context to use
   * @param options - Optional renderer configuration
   */
  constructor(context: GPUContext, options: RendererOptions = {}) {
    this.context = context;
    this.clearColor = options.clearColor ?? [0.1, 0.1, 0.1, 1.0];
    this.depthTest = options.depthTest ?? true;
    this.cullMode = options.cullMode ?? 'back';

    if (this.depthTest) {
      this.createDepthTexture();
    }
  }

  private createDepthTexture(): void {
    const { width, height } = this.context.canvas;
    
    this.depthTexture = this.context.createTexture({
      size: { width, height },
      format: 'depth24plus',
      usage: GPUTextureUsage.RENDER_ATTACHMENT,
    });

    this.depthTextureView = this.depthTexture.createView();
  }

  /**
   * Resizes the renderer and recreates depth textures.
   * @param width - The new width in pixels
   * @param height - The new height in pixels
   */
  resize(width: number, height: number): void {
    this.context.resize(width, height);
    
    if (this.depthTest) {
      this.depthTexture?.destroy();
      this.createDepthTexture();
    }
  }

  /**
   * Renders a scene with the specified camera.
   * @param scene - The scene to render
   * @param camera - The camera to use for rendering
   */
  render(scene: Scene, camera: Camera): void {
    // Update camera matrices
    camera.updateMatrices();

    // Get current texture
    const textureView = this.context.getCurrentTexture().createView();

    // Create command encoder
    const commandEncoder = this.context.createCommandEncoder();

    // Setup render pass
    const renderPassDescriptor: GPURenderPassDescriptor = {
      colorAttachments: [
        {
          view: textureView,
          clearValue: {
            r: this.clearColor[0],
            g: this.clearColor[1],
            b: this.clearColor[2],
            a: this.clearColor[3],
          },
          loadOp: 'clear',
          storeOp: 'store',
        },
      ],
    };

    // Add depth attachment if depth testing is enabled
    if (this.depthTest && this.depthTextureView) {
      renderPassDescriptor.depthStencilAttachment = {
        view: this.depthTextureView,
        depthClearValue: 1.0,
        depthLoadOp: 'clear',
        depthStoreOp: 'store',
      };
    }

    const passEncoder = commandEncoder.beginRenderPass(renderPassDescriptor);

    // Render all objects in the scene
    scene.render(passEncoder, camera, this);

    passEncoder.end();

    // Submit commands
    this.context.submitCommands([commandEncoder.finish()]);
  }

  /**
   * Sets the clear color for the renderer.
   * @param r - Red component (0-1)
   * @param g - Green component (0-1)
   * @param b - Blue component (0-1)
   * @param a - Alpha component (0-1, default: 1.0)
   */
  setClearColor(r: number, g: number, b: number, a: number = 1.0): void {
    this.clearColor = [r, g, b, a];
  }

  /**
   * Destroys the renderer and releases resources.
   */
  destroy(): void {
    this.depthTexture?.destroy();
  }
}
