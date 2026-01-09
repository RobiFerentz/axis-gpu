// Gradient shader with vertex color interpolation

export const gradientVertexShader = /* wgsl */ `
struct Uniforms {
  modelMatrix: mat4x4<f32>,
  viewProjectionMatrix: mat4x4<f32>,
}

@group(0) @binding(0) var<uniform> uniforms: Uniforms;

struct VertexInput {
  @location(0) position: vec3<f32>,
  @location(1) normal: vec3<f32>,
  @location(2) uv: vec2<f32>,
}

struct VertexOutput {
  @builtin(position) position: vec4<f32>,
  @location(0) worldPosition: vec3<f32>,
  @location(1) normal: vec3<f32>,
  @location(2) uv: vec2<f32>,
  @location(3) color: vec3<f32>,
}

@vertex
fn main(input: VertexInput) -> VertexOutput {
  var output: VertexOutput;
  let worldPosition = uniforms.modelMatrix * vec4<f32>(input.position, 1.0);
  output.position = uniforms.viewProjectionMatrix * worldPosition;
  output.worldPosition = worldPosition.xyz;
  output.normal = (uniforms.modelMatrix * vec4<f32>(input.normal, 0.0)).xyz;
  output.uv = input.uv;
  
  // Create gradient based on position
  // Map position from [-1, 1] to color range
  let normalizedPos = (input.position + vec3<f32>(1.0, 1.0, 1.0)) * 0.5;
  output.color = normalizedPos;
  
  return output;
}
`;

export const gradientFragmentShader = /* wgsl */ `
struct MaterialUniforms {
  intensity: f32,
  padding: vec3<f32>,
}

@group(1) @binding(0) var<uniform> material: MaterialUniforms;

struct FragmentInput {
  @location(0) worldPosition: vec3<f32>,
  @location(1) normal: vec3<f32>,
  @location(2) uv: vec2<f32>,
  @location(3) color: vec3<f32>,
}

@fragment
fn main(input: FragmentInput) -> @location(0) vec4<f32> {
  // Use the interpolated color from vertex shader
  let finalColor = input.color * material.intensity;
  return vec4<f32>(finalColor, 1.0);
}
`;
