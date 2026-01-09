/**
 * Manages WebGPU context, device, and adapter initialization.
 * This is the main entry point for setting up WebGPU rendering.
 * 
 * @example
 * ```typescript
 * const canvas = document.querySelector('canvas')!;
 * const context = await GPUContext.create(canvas);
 * ```
 */
export class GPUContext {
  /** The WebGPU adapter used for this context */
  public adapter!: GPUAdapter;
  
  /** The WebGPU device used for this context */
  public device!: GPUDevice;
  
  /** The HTML canvas element */
  public canvas: HTMLCanvasElement;
  
  /** The WebGPU canvas context */
  public context!: GPUCanvasContext;
  
  /** The preferred texture format for this context */
  public format: GPUTextureFormat;

  private constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.format = navigator.gpu.getPreferredCanvasFormat();
  }

  /**
   * Creates and initializes a new WebGPU context.
   * @param canvas - The HTML canvas element to render to
   * @returns A promise that resolves to the initialized GPUContext
   * @throws Error if WebGPU is not supported or initialization fails
   */
  static async create(canvas: HTMLCanvasElement): Promise<GPUContext> {
    const gpuContext = new GPUContext(canvas);
    await gpuContext.initialize();
    return gpuContext;
  }

  private async initialize(): Promise<void> {
    if (!navigator.gpu) {
      throw new Error('WebGPU is not supported in this browser');
    }

    // Request adapter
    const adapter = await navigator.gpu.requestAdapter();
    if (!adapter) {
      throw new Error('Failed to get GPU adapter');
    }
    this.adapter = adapter;

    // Request device
    const device = await adapter.requestDevice();
    if (!device) {
      throw new Error('Failed to get GPU device');
    }
    this.device = device;

    // Handle device lost
    device.lost.then((info) => {
      console.error(`WebGPU device was lost: ${info.message}`);
      if (info.reason !== 'destroyed') {
        console.error('Attempting to recreate device...');
        this.initialize();
      }
    });

    // Configure canvas context
    const context = this.canvas.getContext('webgpu');
    if (!context) {
      throw new Error('Failed to get WebGPU canvas context');
    }
    this.context = context;

    context.configure({
      device: this.device,
      format: this.format,
      alphaMode: 'premultiplied',
    });
  }

  /**
   * Resizes the canvas.
   * @param width - The new width in pixels
   * @param height - The new height in pixels
   */
  resize(width: number, height: number): void {
    this.canvas.width = width;
    this.canvas.height = height;
  }

  /**
   * Gets the current texture for rendering.
   * @returns The current GPUTexture from the canvas context
   */
  getCurrentTexture(): GPUTexture {
    return this.context.getCurrentTexture();
  }

  /**
   * Creates a GPU buffer.
   * @param descriptor - The buffer descriptor
   * @returns A new GPUBuffer
   */
  createBuffer(descriptor: GPUBufferDescriptor): GPUBuffer {
    return this.device.createBuffer(descriptor);
  }

  /**
   * Creates a GPU texture.
   * @param descriptor - The texture descriptor
   * @returns A new GPUTexture
   */
  createTexture(descriptor: GPUTextureDescriptor): GPUTexture {
    return this.device.createTexture(descriptor);
  }

  /**
   * Creates a GPU sampler for texture sampling.
   * @param descriptor - Optional sampler descriptor
   * @returns A new GPUSampler
   */
  createSampler(descriptor?: GPUSamplerDescriptor): GPUSampler {
    return this.device.createSampler(descriptor);
  }

  /**
   * Creates a shader module from WGSL code.
   * @param descriptor - The shader module descriptor
   * @returns A new GPUShaderModule
   */
  createShaderModule(descriptor: GPUShaderModuleDescriptor): GPUShaderModule {
    return this.device.createShaderModule(descriptor);
  }

  /**
   * Creates a render pipeline.
   * @param descriptor - The render pipeline descriptor
   * @returns A new GPURenderPipeline
   */
  createRenderPipeline(descriptor: GPURenderPipelineDescriptor): GPURenderPipeline {
    return this.device.createRenderPipeline(descriptor);
  }

  /**
   * Creates a bind group for shader resource binding.
   * @param descriptor - The bind group descriptor
   * @returns A new GPUBindGroup
   */
  createBindGroup(descriptor: GPUBindGroupDescriptor): GPUBindGroup {
    return this.device.createBindGroup(descriptor);
  }

  /**
   * Creates a bind group layout.
   * @param descriptor - The bind group layout descriptor
   * @returns A new GPUBindGroupLayout
   */
  createBindGroupLayout(descriptor: GPUBindGroupLayoutDescriptor): GPUBindGroupLayout {
    return this.device.createBindGroupLayout(descriptor);
  }

  /**
   * Creates a pipeline layout.
   * @param descriptor - The pipeline layout descriptor
   * @returns A new GPUPipelineLayout
   */
  createPipelineLayout(descriptor: GPUPipelineLayoutDescriptor): GPUPipelineLayout {
    return this.device.createPipelineLayout(descriptor);
  }

  /**
   * Creates a command encoder for recording GPU commands.
   * @param descriptor - Optional command encoder descriptor
   * @returns A new GPUCommandEncoder
   */
  createCommandEncoder(descriptor?: GPUCommandEncoderDescriptor): GPUCommandEncoder {
    return this.device.createCommandEncoder(descriptor);
  }

  /**
   * Submits command buffers to the GPU queue.
   * @param commands - Array of command buffers to submit
   */
  submitCommands(commands: GPUCommandBuffer[]): void {
    this.device.queue.submit(commands);
  }

  /**
   * Writes data to a GPU buffer.
   * @param buffer - The target buffer
   * @param data - The data to write
   * @param offset - Optional byte offset (default: 0)
   */
  writeBuffer(buffer: GPUBuffer, data: BufferSource, offset?: number): void {
    this.device.queue.writeBuffer(buffer, offset ?? 0, data);
  }

  /**
   * Writes data to a GPU texture.
   * @param destination - The destination texture
   * @param data - The data to write
   * @param dataLayout - The layout of the data
   * @param size - The size of the data
   */
  writeTexture(
    destination: GPUImageCopyTexture,
    data: BufferSource,
    dataLayout: GPUImageDataLayout,
    size: GPUExtent3D
  ): void {
    this.device.queue.writeTexture(destination, data, dataLayout, size);
  }

  /**
   * Destroys the GPU device and releases resources.
   */
  destroy(): void {
    this.device.destroy();
  }
}
