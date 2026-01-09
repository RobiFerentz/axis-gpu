// Simple Phong lighting shader

export const litVertexShader = /* wgsl */ `
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
}

@vertex
fn main(input: VertexInput) -> VertexOutput {
  var output: VertexOutput;
  let worldPosition = uniforms.modelMatrix * vec4<f32>(input.position, 1.0);
  output.position = uniforms.viewProjectionMatrix * worldPosition;
  output.worldPosition = worldPosition.xyz;
  output.normal = normalize((uniforms.modelMatrix * vec4<f32>(input.normal, 0.0)).xyz);
  output.uv = input.uv;
  return output;
}
`;

export const litFragmentShader = /* wgsl */ `
struct MaterialUniforms {
  color: vec4<f32>,
  shininess: f32,
  padding: vec3<f32>,
}

struct LightUniforms {
  position: vec3<f32>,
  padding1: f32,
  color: vec3<f32>,
  padding2: f32,
  ambient: vec3<f32>,
  padding3: f32,
  cameraPosition: vec3<f32>,
  padding4: f32,
}

@group(1) @binding(0) var<uniform> material: MaterialUniforms;
@group(1) @binding(1) var<uniform> light: LightUniforms;

struct FragmentInput {
  @location(0) worldPosition: vec3<f32>,
  @location(1) normal: vec3<f32>,
  @location(2) uv: vec2<f32>,
}

@fragment
fn main(input: FragmentInput) -> @location(0) vec4<f32> {
  let normal = normalize(input.normal);
  
  // Ambient
  let ambient = light.ambient * material.color.rgb;
  
  // Diffuse
  let lightDir = normalize(light.position - input.worldPosition);
  let diff = max(dot(normal, lightDir), 0.0);
  let diffuse = diff * light.color * material.color.rgb;
  
  // Specular
  let viewDir = normalize(light.cameraPosition - input.worldPosition);
  let reflectDir = reflect(-lightDir, normal);
  let spec = pow(max(dot(viewDir, reflectDir), 0.0), material.shininess);
  let specular = spec * light.color;
  
  let result = ambient + diffuse + specular;
  return vec4<f32>(result, material.color.a);
}
`;
