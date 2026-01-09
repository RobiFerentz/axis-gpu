import { GPUContext } from '../core/GPUContext';
import { Texture } from './Texture';

export class ProceduralTextures {
  /**
   * Creates a dice texture with black dots on light brown faces (1-6)
   * Layout: 2x3 grid where each cell is one face of the dice
   */
  static createDiceTexture(context: GPUContext, faceSize: number = 256): Texture {
    const size = faceSize * 3; // 3 faces wide
    const rows = 2; // 2 faces tall
    
    const texture = Texture.createFromSize(size, faceSize * rows, 'Dice Texture');
    texture.create(context);

    const data = new Uint8Array(size * faceSize * rows * 4);
    
    // Light brown/beige color for dice faces
    const bgR = 220, bgG = 190, bgB = 150;
    // Darker brown for edges
    const edgeR = 150, edgeG = 120, edgeB = 90;
    const edgeWidth = faceSize * 0.05; // 5% border
    
    // Fill with background color and edges
    for (let y = 0; y < faceSize * rows; y++) {
      for (let x = 0; x < size; x++) {
        const index = (y * size + x) * 4;
        
        // Determine which face we're in
        const faceCol = Math.floor(x / faceSize);
        const faceRow = Math.floor(y / faceSize);
        
        // Position within the face
        const localX = x - faceCol * faceSize;
        const localY = y - faceRow * faceSize;
        
        // Check if we're on an edge
        const isEdge = localX < edgeWidth || localX >= faceSize - edgeWidth ||
                       localY < edgeWidth || localY >= faceSize - edgeWidth;
        
        if (isEdge) {
          // Darker edge color
          data[index] = edgeR;
          data[index + 1] = edgeG;
          data[index + 2] = edgeB;
        } else {
          // Main face color
          data[index] = bgR;
          data[index + 1] = bgG;
          data[index + 2] = bgB;
        }
        data[index + 3] = 255;
      }
    }
    
    // Helper to draw a dot
    const drawDot = (centerX: number, centerY: number, radius: number) => {
      for (let y = 0; y < faceSize * rows; y++) {
        for (let x = 0; x < size; x++) {
          const dx = x - centerX;
          const dy = y - centerY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          if (dist <= radius) {
            const index = (y * size + x) * 4;
            // Black dot
            data[index] = 20;
            data[index + 1] = 20;
            data[index + 2] = 20;
            data[index + 3] = 255;
          }
        }
      }
    };
    
    const dotRadius = faceSize * 0.08;
    const margin = faceSize * 0.3;
    
    // Draw dots for each face (arranged in 2x3 grid)
    // Face positions: [face1, face2, face3] on top row, [face4, face5, face6] on bottom row
    const faces = [
      { num: 1, col: 0, row: 0 }, // Face 1
      { num: 2, col: 1, row: 0 }, // Face 2
      { num: 3, col: 2, row: 0 }, // Face 3
      { num: 4, col: 0, row: 1 }, // Face 4
      { num: 5, col: 1, row: 1 }, // Face 5
      { num: 6, col: 2, row: 1 }, // Face 6
    ];
    
    faces.forEach(face => {
      const offsetX = face.col * faceSize;
      const offsetY = face.row * faceSize;
      const centerX = offsetX + faceSize / 2;
      const centerY = offsetY + faceSize / 2;
      
      switch(face.num) {
        case 1:
          // One dot in center
          drawDot(centerX, centerY, dotRadius);
          break;
        case 2:
          // Two dots diagonal
          drawDot(offsetX + margin, offsetY + margin, dotRadius);
          drawDot(offsetX + faceSize - margin, offsetY + faceSize - margin, dotRadius);
          break;
        case 3:
          // Three dots diagonal
          drawDot(offsetX + margin, offsetY + margin, dotRadius);
          drawDot(centerX, centerY, dotRadius);
          drawDot(offsetX + faceSize - margin, offsetY + faceSize - margin, dotRadius);
          break;
        case 4:
          // Four dots in corners
          drawDot(offsetX + margin, offsetY + margin, dotRadius);
          drawDot(offsetX + faceSize - margin, offsetY + margin, dotRadius);
          drawDot(offsetX + margin, offsetY + faceSize - margin, dotRadius);
          drawDot(offsetX + faceSize - margin, offsetY + faceSize - margin, dotRadius);
          break;
        case 5:
          // Five dots (four corners + center)
          drawDot(offsetX + margin, offsetY + margin, dotRadius);
          drawDot(offsetX + faceSize - margin, offsetY + margin, dotRadius);
          drawDot(centerX, centerY, dotRadius);
          drawDot(offsetX + margin, offsetY + faceSize - margin, dotRadius);
          drawDot(offsetX + faceSize - margin, offsetY + faceSize - margin, dotRadius);
          break;
        case 6:
          // Six dots (two columns of three)
          drawDot(offsetX + margin, offsetY + margin, dotRadius);
          drawDot(offsetX + margin, centerY, dotRadius);
          drawDot(offsetX + margin, offsetY + faceSize - margin, dotRadius);
          drawDot(offsetX + faceSize - margin, offsetY + margin, dotRadius);
          drawDot(offsetX + faceSize - margin, centerY, dotRadius);
          drawDot(offsetX + faceSize - margin, offsetY + faceSize - margin, dotRadius);
          break;
      }
    });

    texture.uploadData(context, data, size, faceSize * rows);
    return texture;
  }
  /**
   * Creates a simple Earth-like texture with blue oceans and green/brown landmasses
   */
  static createEarthTexture(context: GPUContext, size: number = 512): Texture {
    const texture = Texture.createFromSize(size, size, 'Earth Texture');
    texture.create(context);

    const data = new Uint8Array(size * size * 4);
    
    // Simple noise function for landmass generation
    const noise = (x: number, y: number, scale: number): number => {
      const nx = x * scale;
      const ny = y * scale;
      return (Math.sin(nx * 2.1 + ny * 1.3) + 
              Math.sin(nx * 1.7 - ny * 2.3) + 
              Math.sin((nx + ny) * 1.5)) / 3;
    };

    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const index = (y * size + x) * 4;
        
        // Normalize coordinates to 0-1
        const u = x / size;
        const v = y / size;
        
        // Generate land/water using multiple octaves of noise
        const n1 = noise(u, v, 5);
        const n2 = noise(u, v, 10) * 0.5;
        const n3 = noise(u, v, 20) * 0.25;
        const combined = (n1 + n2 + n3) / 1.75;
        
        // Polar ice caps
        const polarFactor = Math.abs(v - 0.5) * 2; // 0 at equator, 1 at poles
        const iceCap = polarFactor > 0.8 ? 1 : 0;
        
        if (iceCap) {
          // White ice caps
          data[index] = 240;
          data[index + 1] = 250;
          data[index + 2] = 255;
        } else if (combined > 0.1) {
          // Land - green/brown
          const landVariation = noise(u * 3, v * 3, 15) * 0.3;
          data[index] = Math.floor(60 + landVariation * 100);     // R
          data[index + 1] = Math.floor(120 + landVariation * 80); // G
          data[index + 2] = Math.floor(40 + landVariation * 60);  // B
        } else {
          // Ocean - blue
          const depth = -combined * 2;
          data[index] = Math.floor(20 + depth * 30);      // R
          data[index + 1] = Math.floor(60 + depth * 40);  // G
          data[index + 2] = Math.floor(120 + depth * 80); // B
        }
        
        data[index + 3] = 255; // Alpha
      }
    }

    texture.uploadData(context, data, size, size);
    return texture;
  }

  /**
   * Creates a simple moon-like texture with gray craters
   */
  static createMoonTexture(context: GPUContext, size: number = 256): Texture {
    const texture = Texture.createFromSize(size, size, 'Moon Texture');
    texture.create(context);

    const data = new Uint8Array(size * size * 4);
    
    const noise = (x: number, y: number, scale: number): number => {
      const nx = x * scale;
      const ny = y * scale;
      return (Math.sin(nx * 3.1 + ny * 2.7) + 
              Math.sin(nx * 2.3 - ny * 3.1)) / 2;
    };

    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const index = (y * size + x) * 4;
        
        const u = x / size;
        const v = y / size;
        
        // Base gray color with noise
        const n = noise(u, v, 8) * 0.5 + 0.5;
        const gray = Math.floor(120 + n * 80);
        
        data[index] = gray;
        data[index + 1] = gray;
        data[index + 2] = gray;
        data[index + 3] = 255;
      }
    }

    texture.uploadData(context, data, size, size);
    return texture;
  }

  /**
   * Creates a sun-like texture with bright yellow/orange colors
   */
  static createSunTexture(context: GPUContext, size: number = 256): Texture {
    const texture = Texture.createFromSize(size, size, 'Sun Texture');
    texture.create(context);

    const data = new Uint8Array(size * size * 4);
    
    const noise = (x: number, y: number, scale: number): number => {
      const nx = x * scale;
      const ny = y * scale;
      return (Math.sin(nx * 4.1) + Math.sin(ny * 3.7) + 
              Math.sin((nx + ny) * 2.3)) / 3;
    };

    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const index = (y * size + x) * 4;
        
        const u = x / size;
        const v = y / size;
        
        const n = noise(u, v, 6) * 0.3 + 0.7;
        
        data[index] = Math.floor(255 * n);     // R - bright
        data[index + 1] = Math.floor(200 * n); // G - orange-yellow
        data[index + 2] = Math.floor(50 * n);  // B - minimal blue
        data[index + 3] = 255;
      }
    }

    texture.uploadData(context, data, size, size);
    return texture;
  }
}
