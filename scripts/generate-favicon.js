const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const toIco = require('to-ico');

// Ensure directories exist
const publicDir = path.join(__dirname, '../public');
const tempDir = path.join(__dirname, '../temp');

if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}

// Create a square canvas with the logo
async function generateLogo() {
  // Create a transparent background
  const size = 256;
  const padding = 28;
  const logoSize = size - (padding * 2);
  
  // Create the base canvas with transparent background
  const canvas = Buffer.from(
    `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#3b82f6" />
          <stop offset="100%" stop-color="#8b5cf6" />
        </linearGradient>
      </defs>
      <g>
        <!-- Blurred background for glow effect -->
        <rect x="${padding}" y="${padding}" width="${logoSize}" height="${logoSize}" rx="16" 
              fill="url(#gradient)" filter="blur(8px)" opacity="0.75" />
        
        <!-- Main shape -->
        <rect x="${padding}" y="${padding}" width="${logoSize}" height="${logoSize}" rx="16" 
              fill="url(#gradient)" />
        
        <!-- Letter S -->
        <text x="${size/2}" y="${size/2 + 42}" 
              font-family="Arial, sans-serif" font-size="120" 
              font-weight="bold" fill="white" text-anchor="middle">
          S
        </text>
      </g>
    </svg>`
  );

  // Generate PNG files in different sizes
  const sizes = [16, 32, 48, 64, 128, 256];
  const pngOutputs = [];
  const pngBuffers = [];

  for (const s of sizes) {
    const outputPath = path.join(tempDir, `favicon-${s}.png`);
    await sharp(canvas)
      .resize(s, s)
      .png()
      .toFile(outputPath);
    pngOutputs.push(outputPath);
    
    // Read the PNG file for ICO conversion
    if (s === 16 || s === 32 || s === 48 || s === 64) {
      const buffer = fs.readFileSync(outputPath);
      pngBuffers.push(buffer);
    }
  }

  console.log('Generated PNG files in different sizes');
  
  // Create favicon.ico with multiple sizes
  const icoBuffer = await toIco(pngBuffers);
  fs.writeFileSync(path.join(publicDir, 'favicon.ico'), icoBuffer);
  
  // Also save a PNG version
  await sharp(path.join(tempDir, 'favicon-32.png'))
    .toFile(path.join(publicDir, 'favicon.png'));
    
  console.log('Generated favicon.ico and favicon.png in public directory');
}

generateLogo().catch(console.error); 