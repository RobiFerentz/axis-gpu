// Wireframe shader for line rendering

export const wireframeVertexShader = /* wgsl */ `
struct Uniforms {
  modelMatrix: mat4x4<f32>,
  viewProjectionMatrix: mat4x4<f32>,
}

@group(0) @binding(0) var<uniform> uniforms: Uniforms;

struct VertexInput {
  @location(0) position: vec3<f32>,
  @location(1) color: vec3<f32>,
}

struct VertexOutput {
  @builtin(position) position: vec4<f32>,
  @location(0) color: vec3<f32>,
}

@vertex
fn main(input: VertexInput) -> VertexOutput {
  var output: VertexOutput;
  let worldPosition = uniforms.modelMatrix * vec4<f32>(input.position, 1.0);
  output.position = uniforms.viewProjectionMatrix * worldPosition;
  output.color = input.color;
  return output;
}
`;

export const wireframeFragmentShader = /* wgsl */ `
struct FragmentInput {
  @location(0) color: vec3<f32>,
}

@fragment
fn main(input: FragmentInput) -> @location(0) vec4<f32> {
  return vec4<f32>(input.color, 1.0);
}
`;
