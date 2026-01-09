# Axis GPU Documentation Guide

This document explains how the documentation system works for the Axis GPU library.

## Overview

Axis GPU uses **TypeDoc** with the **typedoc-plugin-markdown** plugin to automatically generate comprehensive API documentation from JSDoc comments in the source code.

## Generating Documentation

### Commands

```bash
# Generate documentation once
bun run docs

# Watch mode - regenerate on file changes
bun run docs:watch
```

### Output

Documentation is generated as Markdown files in the `docs/` directory:

```
docs/
├── README.md                 # Main documentation entry point
├── globals.md               # Global exports
├── classes/                 # Class documentation
│   ├── GPUContext.md
│   ├── Renderer.md
│   ├── Vec2.md
│   └── ...
├── interfaces/              # Interface documentation
│   ├── RendererOptions.md
│   └── ...
├── type-aliases/           # Type alias documentation
└── variables/              # Exported variables
```

## JSDoc Comment Style

All public APIs are documented using JSDoc comments. Here's the style guide:

### Class Documentation

```typescript
/**
 * Brief description of the class.
 * More detailed explanation if needed.
 * 
 * @example
 * ```typescript
 * const instance = new MyClass();
 * instance.doSomething();
 * ```
 */
export class MyClass {
  // ...
}
```

### Method Documentation

```typescript
/**
 * Brief description of what the method does.
 * 
 * @param paramName - Description of the parameter
 * @param optionalParam - Description (default: value)
 * @returns Description of the return value
 * @throws Error description if applicable
 */
public myMethod(paramName: string, optionalParam: number = 0): ReturnType {
  // ...
}
```

### Property Documentation

```typescript
/**
 * Description of the property.
 */
public myProperty: Type;
```

### Interface Documentation

```typescript
/**
 * Description of the interface purpose.
 */
export interface MyInterface {
  /** Description of this property */
  property: Type;
}
```

## Configuration

Documentation generation is configured in `typedoc.json`:

```json
{
  "$schema": "https://typedoc.org/schema.json",
  "entryPoints": ["./src/index.ts"],
  "out": "./docs",
  "plugin": ["typedoc-plugin-markdown"],
  "readme": "./README.md",
  "includeVersion": true,
  "excludePrivate": true,
  "excludeProtected": false,
  "excludeInternal": true
}
```

### Key Configuration Options

- **entryPoints**: Starting point for documentation generation
- **out**: Output directory for generated docs
- **plugin**: Uses markdown plugin for MD output instead of HTML
- **excludePrivate**: Private members are not documented
- **excludeProtected**: Protected members are included
- **excludeInternal**: Members marked with `@internal` are excluded

## Best Practices

### 1. Document All Public APIs

Every exported class, interface, function, and type should have JSDoc comments.

### 2. Include Examples

Use `@example` tags with code blocks to show usage:

```typescript
/**
 * @example
 * ```typescript
 * const vec = new Vec2(3, 4);
 * console.log(vec.length()); // 5
 * ```
 */
```

### 3. Document Parameters Clearly

Always describe what each parameter does and its expected type/range:

```typescript
/**
 * @param angle - The rotation angle in radians (0 to 2π)
 * @param normalize - Whether to normalize the result (default: false)
 */
```

### 4. Specify Return Values

Clearly document what the method returns:

```typescript
/**
 * @returns A new normalized vector, or zero vector if length is 0
 */
```

### 5. Note Side Effects

If a method modifies state, mention it:

```typescript
/**
 * Normalizes this vector in-place.
 * @returns This vector for method chaining
 */
```

### 6. Use `@throws` for Errors

Document when methods can throw errors:

```typescript
/**
 * @throws Error if WebGPU is not supported
 */
```

## Viewing Documentation

### Local Viewing

1. Generate docs: `bun run docs`
2. Open `docs/README.md` in any Markdown viewer
3. Navigate through the class/interface links

### IDE Integration

Most modern IDEs (VS Code, WebStorm) will show JSDoc comments as hover tooltips and in autocomplete, providing inline documentation while coding.

## Maintenance

### When Adding New Features

1. Write JSDoc comments for all new public APIs
2. Include usage examples
3. Run `bun run docs` to verify documentation generates correctly
4. Check for TypeScript errors in the doc generation output

### When Modifying APIs

1. Update JSDoc comments to reflect changes
2. Update examples if behavior changed
3. Regenerate documentation
4. Review the generated docs for accuracy

## Dependencies

- **typedoc**: ^0.28.15 - Main documentation generator
- **typedoc-plugin-markdown**: ^4.9.0 - Markdown output plugin
- **@webgpu/types**: ^0.1.68 - WebGPU TypeScript definitions

## Troubleshooting

### Documentation Not Generating

1. Check for TypeScript errors: `bun run docs`
2. Ensure all imports are valid
3. Verify `typedoc.json` configuration

### Missing Documentation

1. Ensure the API is exported from `src/index.ts`
2. Check that it's not marked as `@internal`
3. Verify JSDoc comments are properly formatted

### Type Errors During Generation

1. Run `tsc --noEmit` to check for type errors
2. Fix any type issues in the source code
3. Regenerate documentation

## Additional Resources

- [TypeDoc Documentation](https://typedoc.org/)
- [JSDoc Reference](https://jsdoc.app/)
- [TypeDoc Markdown Plugin](https://github.com/tgreyuk/typedoc-plugin-markdown)
