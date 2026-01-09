// Vertex color shader - uses colors stored in vertex data

export const vertexColorVertexShader = /* wgsl */ `
struct Uniforms {
  modelMatrix: mat4x4<f32>,
  viewProjectionMatrix: mat4x4<f32>,
}

@group(0) @binding(0) var<uniform> uniforms: Uniforms;

struct VertexInput {
  @location(0) position: vec3<f32>,
  @location(1) normal: vec3<f32>,
  @location(2) uv: vec2<f32>,
  @location(3) color: vec3<f32>,
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
  output.color = input.color;
  return output;
}
`;

export const vertexColorFragmentShader = /* wgsl */ `
struct MaterialUniforms {
  opacity: f32,
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
  return vec4<f32>(input.color, material.opacity);
}
`;
