// Simple dev server that serves TypeScript files transpiled to JavaScript
import { resolve, join } from 'path';

const projectRoot = import.meta.dir;

const server = Bun.serve({
  port: 3000,
  async fetch(req) {
    const url = new URL(req.url);
    let pathname = url.pathname;
    
    // Default to index.html for root
    if (pathname === '/' || pathname === '') {
      pathname = '/examples/index.html';
    }
    
    // Remove leading slash and resolve relative to project root
    const relativePath = pathname.startsWith('/') ? pathname.slice(1) : pathname;
    let filePath = join(projectRoot, relativePath);
    
    console.log(`Request: ${pathname} -> ${filePath}`);
    
    try {
      // Check if path is a directory
      const stat = await Bun.file(filePath).exists();
      
      // If path ends with / or is a directory, try to serve index.html
      if (pathname.endsWith('/')) {
        filePath = join(filePath, 'index.html');
        console.log(`  -> Trying index.html: ${filePath}`);
      }
      
      // Check if file exists
      let file = Bun.file(filePath);
      let exists = await file.exists();
      
      // If file doesn't exist and has no extension, try adding .ts
      if (!exists && !filePath.match(/\.[^/.]+$/)) {
        const tsPath = `${filePath}.ts`;
        console.log(`  -> Trying with .ts extension: ${tsPath}`);
        file = Bun.file(tsPath);
        exists = await file.exists();
        if (exists) {
          filePath = tsPath;
        }
      }
      
      // Still not found? Try .js
      if (!exists && !filePath.match(/\.[^/.]+$/)) {
        const jsPath = `${filePath}.js`;
        console.log(`  -> Trying with .js extension: ${jsPath}`);
        file = Bun.file(jsPath);
        exists = await file.exists();
        if (exists) {
          filePath = jsPath;
        }
      }
      
      if (!exists) {
        console.log(`File not found: ${filePath}`);
        return new Response(`Not Found: ${pathname}\nTried: ${filePath}`, { status: 404 });
      }
      
      // Handle TypeScript files - transpile them
      if (filePath.endsWith('.ts')) {
        const transpiler = new Bun.Transpiler({
          loader: 'ts',
        });
        
        const source = await file.text();
        const js = transpiler.transformSync(source);
        
        return new Response(js, {
          headers: {
            'Content-Type': 'application/javascript',
            'Cache-Control': 'no-cache',
          },
        });
      }
      
      // Serve other files normally with appropriate content type
      const response = new Response(file);
      
      // Set content type based on extension
      if (filePath.endsWith('.html')) {
        response.headers.set('Content-Type', 'text/html');
      } else if (filePath.endsWith('.css')) {
        response.headers.set('Content-Type', 'text/css');
      } else if (filePath.endsWith('.js')) {
        response.headers.set('Content-Type', 'application/javascript');
      }
      
      return response;
    } catch (error) {
      console.error('Error serving file:', error);
      return new Response(`Internal Server Error: ${error}`, { status: 500 });
    }
  },
});

console.log(`🚀 Dev server running at http://localhost:${server.port}`);
console.log(`📁 Examples: http://localhost:${server.port}/examples/`);
console.log('\nAvailable examples:');
console.log('  • http://localhost:3000/examples/01-basic-setup.html');
console.log('  • http://localhost:3000/examples/02-primitives.html');
console.log('  • http://localhost:3000/examples/03-animation.html');
console.log('  • http://localhost:3000/examples/04-scene-graph.html');
