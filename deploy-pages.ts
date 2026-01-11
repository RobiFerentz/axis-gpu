#!/usr/bin/env bun
import { mkdir, rm, cp, readdir, readFile, writeFile } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

const OUTPUT_DIR = '_site';

async function main() {
  console.log('🏗️  Building Axis GPU for deployment...\n');

  // Clean output directory
  if (existsSync(OUTPUT_DIR)) {
    console.log('🧹 Cleaning output directory...');
    await rm(OUTPUT_DIR, { recursive: true });
  }
  await mkdir(OUTPUT_DIR, { recursive: true });

  // Step 1: Build the library
  console.log('\n📦 Building library...');
  const buildLib = Bun.spawn(['bun', 'run', 'build'], {
    stdout: 'inherit',
    stderr: 'inherit',
  });
  await buildLib.exited;
  if (buildLib.exitCode !== 0) {
    console.error('❌ Library build failed');
    process.exit(1);
  }

  // Step 2: Copy dist folder
  console.log('\n📁 Copying dist folder...');
  await cp('dist', join(OUTPUT_DIR, 'dist'), { recursive: true });
  console.log('✓ Copied dist/');

  // Step 3: Build examples
  console.log('\n🎨 Building examples...');
  await mkdir(join(OUTPUT_DIR, 'examples'), { recursive: true });
  
  const exampleFiles = await readdir('examples');
  const tsFiles = exampleFiles.filter(f => f.endsWith('.ts'));
  
  for (const tsFile of tsFiles) {
    const jsFile = tsFile.replace('.ts', '.js');
    console.log(`  Transpiling ${tsFile} -> ${jsFile}`);
    
    // Read the TypeScript file and transpile it
    const tsContent = await readFile(join('examples', tsFile), 'utf-8');
    
    // Use Bun's transpiler to convert TS to JS without bundling
    const transpiler = new Bun.Transpiler({
      loader: 'ts',
      target: 'browser',
    });
    
    const jsContent = transpiler.transformSync(tsContent);
    await writeFile(join(OUTPUT_DIR, 'examples', jsFile), jsContent);
  }

  // Step 4: Copy and transform HTML files
  console.log('\n📄 Processing HTML files...');
  const htmlFiles = exampleFiles.filter(f => f.endsWith('.html'));
  
  for (const htmlFile of htmlFiles) {
    console.log(`  Processing ${htmlFile}`);
    let content = await readFile(join('examples', htmlFile), 'utf-8');
    
    // Replace .ts references with .js
    content = content.replace(/\.ts"/g, '.js"');
    
    // Fix absolute paths for GitHub Pages project deployment
    // /examples/ -> ./ (for navigation within examples)
    content = content.replace(/href="\/examples\/"/g, 'href="./"');
    
    // Make example links relative
    content = content.replace(/href="(0[1-9]-.*?\.html)"/g, 'href="./$1"');
    
    await writeFile(join(OUTPUT_DIR, 'examples', htmlFile), content);
  }

  // Step 5: Copy other files (README, etc.)
  console.log('\n📋 Copying additional files...');
  const otherFiles = exampleFiles.filter(f => f.endsWith('.md'));
  for (const file of otherFiles) {
    await cp(join('examples', file), join(OUTPUT_DIR, 'examples', file));
    console.log(`  Copied ${file}`);
  }

  // Step 6: Show final structure
  console.log('\n📊 Final structure:');
  const distFiles = await readdir(join(OUTPUT_DIR, 'dist'));
  console.log(`  dist/ (${distFiles.length} files)`);
  
  const examplesFiles = await readdir(join(OUTPUT_DIR, 'examples'));
  console.log(`  examples/ (${examplesFiles.length} files)`);
  examplesFiles.forEach(f => console.log(`    - ${f}`));

  console.log('\n✅ Build complete! Output in _site/\n');
}

main().catch(console.error);
